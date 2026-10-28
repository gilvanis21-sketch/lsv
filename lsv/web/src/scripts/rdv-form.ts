// Logique du formulaire de rendez-vous : validation côté client, envoi à /api/rdv,
// messages d'erreur par champ et message global, écran de confirmation.
// La validation reprend les règles du schéma zod de l'API pour éviter les allers-retours inutiles.

const MESSAGES = {
  required: 'Ce champ est obligatoire.',
  email: 'Saisissez une adresse e-mail valide, par exemple nom@domaine.fr.',
  tel: 'Saisissez un numéro de téléphone valide (6 caractères minimum).',
  datePast: 'Choisissez une date à partir d’aujourd’hui.',
  consent: 'Votre accord est nécessaire pour traiter la demande.',
  invalid: 'Certaines informations sont invalides. Vérifiez les champs signalés puis réessayez.',
  tooMany: 'Trop de demandes ont été envoyées depuis votre connexion. Merci de réessayer dans 15 minutes ou de nous appeler.',
  server: 'Le service est momentanément indisponible. Merci de réessayer plus tard ou de nous appeler.',
  network: 'Impossible de joindre le serveur. Vérifiez votre connexion internet puis réessayez.',
};

/** Date locale du jour au format AAAA-MM-JJ (évite le décalage UTC de toISOString). */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type Field = HTMLInputElement | HTMLSelectElement;

export function initRdvForm(formId = 'rdv-form', doneId = 'rdv-done', alertId = 'rdv-alert') {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const done = document.getElementById(doneId);
  const alertBox = document.getElementById(alertId);
  if (!form || !done || !alertBox) return;

  const el = (name: string) => form.elements.namedItem(name) as Field;
  const date = el('date') as HTMLInputElement;
  date.min = today();

  // Présélection depuis une page service : /rendez-vous/?prestation=Bilan%20vocal
  const pre = new URLSearchParams(location.search).get('prestation');
  const select = el('prestation') as HTMLSelectElement;
  if (pre && [...select.options].some((o) => o.value === pre)) select.value = pre;

  const setError = (field: Field, msg: string) => {
    const err = document.getElementById(`${field.id}-err`);
    if (err) err.textContent = msg;
    if (msg) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };

  const check = (field: Field): string => {
    const v = field.value.trim();
    if (field instanceof HTMLInputElement && field.type === 'checkbox') return field.checked ? '' : MESSAGES.consent;
    if (field.required && !v) return MESSAGES.required;
    if (field.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MESSAGES.email;
    if (field.name === 'tel' && (v.length < 6 || !/^[+()\d.\s-]+$/.test(v))) return MESSAGES.tel;
    if (field.name === 'date' && v < today()) return MESSAGES.datePast;
    return '';
  };

  const fields = ['prenom', 'nom', 'email', 'tel', 'prestation', 'date', 'plage', 'consent'].map(el);

  // Validation au fil de l'eau, une fois le champ quitté (pas pendant la frappe)
  fields.forEach((f) => {
    f.addEventListener('blur', () => { if (f.value || f.hasAttribute('aria-invalid')) setError(f, check(f)); });
    f.addEventListener('change', () => { if (f.hasAttribute('aria-invalid')) setError(f, check(f)); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.textContent = '';

    let firstInvalid: Field | null = null;
    for (const f of fields) {
      const msg = check(f);
      setError(f, msg);
      if (msg && !firstInvalid) firstInvalid = f;
    }
    if (firstInvalid) { firstInvalid.focus(); return; }

    const consent = el('consent') as HTMLInputElement;
    // Format attendu par l'API : consent === "on" (z.literal('on'))
    const payload = {
      prenom: el('prenom').value.trim(),
      nom: el('nom').value.trim(),
      email: el('email').value.trim(),
      tel: el('tel').value.trim(),
      prestation: el('prestation').value,
      date: date.value,
      plage: el('plage').value,
      consent: consent.checked ? 'on' : '',
      site: (el('site') as HTMLInputElement).value,
    };

    const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';
    form.setAttribute('aria-busy', 'true');

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch('/api/rdv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      if (r.status === 201 || r.status === 204) {
        form.hidden = true;
        done.hidden = false;
        done.focus();
        done.scrollIntoView({ block: 'center' });
        return;
      }
      alertBox.textContent = r.status === 400 ? MESSAGES.invalid : r.status === 429 ? MESSAGES.tooMany : MESSAGES.server;
    } catch {
      alertBox.textContent = MESSAGES.network;
    } finally {
      clearTimeout(timer);
      btn.disabled = false;
      btn.textContent = label;
      form.removeAttribute('aria-busy');
    }
  });
}
