# Site LSV – déploiement

1. Copier `.env.example` en `.env` et le remplir.
2. Pointer le DNS du domaine vers le serveur (ports 80 et 443 ouverts).
3. Lancer : `docker compose up -d --build`
4. HTTPS (Let's Encrypt) est obtenu automatiquement par Caddy.

## Commandes utiles
- Logs : `docker compose logs -f api`
- Voir les demandes : `docker compose exec db psql -U lsv -c "select prenom,nom,prestation,date_souhaitee,statut from rendez_vous order by created_at desc;"`
- Restaurer une sauvegarde : `gunzip -c backups/lsv_AAAA-MM-JJ.sql.gz | docker compose exec -T db psql -U lsv lsv`

## À ajouter pour la production
- Chiffrer et copier les sauvegardes hors serveur (age + rclone), tester la restauration.
- Captcha Cloudflare Turnstile ou hCaptcha sur le formulaire.
- Serveur : accès SSH par clé uniquement, pare-feu (ufw), mises à jour automatiques.
