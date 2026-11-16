import "server-only";

type ContactMail = { name: string; email: string; organization: string; subject: string; message: string };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Envoie un message du formulaire de contact directement dans la boîte mail
 * du Docteur, via Resend (https://resend.com). « Répondre » écrit au visiteur.
 * Variables : RESEND_API_KEY (obligatoire), CONTACT_FROM (facultatif).
 */
export async function sendContactEmail(to: string, m: ContactMail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY manquant : impossible d'envoyer l'e-mail de contact.");
  if (!to) throw new Error("Aucune adresse e-mail de destination dans le profil.");

  const from = process.env.CONTACT_FROM || "Site du Dr Gnassoussoumari <onboarding@resend.dev>";
  const rows = [
    ["Nom", m.name],
    ["E-mail", m.email],
    ...(m.organization ? [["Institution / fonction", m.organization]] : []),
    ["Objet", m.subject],
  ];

  const html = `<!doctype html><html><body style="margin:0;background:#f4f1ea;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#14202e">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e1d7">
    <tr><td style="background:#14233a;padding:20px 24px;color:#f3ead9;font-size:13px;letter-spacing:2px;text-transform:uppercase">Nouveau message — site web</td></tr>
    <tr><td style="padding:24px">
      <table role="presentation" width="100%" style="font-size:14px;border-collapse:collapse">
        ${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#5b6573;width:170px;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;font-weight:bold">${esc(v)}</td></tr>`).join("")}
      </table>
      <div style="margin-top:18px;padding:16px;background:#f4f1ea;border-radius:8px;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(m.message)}</div>
      <p style="margin-top:20px;font-size:13px;color:#5b6573">Répondez simplement à cet e-mail pour écrire à ${esc(m.name)}.</p>
    </td></tr>
  </table></body></html>`;

  const text = `${rows.map(([k, v]) => `${k} : ${v}`).join("\n")}\n\n${m.message}\n\n— Répondez à cet e-mail pour écrire à ${m.name}.`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: m.email,
      subject: `[Site] ${m.subject} — ${m.name}`.slice(0, 200),
      html,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status} : ${await res.text()}`);
}
