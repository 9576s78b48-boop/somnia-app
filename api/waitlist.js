// ─────────────────────────────────────────────────────────────
// Somnia — API Waitlist (Vercel Serverless Function)
// Fichier à placer dans : /api/waitlist.js dans ton repo GitHub
// ─────────────────────────────────────────────────────────────

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email de confirmation envoyé à l'utilisateur
const emailHTML = (firstName) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#080a12;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:48px 24px">

    <!-- Logo -->
    <div style="font-size:1.4rem;font-weight:900;color:#ffffff;margin-bottom:32px;letter-spacing:-.02em">
      Som<span style="color:#b8aaff;font-style:italic">nia</span>
    </div>

    <!-- Card -->
    <div style="background:#10121e;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px 36px">

      <!-- Moon emoji -->
      <div style="font-size:2.5rem;margin-bottom:20px">🌙</div>

      <h1 style="font-size:1.6rem;font-weight:700;color:#ffffff;margin:0 0 14px;line-height:1.2">
        Bienvenue sur la liste, ${firstName} !
      </h1>

      <p style="font-size:.92rem;color:#b8c2e0;line-height:1.75;margin:0 0 24px;font-weight:300">
        Vous êtes bien inscrit(e) sur la waitlist Somnia. Vous serez parmi les premiers à recevoir un accès au lancement — avec <strong style="color:#b8aaff">3 mois du plan Pro offerts</strong> (valeur 27€).
      </p>

      <!-- Benefits -->
      <div style="background:rgba(108,94,245,.08);border:1px solid rgba(108,94,245,.18);border-radius:12px;padding:20px 22px;margin-bottom:28px">
        <div style="font-size:.72rem;font-weight:700;color:#9b8ff7;letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px">Ce qui vous attend</div>
        <div style="font-size:.85rem;color:#b8c2e0;line-height:1.8">
          ✦ &nbsp;Accès prioritaire avant le lancement public<br/>
          🎁 &nbsp;3 mois du plan Pro offerts<br/>
          📊 &nbsp;Analyse IA complète de vos nuits<br/>
          🤖 &nbsp;Coach IA disponible 24h/24
        </div>
      </div>

      <p style="font-size:.82rem;color:rgba(184,194,224,.45);line-height:1.7;margin:0">
        En attendant, partagez Somnia à vos proches pour passer en tête de liste ! On vous tient au courant très bientôt.
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top:28px;text-align:center;font-size:.72rem;color:rgba(184,194,224,.25)">
      Somnia · Vous recevez cet email car vous avez rejoint notre waitlist.<br/>
      <a href="#" style="color:rgba(184,194,224,.35);text-decoration:none">Se désinscrire</a>
    </div>
  </div>
</body>
</html>
`;

export default async function handler(req, res) {
  // Sécurité : POST uniquement
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { firstName, email } = req.body;

  // Validation basique
  if (!firstName || !email || !email.includes('@')) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  try {
    // 1. Email de confirmation à l'utilisateur
    await resend.emails.send({
      from: 'Somnia <hello@somnia.app>', // ← remplace par ton domaine vérifié sur Resend
      to: email,ant.gossa@gmail.com
      subject: '🌙 Vous êtes sur la waitlist Somnia !',
      html: emailHTML(firstName),
    });

    // 2. Notification à toi (optionnel — remplace par ton email)
    await resend.emails.send({
      from: 'Somnia <hello@somnia.app>',
      to: 'ant.gossa@gmail.com', // ← remplace par ton email perso
      subject: `🔔 Nouveau inscrit waitlist : ${firstName}`,
      html: `<p>Nouvel inscrit sur la waitlist !</p>
             <p><strong>Prénom :</strong> ${firstName}</p>
             <p><strong>Email :</strong> ${email}</p>
             <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>`,
    });

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Erreur envoi email' });
  }
}
