import React, { useState } from "react";
import {
  Home, Send, Target, BookOpen, HelpCircle, Eye, EyeOff,
  ArrowLeft, ShoppingBag, Coffee, Bus, Smartphone, Gift,
  PiggyBank, Plus, Search, CheckCircle2, Sparkles,
  Wallet, Bell, X, AlertTriangle, ScanLine, Flame, Trophy, ThumbsUp, ThumbsDown, Settings,
  Award, Lock
} from "lucide-react";

// ---------- Palette ING ----------
// "green/greenDeep/mint" = couleur principale ING (orange) — noms gardés pour
// rester simple. "safe/safeSoft" = vert, réservé au sens « sécurisé / argent
// reçu / bonne réponse ». "red/redSoft" = danger.
const C = {
  bg: "#FAFAFA", ink: "#1A1A1A", green: "#FF6200", greenDeep: "#E55800",
  mint: "#FFEAD9", coral: "#FF6200", sun: "#FFA200", soft: "#ECECEC",
  white: "#FFFFFF", red: "#E14B3B", redSoft: "#FDECEA",
  safe: "#0E8A5F", safeSoft: "#D9F2E6",
};

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";

// ---- moteur de détection d'arnaque ----
const FLAGS = [
  { id: "urgence", label: "Urgence / pression", mots: ["urgent", "24h", "48h", "immediat", "tout de suite", "dernier", "expire", "vite", "rapidement"], exp: "On te met la pression pour t'empêcher de réfléchir. Une vraie banque ne te bouscule jamais." },
  { id: "code", label: "Demande de code secret", mots: ["code", "mot de passe", "identifiant", "pin", "otp", "6 chiffres", "3 chiffres", "secret"], exp: "JAMAIS donner son code. Aucune banque ni service ne te le demandera, ni par SMS ni par téléphone." },
  { id: "lien", label: "Lien suspect", mots: ["http", "bit.ly", "clique", "cliquez", "lien", "www", ".xyz", "tinyurl"], exp: "Un lien dans un message non attendu = danger. Ne clique pas, va sur le site officiel toi-même." },
  { id: "gain", label: "Cadeau / gain trop beau", mots: ["gagne", "felicitations", "cadeau", "tirage", "gratuit", "iphone", "recompense"], exp: "Trop beau pour être vrai = c'est faux. On ne gagne pas à un jeu auquel on n'a pas joué." },
  { id: "menace", label: "Menace / compte bloqué", mots: ["bloque", "suspendu", "suspendue", "amende", "poursuite", "desactive", "sanction"], exp: "La peur te fait agir vite, c'est le but de l'arnaqueur. Respire, puis vérifie par toi-même." },
  { id: "frais", label: "Petits frais à payer", mots: ["frais", "payer", "reglez", "regler", "douane", "redevance", "1,99", "2,99", "0,99"], exp: "Payer une petite somme pour « débloquer » un colis ou un compte = piège classique pour voler ta carte." },
  { id: "bancaire", label: "Infos de carte demandées", mots: ["rib", "iban", "numero de carte", "carte bancaire", "cvv", "expiration"], exp: "On ne communique jamais ses infos de carte par message ou téléphone." },
  { id: "expediteur", label: "Expéditeur bizarre", mots: ["@gmail", "@hotmail", "no-reply", "noreply", "numero inconnu", "+33 6", "+44", "sms-"], exp: "Une vraie banque n'écrit pas depuis une adresse Gmail/Hotmail ou un numéro de portable inconnu. Vérifie toujours l'expéditeur." },
  { id: "orthographe", label: "Fautes & formulation étrange", mots: ["chere client", "cher client", "votre compte a ete", "veuillez confirmer", "mise a jour de securite", "verifier vos informations"], exp: "Fautes d'orthographe, tournures bizarres ou « Cher client » impersonnel : souvent le signe d'un faux message traduit à la va-vite." },
  { id: "remboursement", label: "Faux remboursement", mots: ["remboursement", "rembourser", "trop-percu", "trop percu", "credit impot", "vous etes eligible", "caf", "impots"], exp: "« Vous allez être remboursé, cliquez ici » : un classique pour te faire saisir tes coordonnées bancaires. Les administrations ne fonctionnent pas comme ça." },
];

function analyser(texte) {
  const t = norm(texte);
  return FLAGS.filter((f) => f.mots.some((m) => t.includes(norm(m))));
}

const PRESETS = [
  { nom: "📦 Faux colis", txt: "Votre colis n'a pas pu être livré. Réglez 1,99€ de frais de douane sous 24h : http://bit.ly/coli-fr" },
  { nom: "🏦 Faux conseiller", txt: "BANQUE : activité suspecte détectée. Pour bloquer le paiement, communiquez votre code à 6 chiffres immédiatement." },
  { nom: "🎁 Faux gain", txt: "FÉLICITATIONS ! Vous avez gagné un iPhone. Cliquez vite pour réclamer votre cadeau gratuit avant 24h." },
  { nom: "💸 Faux remboursement", txt: "Service des impôts : vous bénéficiez d'un remboursement de 218€. Confirmez vos coordonnées bancaires ici : impots-remboursement.xyz" },
  { nom: "📱 Faux opérateur", txt: "Votre facture mobile n'a pas pu être prélevée. Mettez à jour votre paiement sous 48h pour éviter la coupure : bit.ly/maj-paie" },
  { nom: "✅ Message normal", txt: "Coucou, on se voit à 18h devant le ciné ? 🍿" },
];

const QUIZ = [
  { txt: "Votre compte sera suspendu. Confirmez votre mot de passe ici : bit.ly/secure-bank", arnaque: true, why: "Menace + demande de mot de passe + lien : trois pièges d'un coup." },
  { txt: "Spotify : votre abonnement Premium a été renouvelé. Montant : 5,99€.", arnaque: false, why: "Simple notification, aucune action ni info demandée. C'est normal." },
  { txt: "Salut c'est Lucas, j'ai changé de numéro. Tu peux m'avancer 50€ ? Je te rends ce soir.", arnaque: true, why: "Arnaque au proche : un inconnu se fait passer pour un ami. Appelle Lucas sur son vrai numéro." },
  { txt: "Rappel : RDV chez le dentiste demain à 14h. Cabinet Dupont.", arnaque: false, why: "Information neutre, rien à payer, rien à cliquer. Légitime." },
  { txt: "Vous avez gagné 1000€ ! Réglez 2€ de frais pour débloquer votre prix.", arnaque: true, why: "Gain + petits frais à payer = arnaque classique." },
  { txt: "Le Bon Coin : l'acheteur a payé, cliquez pour valider la livraison et recevoir votre argent : lbc-paiement.com", arnaque: true, why: "Arnaque au paiement en ligne : le vrai site ne te demande jamais de « valider » via un lien externe pour être payé." },
  { txt: "Ton colis Vinted est en route ! Suivi disponible dans l'appli.", arnaque: false, why: "Notification simple, sans lien suspect ni demande d'argent. Le suivi est dans l'appli officielle : normal." },
  { txt: "POLICE : une amende impayée de 35€ va être majorée. Payez immédiatement : amendes-gouv.net", arnaque: true, why: "Menace + urgence + lien douteux. L'administration ne réclame jamais un paiement par SMS avec un lien." },
  { txt: "Code de validation : 4821. Ne le communiquez à personne.", arnaque: false, why: "C'est un vrai code reçu après TON action. Le piège serait que quelqu'un te DEMANDE ce code : là, ne le donne jamais." },
  { txt: "Maman a changé de num. Envoie-moi 80€ par virement, je t'expliquerai. Bisous", arnaque: true, why: "Arnaque au proche : urgence + nouveau numéro + demande d'argent. Appelle ta mère sur son vrai numéro pour vérifier." },
];

// ---- badges du « permis bancaire » (se débloquent quand le score du Bouclier monte) ----
const BADGES = [
  { id: "eveil", seuil: 0, emoji: "🌱", nom: "Premier réflexe", desc: "Tu as ouvert ton Bouclier. Le plus dur, c'est de commencer !" },
  { id: "vigilant", seuil: 30, emoji: "👀", nom: "Œil vigilant", desc: "Tu commences à repérer les messages louches. Continue !" },
  { id: "malin", seuil: 50, emoji: "🧠", nom: "Plus malin que l'arnaque", desc: "Les pièges classiques ne te prennent plus au dépourvu." },
  { id: "gardien", seuil: 70, emoji: "🛡️", nom: "Gardien averti", desc: "Tu protèges ton argent comme un·e pro de la sécurité." },
  { id: "expert", seuil: 90, emoji: "🏆", nom: "Permis anti-arnaque", desc: "Bravo ! Tu as ton permis : tu déjoues les arnaques les yeux fermés." },
];

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [step, setStep] = useState(0);
  const [prenom, setPrenom] = useState("Sofia");
  const [debutant, setDebutant] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(247.83);
  const [secScore, setSecScore] = useState(40); // score du bouclier (0-100)
  const [tx, setTx] = useState([
    { id: 1, nom: "Carrefour City", cat: "Courses", montant: -14.9, date: "Aujourd'hui", Icon: ShoppingBag, color: C.coral, exp: "Un paiement : de l'argent sort de ton compte pour acheter quelque chose." },
    { id: 2, nom: "Maman", cat: "Argent reçu", montant: 40, date: "Hier", Icon: Gift, color: C.safe, exp: "Un virement reçu : quelqu'un t'a envoyé de l'argent." },
    { id: 3, nom: "Spotify", cat: "Abonnement", montant: -5.99, date: "12 mai", Icon: Smartphone, color: C.sun, exp: "Un prélèvement automatique : la somme part toute seule chaque mois." },
    { id: 4, nom: "Bus STIB", cat: "Transport", montant: -2.1, date: "11 mai", Icon: Bus, color: "#5B8DEF", exp: "Paiement sans contact avec ta carte ou ton téléphone." },
    { id: 5, nom: "Le Pain Quotidien", cat: "Café", montant: -3.5, date: "10 mai", Icon: Coffee, color: "#B07A4A", exp: "Petit achat du quotidien réglé par carte." },
  ]);
  const [goals, setGoals] = useState([
    { id: 1, nom: "Permis de conduire", saved: 180, target: 600, emoji: "🚗" },
    { id: 2, nom: "Nouveau téléphone", saved: 95, target: 300, emoji: "📱" },
  ]);
  const [openTx, setOpenTx] = useState(null);
  const [q, setQ] = useState("");

  // Objectifs — création
  const [newGoal, setNewGoal] = useState(false);
  const [gForm, setGForm] = useState({ emoji: "🎯", nom: "", target: "" });

  // Virement
  const [vForm, setVForm] = useState({ benef: "", iban: "", montant: "", motif: "" });
  const [vDone, setVDone] = useState(false);

  // Bouclier — analyseur
  const [msg, setMsg] = useState("");
  const [resultat, setResultat] = useState(null);
  // Bouclier — quiz
  const [qi, setQi] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const lexique = [
    { t: "IBAN", d: "Le numéro unique de ton compte, pour recevoir ou envoyer de l'argent. Commence par les lettres du pays (BE...)." },
    { t: "RIB", d: "Un document qui regroupe tes coordonnées bancaires (dont l'IBAN). On le donne par ex. à un employeur pour être payé." },
    { t: "Virement", d: "Envoyer de l'argent de ton compte vers un autre. Gratuit, et ça arrive en quelques heures." },
    { t: "Prélèvement", d: "Une somme qui part automatiquement chaque mois (abonnement, loyer...)." },
    { t: "Découvert", d: "Quand ton compte passe sous 0 €. La banque peut te facturer des frais : à éviter." },
    { t: "Phishing", d: "Une arnaque où un faux message imite ta banque pour voler tes infos. Méfie-toi des liens et demandes de code." },
    { t: "Sans contact", d: "Payer en approchant ta carte/ton téléphone du terminal, sans taper le code." },
    { t: "Code PIN", d: "Le code secret à 4 chiffres de ta carte. Tu le tapes pour payer ou retirer. Ne le donne JAMAIS à personne, même à ta banque." },
    { t: "Solde", d: "L'argent que tu as réellement sur ton compte en ce moment. S'il est bas, attention aux dépenses !" },
    { t: "Plafond", d: "La limite d'argent que tu peux dépenser ou retirer sur une période (ex : 300 € par semaine). Ça te protège en cas de vol." },
    { t: "Carte de débit", d: "La carte classique : l'argent est retiré tout de suite de ton compte quand tu paies. Tu ne dépenses que ce que tu as." },
    { t: "Épargne", d: "L'argent que tu mets de côté au lieu de le dépenser, pour un projet ou les imprévus." },
    { t: "Intérêts", d: "Un petit bonus que la banque ajoute à ton épargne, ou ce que tu paies en plus quand tu empruntes de l'argent." },
    { t: "Fraude", d: "Quand quelqu'un utilise ton argent ou tes infos sans ta permission. Si ça arrive, préviens vite ta banque pour bloquer la carte." },
    { t: "Opposition", d: "Demander à ta banque de bloquer ta carte (perdue, volée ou piratée) pour que personne ne puisse l'utiliser." },
    { t: "Authentification", d: "Prouver que c'est bien toi, par ex. avec un code reçu par SMS ou ton empreinte, avant de valider un paiement." },
  ];

  // ---------- ONBOARDING ----------
  const slides = [
    { titre: "Bienvenue 👋", txt: "Boussole, c'est ta première banque expliquée pas à pas. Aucun mot compliqué sans explication." },
    { titre: "Ton Bouclier 🛡️", txt: "Les arnaques visent surtout les jeunes. Ici, j'analyse les messages douteux et tu t'entraînes à les repérer." },
    { titre: "À toi de jouer", txt: "Je suis Pia, ton guide. Active le « mode découverte » quand tu veux. Prêt·e ?" },
  ];
  if (screen === "onboarding") {
    const s = slides[step];
    return (
      <Phone>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "44px 26px 30px" }}>
          <div style={{ textAlign: "right" }}><button onClick={() => setScreen("accueil")} style={ghost}>Passer</button></div>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block", animation: "float 3s ease-in-out infinite" }}>{step === 0 ? <Lion size={110} /> : <Pia size={120} />}</div>
            <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 30, color: C.ink, margin: "22px 0 12px" }}>{s.titre}</h1>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "#4A5A54", maxWidth: 300, margin: "0 auto" }}>{s.txt}</p>
          </div>
          <div>
            <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 22 }}>
              {slides.map((_, i) => <span key={i} style={{ width: i === step ? 26 : 9, height: 9, borderRadius: 9, background: i === step ? C.green : C.soft, transition: ".3s" }} />)}
            </div>
            <button onClick={() => (step < slides.length - 1 ? setStep(step + 1) : setScreen("accueil"))} style={primaryBtn}>
              {step < slides.length - 1 ? "Continuer" : "Commencer"}
            </button>
          </div>
        </div>
        <Style />
      </Phone>
    );
  }

  const Header = ({ titre, back }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {back && <button onClick={() => { setScreen("accueil"); setVDone(false); }} style={iconBtn}><ArrowLeft size={20} /></button>}
        <Lion size={28} />
        <span style={{ fontFamily: "Fredoka, sans-serif", fontSize: 21, color: C.ink }}>{titre}</span>
      </div>
      <button onClick={() => setDebutant((d) => !d)} style={{ border: "none", cursor: "pointer", borderRadius: 20, padding: "7px 12px", fontSize: 12, fontWeight: 700, background: debutant ? C.green : C.soft, color: debutant ? "#fff" : C.greenDeep, display: "flex", alignItems: "center", gap: 6 }}>
        <Sparkles size={14} /> Découverte {debutant ? "ON" : "OFF"}
      </button>
    </div>
  );

  // ---------- ACCUEIL ----------
  if (screen === "accueil") {
    return (
      <Phone>
        <Scroll>
          <Header titre="Boussole" />
          <div style={{ padding: "4px 18px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "2px 0 14px" }}>
              <p style={{ color: "#4A5A54", fontSize: 14, margin: 0 }}>Salut {prenom} 👋 contente de te revoir !</p>
              <button onClick={() => setScreen("reglages")} style={iconBtn} aria-label="Réglages"><Settings size={18} /></button>
            </div>
            <div style={{ borderRadius: 24, padding: 20, color: "#fff", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.greenDeep}, ${C.green})`, boxShadow: "0 14px 30px rgba(14,138,95,.35)" }}>
              <div style={{ position: "absolute", right: -30, top: -30, width: 130, height: 130, borderRadius: 130, background: "rgba(255,255,255,.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, opacity: .85, display: "flex", alignItems: "center" }}>Solde disponible<Aide titre="Le solde" texte="L'argent réellement disponible sur ton compte en ce moment." /></span>
                <button onClick={() => setShowBalance((s) => !s)} style={{ ...iconBtn, color: "#fff" }}>{showBalance ? <Eye size={18} /> : <EyeOff size={18} />}</button>
              </div>
              <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 34, marginTop: 6 }}>{showBalance ? fmt(balance) : "•••• €"}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18, fontSize: 13, letterSpacing: 1 }}>
                <span style={{ opacity: .9 }}>•••• 7421</span>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontStyle: "italic" }}><Lion size={24} /> Boussole</span>
              </div>
            </div>

            {/* Bandeau Bouclier — la vedette */}
            <button onClick={() => setScreen("bouclier")} style={{ width: "100%", marginTop: 14, border: "none", cursor: "pointer", textAlign: "left", borderRadius: 20, padding: 16, background: `linear-gradient(135deg, ${C.ink}, #3A3A3A)`, color: "#fff", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative" }}>
                <Bouclier size={48} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 16 }}>Ton Bouclier anti-arnaque</div>
                <div style={{ fontSize: 12.5, opacity: .85 }}>Un message bizarre ? Analyse-le ou entraîne-toi 🛡️</div>
              </div>
              <ScanLine size={20} />
            </button>

            {debutant && <Astuce>Touche l'<b>œil</b> 👁️ pour cacher ton solde quand tu n'es pas seul·e.</Astuce>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "16px 0 4px" }}>
              <Quick Icon={Send} label="Virement" onClick={() => setScreen("virement")} />
              <Quick Icon={Bouclier} label="Bouclier" onClick={() => setScreen("bouclier")} />
              <Quick Icon={Target} label="Objectifs" onClick={() => setScreen("objectifs")} />
            </div>

            <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
              <h3 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 17, color: C.ink, margin: 0 }}>Mes opérations</h3>
              <Aide titre="Une opération" texte="Chaque ligne est un mouvement d'argent : achat, virement reçu, abonnement..." />
            </div>
            {debutant && <Astuce>En <b style={{ color: C.coral }}>rouge</b> l'argent qui sort, en <b style={{ color: C.green }}>vert</b> ce qui rentre. Touche une ligne !</Astuce>}
            <div style={{ marginTop: 6, paddingBottom: 8 }}>
              {tx.map((t) => (
                <button key={t.id} onClick={() => setOpenTx(t)} style={rowBtn}>
                  <span style={{ width: 40, height: 40, borderRadius: 13, background: t.color + "22", color: t.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><t.Icon size={19} /></span>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    <span style={{ display: "block", fontWeight: 700, color: C.ink, fontSize: 14.5 }}>{t.nom}</span>
                    <span style={{ display: "block", fontSize: 12, color: "#8A968F" }}>{t.cat} · {t.date}</span>
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 14.5, color: t.montant > 0 ? C.safe : C.ink }}>{t.montant > 0 ? "+" : ""}{fmt(Math.abs(t.montant)).replace(" €", "")} €</span>
                </button>
              ))}
            </div>
          </div>
        </Scroll>
        <Nav screen={screen} go={setScreen} />
        {openTx && (
          <Sheet onClose={() => setOpenTx(null)}>
            <div style={{ textAlign: "center" }}>
              <span style={{ width: 56, height: 56, borderRadius: 18, background: openTx.color + "22", color: openTx.color, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><openTx.Icon size={26} /></span>
              <h3 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 22, margin: "12px 0 2px", color: C.ink }}>{openTx.nom}</h3>
              <div style={{ fontSize: 26, fontWeight: 800, color: openTx.montant > 0 ? C.safe : C.ink }}>{openTx.montant > 0 ? "+" : "-"}{fmt(Math.abs(openTx.montant))}</div>
              <div style={{ color: "#8A968F", fontSize: 13, marginTop: 2 }}>{openTx.cat} · {openTx.date}</div>
              <Astuce>{openTx.exp}</Astuce>
            </div>
          </Sheet>
        )}
        <Style />
      </Phone>
    );
  }

  // ---------- BOUCLIER (vedette) ----------
  if (screen === "bouclier") {
    const cur = QUIZ[qi % QUIZ.length];
    const repondre = (choix) => {
      const ok = choix === cur.arnaque;
      setStreak(ok ? streak + 1 : 0);
      setSecScore((s) => Math.max(0, Math.min(100, s + (ok ? 6 : -2))));
      setFeedback({ ok, why: cur.why });
    };
    return (
      <Phone>
        <Scroll>
          <Header titre="Mon Bouclier" back />
          <div style={{ padding: "4px 18px 16px" }}>
            {/* Score */}
            <div style={{ background: `linear-gradient(135deg, ${C.ink}, #3A3A3A)`, borderRadius: 22, padding: 18, color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                <svg viewBox="0 0 64 64" width="64" height="64">
                  <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="8" />
                  <circle cx="32" cy="32" r="27" fill="none" stroke={C.sun} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(secScore / 100) * 170} 999`} transform="rotate(-90 32 32)" />
                </svg>
                <Bouclier size={30} style={{ position: "absolute", top: 17, left: 17 }} />
              </div>
              <div>
                <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 18 }}>Niveau de protection : {secScore}%</div>
                <div style={{ fontSize: 12.5, opacity: .85 }}>Plus tu t'entraînes, plus ton bouclier monte 🔼</div>
              </div>
            </div>

            {/* Accès aux badges */}
            <button onClick={() => setScreen("badges")} style={{ width: "100%", marginTop: 10, border: `2px solid ${C.soft}`, background: "#fff", cursor: "pointer", borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <Award size={22} color={C.green} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: 800, color: C.ink, fontSize: 14 }}>Mes badges 🏅</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.green }}>{BADGES.filter((b) => secScore >= b.seuil).length}/{BADGES.length} →</span>
            </button>

            {debutant && <Astuce>Les arnaques visent <b>surtout les jeunes</b>. Bonne nouvelle : une fois qu'on connaît les pièges, on les repère en 2 secondes. 💪</Astuce>}

            {/* Analyseur */}
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 17, color: C.ink, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 7 }}><ScanLine size={18} color={C.green} /> Analyse un message douteux</h3>
              <p style={{ fontSize: 12.5, color: "#8A968F", margin: "0 0 10px" }}>Colle un SMS/mail bizarre, ou teste un exemple :</p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
                {PRESETS.map((p) => (
                  <button key={p.nom} onClick={() => { setMsg(p.txt); setResultat(null); }} style={chip}>{p.nom}</button>
                ))}
              </div>
              <textarea value={msg} onChange={(e) => { setMsg(e.target.value); setResultat(null); }} placeholder="Colle le message ici..." rows={3} style={{ ...input, resize: "none", lineHeight: 1.4 }} />
              <button disabled={!msg.trim()} onClick={() => { const f = analyser(msg); setResultat(f); setSecScore((s) => Math.min(100, s + 3)); }} style={{ ...primaryBtn, marginTop: 10, opacity: msg.trim() ? 1 : .45 }}>🔍 Analyser le message</button>

              {resultat && (
                <div style={{ marginTop: 14 }}>
                  {resultat.length >= 2 ? (
                    <Verdict color={C.red} bg={C.redSoft} icon={<AlertTriangle size={22} />} titre="🚨 Très probablement une arnaque" sous={`${resultat.length} signaux d'alerte détectés`} />
                  ) : resultat.length === 1 ? (
                    <Verdict color="#C9870B" bg="#FFF6E0" icon={<AlertTriangle size={22} />} titre="⚠️ Sois prudent·e" sous="1 élément suspect repéré" />
                  ) : (
                    <Verdict color={C.safe} bg={C.safeSoft} icon={<CheckCircle2 size={22} />} titre="✅ Rien de suspect détecté" sous="Reste quand même vigilant·e" />
                  )}
                  {resultat.map((f) => (
                    <div key={f.id} style={{ background: "#fff", border: `2px solid ${C.redSoft}`, borderRadius: 14, padding: "10px 14px", marginTop: 8 }}>
                      <div style={{ fontWeight: 800, color: C.red, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}><Flame size={15} /> {f.label}</div>
                      <div style={{ fontSize: 12.5, color: "#3C4A45", marginTop: 3, lineHeight: 1.45 }}>{f.exp}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mini-jeu */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 17, color: C.ink, margin: 0, display: "flex", alignItems: "center", gap: 7 }}><Trophy size={18} color={C.sun} /> Vrai ou Arnaque ?</h3>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 800, color: C.coral, fontSize: 13 }}><Flame size={15} /> Série : {streak}</span>
              </div>
              <p style={{ fontSize: 12.5, color: "#8A968F", margin: "4px 0 10px" }}>Ce message est-il une arnaque ?</p>
              <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "0 6px 18px rgba(20,48,43,.08)", fontSize: 14, color: C.ink, fontStyle: "italic", lineHeight: 1.5 }}>
                « {cur.txt} »
              </div>
              {!feedback ? (
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={() => repondre(true)} style={{ ...gameBtn, background: C.redSoft, color: C.red }}><ThumbsDown size={16} /> Arnaque</button>
                  <button onClick={() => repondre(false)} style={{ ...gameBtn, background: C.safeSoft, color: C.safe }}><ThumbsUp size={16} /> Légitime</button>
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <div style={{ borderRadius: 14, padding: "12px 14px", background: feedback.ok ? C.safeSoft : C.redSoft, color: feedback.ok ? C.safe : C.red, fontWeight: 800, fontSize: 14 }}>
                    {feedback.ok ? "✅ Bravo, bien vu !" : "❌ Raté, mais tu apprends !"}
                  </div>
                  <p style={{ fontSize: 13, color: "#3C4A45", lineHeight: 1.45, margin: "8px 2px" }}>{feedback.why}</p>
                  <button onClick={() => { setQi(qi + 1); setFeedback(null); }} style={{ ...primaryBtn, marginTop: 2 }}>Message suivant →</button>
                </div>
              )}
            </div>
          </div>
        </Scroll>
        <Nav screen={screen} go={setScreen} />
        <Style />
      </Phone>
    );
  }

  // ---------- VIREMENT ----------
  if (screen === "virement") {
    const valide = vForm.benef && vForm.montant && Number(vForm.montant) > 0;
    if (vDone) {
      return (
        <Phone>
          <Scroll>
            <Header titre="Virement" back />
            <div style={{ padding: "30px 22px", textAlign: "center" }}>
              <CheckCircle2 size={84} color={C.green} style={{ animation: "pop .4s ease" }} />
              <h2 style={{ fontFamily: "Fredoka, sans-serif", color: C.ink, margin: "14px 0 6px" }}>C'est envoyé ! 🎉</h2>
              <p style={{ color: "#4A5A54" }}>Tu as envoyé <b>{fmt(Number(vForm.montant))}</b> à <b>{vForm.benef}</b>.</p>
              <Astuce>Un virement arrive en général en quelques heures. Ton solde s'est mis à jour sur l'accueil.</Astuce>
              <button onClick={() => { setScreen("accueil"); setVDone(false); }} style={primaryBtn}>Retour à l'accueil</button>
            </div>
          </Scroll>
          <Style />
        </Phone>
      );
    }
    return (
      <Phone>
        <Scroll>
          <Header titre="Faire un virement" back />
          <div style={{ padding: "4px 20px 16px" }}>
            {debutant && <Astuce>Un <b>virement</b>, c'est envoyer de l'argent à quelqu'un. Je t'explique chaque case avec le « ? ».</Astuce>}
            <Field label="À qui ?" aide={{ titre: "Le bénéficiaire", texte: "La personne qui reçoit ton argent. Mets son prénom ou son nom." }}>
              <input value={vForm.benef} onChange={(e) => setVForm({ ...vForm, benef: e.target.value })} placeholder="Ex : Lucas" style={input} />
            </Field>
            <Field label="Numéro de compte (IBAN)" aide={{ titre: "L'IBAN", texte: "Le numéro unique du compte de la personne. Elle te le donne." }}>
              <input value={vForm.iban} onChange={(e) => setVForm({ ...vForm, iban: e.target.value })} placeholder="BE00 0000 0000 0000" style={input} />
            </Field>
            <Field label="Montant" aide={{ titre: "Le montant", texte: "La somme à envoyer. Tu ne peux pas envoyer plus que ton solde." }}>
              <div style={{ position: "relative" }}>
                <input type="number" value={vForm.montant} onChange={(e) => setVForm({ ...vForm, montant: e.target.value })} placeholder="0,00" style={input} />
                <span style={{ position: "absolute", right: 16, top: 14, color: "#8A968F", fontWeight: 700 }}>€</span>
              </div>
            </Field>
            <Field label="Motif (facultatif)" aide={{ titre: "Le motif", texte: "Un petit mot pour dire à quoi sert l'argent. Ex : « ciné »." }}>
              <input value={vForm.motif} onChange={(e) => setVForm({ ...vForm, motif: e.target.value })} placeholder="Ex : ciné de samedi" style={input} />
            </Field>
            {vForm.montant && Number(vForm.montant) > balance && (
              <div style={{ background: C.redSoft, color: "#B23A2E", borderRadius: 14, padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>⚠️ C'est plus que ton solde ({fmt(balance)}). Tu risques le découvert.</div>
            )}
            <button disabled={!valide} onClick={() => {
              const m = Number(vForm.montant);
              setBalance((b) => +(b - m).toFixed(2));
              setTx([{ id: Date.now(), nom: vForm.benef, cat: vForm.motif || "Virement", montant: -m, date: "À l'instant", Icon: Send, color: C.green, exp: "Virement que tu viens d'envoyer." }, ...tx]);
              setVDone(true);
            }} style={{ ...primaryBtn, opacity: valide ? 1 : .45, marginTop: 10 }}>Envoyer l'argent</button>
          </div>
        </Scroll>
        <Nav screen={screen} go={setScreen} />
        <Style />
      </Phone>
    );
  }

  // ---------- OBJECTIFS ----------
  if (screen === "objectifs") {
    return (
      <Phone>
        <Scroll>
          <Header titre="Mes objectifs" back />
          <div style={{ padding: "4px 20px 16px" }}>
            {debutant && <Astuce>Un <b>objectif</b>, c'est une tirelire pour un projet. Tu mets de l'argent de côté petit à petit.</Astuce>}
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
              return (
                <div key={g.id} style={{ background: "#fff", borderRadius: 20, padding: 18, marginBottom: 14, boxShadow: "0 6px 18px rgba(20,48,43,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{g.emoji} {g.nom}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.green }}>{pct}%</span>
                  </div>
                  <div style={{ height: 12, background: C.soft, borderRadius: 12, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ width: pct + "%", height: "100%", borderRadius: 12, background: `linear-gradient(90deg, ${C.green}, ${C.sun})`, transition: "width .5s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, color: "#4A5A54" }}>
                    <span><b>{fmt(g.saved)}</b> mis de côté</span><span>sur {fmt(g.target)}</span>
                  </div>
                  <button onClick={() => { if (balance < 10) return; setGoals(goals.map((x) => x.id === g.id ? { ...x, saved: Math.min(x.target, x.saved + 10) } : x)); setBalance((b) => +(b - 10).toFixed(2)); }} style={{ ...smallBtn, marginTop: 12 }}><Plus size={15} /> Ajouter 10 €</button>
                </div>
              );
            })}
            {!newGoal ? (
              <button onClick={() => setNewGoal(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", cursor: "pointer", color: C.greenDeep, fontWeight: 700, fontSize: 14, padding: 14, border: `2px dashed ${C.green}`, borderRadius: 18 }}><PiggyBank size={20} /> + Créer un nouvel objectif</button>
            ) : (
              <div style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 6px 18px rgba(20,20,20,.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "Fredoka, sans-serif", fontSize: 17, color: C.ink }}>Nouvel objectif</span>
                  <button onClick={() => setNewGoal(false)} style={iconBtn} aria-label="Annuler"><X size={18} /></button>
                </div>
                {debutant && <Astuce>Choisis un emoji, un nom et le montant à atteindre. Tu rempliras ta tirelire petit à petit ! 🐷</Astuce>}
                <Field label="Emoji">
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {["🎯", "🚗", "📱", "✈️", "🎮", "👟", "🎸", "💻", "🎁"].map((e) => (
                      <button key={e} onClick={() => setGForm({ ...gForm, emoji: e })} style={{ width: 40, height: 40, borderRadius: 12, fontSize: 20, cursor: "pointer", background: gForm.emoji === e ? C.mint : "#fff", border: `2px solid ${gForm.emoji === e ? C.green : C.soft}` }}>{e}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Nom de l'objectif" aide={{ titre: "Le nom", texte: "À quoi sert cette tirelire ? Ex : « Vacances », « Casque audio »." }}>
                  <input value={gForm.nom} onChange={(e) => setGForm({ ...gForm, nom: e.target.value })} placeholder="Ex : Vacances d'été" style={input} />
                </Field>
                <Field label="Montant à atteindre" aide={{ titre: "L'objectif", texte: "La somme totale que tu veux mettre de côté pour ce projet." }}>
                  <div style={{ position: "relative" }}>
                    <input type="number" value={gForm.target} onChange={(e) => setGForm({ ...gForm, target: e.target.value })} placeholder="0,00" style={input} />
                    <span style={{ position: "absolute", right: 16, top: 14, color: "#8A968F", fontWeight: 700 }}>€</span>
                  </div>
                </Field>
                <button disabled={!gForm.nom.trim() || !(Number(gForm.target) > 0)} onClick={() => {
                  setGoals([...goals, { id: Date.now(), nom: gForm.nom.trim(), saved: 0, target: Number(gForm.target), emoji: gForm.emoji }]);
                  setGForm({ emoji: "🎯", nom: "", target: "" });
                  setNewGoal(false);
                }} style={{ ...primaryBtn, opacity: (gForm.nom.trim() && Number(gForm.target) > 0) ? 1 : .45 }}>Créer l'objectif</button>
              </div>
            )}
          </div>
        </Scroll>
        <Nav screen={screen} go={setScreen} />
        <Style />
      </Phone>
    );
  }

  // ---------- LEXIQUE ----------
  if (screen === "lexique") {
    const list = lexique.filter((l) => norm(l.t + l.d).includes(norm(q)));
    return (
      <Phone>
        <Scroll>
          <Header titre="Le lexique" back />
          <div style={{ padding: "4px 20px 16px" }}>
            {debutant && <Astuce>Tu bloques sur un mot ? Cherche-le ici, je l'explique en une phrase. 👇</Astuce>}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <Search size={17} color="#8A968F" style={{ position: "absolute", left: 14, top: 14 }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher un mot..." style={{ ...input, paddingLeft: 40 }} />
            </div>
            {list.map((l) => (
              <div key={l.t} style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 10, boxShadow: "0 5px 14px rgba(20,48,43,.05)" }}>
                <div style={{ fontWeight: 800, color: C.green, fontSize: 15.5, marginBottom: 4 }}>{l.t}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "#3C4A45" }}>{l.d}</div>
              </div>
            ))}
            {list.length === 0 && <p style={{ textAlign: "center", color: "#8A968F" }}>Aucun mot trouvé 🤔</p>}
          </div>
        </Scroll>
        <Nav screen={screen} go={setScreen} />
        <Style />
      </Phone>
    );
  }

  // ---------- REGLAGES ----------
  if (screen === "reglages") {
    const enregistrer = () => {
      if (!prenom.trim()) setPrenom("toi");
      setScreen("accueil");
    };
    return (
      <Phone>
        <Scroll>
          <Header titre="Réglages" back />
          <div style={{ padding: "4px 20px 16px" }}>
            {debutant && <Astuce>Ici tu peux choisir le <b>prénom</b> que j'affiche sur ton accueil. Mets le tien ! 😊</Astuce>}
            <Field label="Ton prénom" aide={{ titre: "Ton prénom", texte: "C'est le prénom que je montre sur l'accueil quand je te dis bonjour." }}>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Ex : Sofia" style={input} />
            </Field>
            <button onClick={enregistrer} style={{ ...primaryBtn, marginTop: 10 }}>Enregistrer</button>
          </div>
        </Scroll>
        <Nav screen={screen} go={setScreen} />
        <Style />
      </Phone>
    );
  }

  // ---------- BADGES (permis bancaire) ----------
  if (screen === "badges") {
    const debloques = BADGES.filter((b) => secScore >= b.seuil);
    const prochain = BADGES.find((b) => secScore < b.seuil);
    return (
      <Phone>
        <Scroll>
          <Header titre="Mon permis bancaire" back />
          <div style={{ padding: "4px 18px 16px" }}>
            {/* Bandeau récap */}
            <div style={{ background: `linear-gradient(135deg, ${C.ink}, #3A3A3A)`, borderRadius: 22, padding: 18, color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
              <Award size={40} color={C.sun} />
              <div>
                <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 18 }}>{debloques.length} badge{debloques.length > 1 ? "s" : ""} sur {BADGES.length}</div>
                <div style={{ fontSize: 12.5, opacity: .85 }}>
                  {prochain ? `Encore ${prochain.seuil - secScore}% pour « ${prochain.nom} »` : "Tu as tout débloqué, champion·ne ! 🎉"}
                </div>
              </div>
            </div>

            {debutant && <Astuce>Chaque badge se débloque quand ton <b>niveau de protection</b> monte. Entraîne-toi au Bouclier pour les gagner tous ! 🏅</Astuce>}

            <div style={{ marginTop: 16 }}>
              {BADGES.map((b) => {
                const on = secScore >= b.seuil;
                return (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 10, boxShadow: "0 5px 14px rgba(20,20,20,.05)", opacity: on ? 1 : .55 }}>
                    <span style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 14, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", background: on ? C.mint : C.soft }}>
                      {on ? b.emoji : <Lock size={20} color="#9AA6A0" />}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: C.ink, fontSize: 15 }}>{b.nom}</div>
                      <div style={{ fontSize: 12.5, color: "#6A7670", lineHeight: 1.4, marginTop: 2 }}>
                        {on ? b.desc : `Se débloque à ${b.seuil}% de protection`}
                      </div>
                    </div>
                    {on && <CheckCircle2 size={20} color={C.safe} style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </Scroll>
        <Nav screen={screen} go={setScreen} />
        <Style />
      </Phone>
    );
  }
  return null;
}

// ---------- Composants ----------
// Logo ING (icône carrée) : fichier dans boussole/public/ing-lion.png.
function Lion({ size = 34 }) {
  return (
    <img src="/ing-lion.png" alt="Logo ING" width={size} height={size}
      style={{ display: "block", borderRadius: size * 0.22, objectFit: "contain" }} />
  );
}
// Logo du Bouclier anti-arnaque : fichier dans boussole/public/bouclier.png.
// `size` est passé par Quick/Nav (rendus comme <Icon size=.. />), d'où la même signature.
function Bouclier({ size = 28, style }) {
  return (
    <img src="/bouclier.png" alt="Bouclier" width={size} height={size}
      style={{ display: "block", objectFit: "contain", borderRadius: size * 0.18, ...style }} />
  );
}
function Pia({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="52" r="38" fill={C.green} /><circle cx="50" cy="52" r="38" fill="none" stroke={C.ink} strokeWidth="3" />
      <circle cx="38" cy="46" r="6.5" fill="#fff" /><circle cx="62" cy="46" r="6.5" fill="#fff" />
      <circle cx="39.5" cy="47" r="3" fill={C.ink} /><circle cx="63.5" cy="47" r="3" fill={C.ink} />
      <path d="M40 64 Q50 72 60 64" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="58" r="4" fill="#fff" opacity="0.5" /><circle cx="70" cy="58" r="4" fill="#fff" opacity="0.5" />
      <path d="M50 14 L50 4 M50 4 a4 4 0 1 1 0.01 0" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function Astuce({ children }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.mint, border: `2px dashed ${C.green}`, borderRadius: 16, padding: "12px 14px", margin: "10px 0" }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}><Pia size={30} /></div>
      <div style={{ fontSize: 13.5, lineHeight: 1.45, color: C.ink }}>{children}</div>
    </div>
  );
}
function Aide({ titre, texte }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ border: "none", background: open ? C.green : C.soft, color: open ? "#fff" : C.greenDeep, width: 22, height: 22, borderRadius: 11, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 6 }} aria-label={"Aide : " + titre}><HelpCircle size={14} /></button>
      {open && (
        <div style={{ position: "absolute", top: 28, left: -8, zIndex: 30, width: 230, background: C.ink, color: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 12px 30px rgba(0,0,0,.25)", fontSize: 12.5, lineHeight: 1.5 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: C.sun }}>{titre}</div>{texte}
        </div>
      )}
    </span>
  );
}
function Verdict({ color, bg, icon, titre, sous }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, color }}>
      {icon}
      <div><div style={{ fontWeight: 800, fontSize: 15 }}>{titre}</div><div style={{ fontSize: 12.5, opacity: .85 }}>{sous}</div></div>
    </div>
  );
}
function Phone({ children }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "radial-gradient(circle at 30% 20%, #E7F4EC, #F4EEE4)" }}>
      <div style={{ width: 390, height: 760, background: C.bg, borderRadius: 46, overflow: "hidden", boxShadow: "0 30px 70px rgba(20,48,43,.35), inset 0 0 0 11px #15211D", position: "relative", display: "flex", flexDirection: "column", fontFamily: "Nunito, sans-serif" }}>
        <div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", fontSize: 12, fontWeight: 800, color: C.ink }}>
          <span>9:41</span>
          <span style={{ width: 90, height: 22, background: "#15211D", borderRadius: 14, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 6 }} />
          <span style={{ display: "flex", gap: 5, alignItems: "center" }}><Bell size={12} /><Wallet size={13} /></span>
        </div>
        {children}
      </div>
    </div>
  );
}
function Scroll({ children }) { return <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>; }
function Quick({ Icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{ border: "none", background: "#fff", borderRadius: 18, padding: "14px 6px", cursor: "pointer", boxShadow: "0 6px 16px rgba(20,48,43,.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
      <span style={{ width: 38, height: 38, borderRadius: 12, background: C.mint, color: C.greenDeep, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={19} /></span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{label}</span>
    </button>
  );
}
function Field({ label, aide, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "flex", alignItems: "center", fontSize: 13.5, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{label}{aide && <Aide titre={aide.titre} texte={aide.texte} />}</label>
      {children}
    </div>
  );
}
function Nav({ screen, go }) {
  const items = [
    { k: "accueil", Icon: Home, l: "Accueil" },
    { k: "bouclier", Icon: Bouclier, l: "Bouclier" },
    { k: "objectifs", Icon: Target, l: "Objectifs" },
    { k: "lexique", Icon: BookOpen, l: "Lexique" },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 6px 16px", background: "#fff", borderTop: "1px solid " + C.soft }}>
      {items.map((it) => {
        const on = screen === it.k;
        return (
          <button key={it.k} onClick={() => go(it.k)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? C.green : "#9AA6A0", fontWeight: 700, fontSize: 11 }}>
            <it.Icon size={21} /> {it.l}
          </button>
        );
      })}
    </div>
  );
}
function Sheet({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,33,29,.45)", display: "flex", alignItems: "flex-end", zIndex: 40 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bg, borderRadius: "26px 26px 0 0", padding: "16px 22px 30px", animation: "slideUp .3s ease" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={onClose} style={iconBtn}><X size={20} /></button></div>
        {children}
      </div>
    </div>
  );
}
function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      ::-webkit-scrollbar { width: 0; }
      input:focus, textarea:focus { outline: 2px solid ${C.green}; }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes pop { 0%{transform:scale(.4);opacity:0} 100%{transform:scale(1);opacity:1} }
      @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
    `}</style>
  );
}
const primaryBtn = { width: "100%", border: "none", background: C.green, color: "#fff", fontFamily: "Fredoka, sans-serif", fontSize: 17, padding: "15px", borderRadius: 18, cursor: "pointer", boxShadow: "0 10px 22px rgba(14,138,95,.3)" };
const smallBtn = { display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: C.mint, color: C.greenDeep, fontWeight: 800, fontSize: 13, padding: "9px 14px", borderRadius: 12, cursor: "pointer" };
const gameBtn = { flex: 1, border: "none", borderRadius: 14, padding: "14px", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 };
const chip = { border: `2px solid ${C.soft}`, background: "#fff", color: C.ink, borderRadius: 12, padding: "7px 11px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" };
const ghost = { border: "none", background: "none", color: C.greenDeep, fontWeight: 700, cursor: "pointer", fontSize: 13 };
const iconBtn = { border: "none", background: "rgba(0,0,0,.05)", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.ink };
const rowBtn = { width: "100%", border: "none", background: "none", display: "flex", alignItems: "center", gap: 12, padding: "11px 6px", cursor: "pointer", borderRadius: 14 };
const input = { width: "100%", border: `2px solid ${C.soft}`, background: "#fff", borderRadius: 14, padding: "13px 16px", fontSize: 15, fontFamily: "Nunito, sans-serif", color: C.ink };
