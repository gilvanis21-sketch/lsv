import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pg from 'pg';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const env = process.env;
const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT || 587),
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});
const send = (to, subject, text) =>
  mailer.sendMail({ from: env.MAIL_FROM, to, subject, text }).catch(e => console.error('Mail:', e.message));

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));

const schema = z.object({
  prenom: z.string().trim().min(1).max(80),
  nom: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  tel: z.string().trim().min(6).max(30),
  prestation: z.enum(['Bilan vocal', 'Accompagnement vocal', 'Voix professionnelle', 'Atelier d’hygiène vocale']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  plage: z.enum(['Matin', 'Après-midi', 'Fin de journée']),
  consent: z.literal('on'),
});

app.post('/api/rdv', async (req, res) => {
  if (req.body?.site) return res.sendStatus(204); // honeypot : on ignore silencieusement
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Données invalides' });
  const d = parsed.data;
  try {
    const { rows } = await pool.query(
      `insert into rendez_vous (prenom, nom, email, tel, prestation, date_souhaitee, plage)
       values ($1,$2,$3,$4,$5,$6,$7) returning token_annulation`,
      [d.prenom, d.nom, d.email, d.tel, d.prestation, d.date, d.plage]);
    const lien = `${env.PUBLIC_URL}/api/rdv/annuler/${rows[0].token_annulation}`;
    await send(d.email, 'Votre demande de rendez-vous – LSV',
      `Bonjour ${d.prenom},\n\nNous avons bien reçu votre demande : ${d.prestation}, le ${d.date} (${d.plage}).\nNous revenons vers vous rapidement pour confirmer le créneau.\n\nPour annuler : ${lien}\n\nLaboratoire Scientifique de la Voix`);
    await send(env.NOTIFY_TO, 'Nouvelle demande de rendez-vous',
      `${d.prenom} ${d.nom}\n${d.email} – ${d.tel}\n${d.prestation}\n${d.date} (${d.plage})`);
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/rdv/annuler/:token', async (req, res) => {
  const { rowCount } = await pool.query(
    `update rendez_vous set statut='annule' where token_annulation=$1 and statut<>'annule'`, [req.params.token]);
  res.type('html').send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
    <body style="font-family:system-ui;max-width:480px;margin:15vh auto;padding:0 20px;text-align:center">
    <h1>${rowCount ? 'Rendez-vous annulé' : 'Lien invalide ou déjà utilisé'}</h1><p><a href="/">Retour au site</a></p></body>`);
});

// Rappel quotidien à 9 h : rendez-vous dans 2 jours
cron.schedule('0 9 * * *', async () => {
  const { rows } = await pool.query(
    `select id, prenom, email, prestation, date_souhaitee, plage, token_annulation from rendez_vous
     where statut<>'annule' and rappel_envoye=false and date_souhaitee = current_date + 2`);
  for (const r of rows) {
    await send(r.email, 'Rappel de votre rendez-vous – LSV',
      `Bonjour ${r.prenom},\n\nRappel : ${r.prestation}, le ${r.date_souhaitee.toISOString().slice(0, 10)} (${r.plage}).\nPour annuler : ${env.PUBLIC_URL}/api/rdv/annuler/${r.token_annulation}`);
    await pool.query('update rendez_vous set rappel_envoye=true where id=$1', [r.id]);
  }
}, { timezone: 'Europe/Paris' });

// Purge RGPD : suppression des demandes de plus de 24 mois
cron.schedule('0 3 * * 0', () =>
  pool.query(`delete from rendez_vous where date_souhaitee < now() - interval '24 months'`), { timezone: 'Europe/Paris' });

app.listen(3000, () => console.log('API LSV prête sur :3000'));
