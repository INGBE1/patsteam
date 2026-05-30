import React, { useState, useMemo } from 'react';
import { 
  Eye, EyeOff, Shield, ArrowUpRight, ArrowDownLeft, 
  TrendingUp, BookOpen, Home, HelpCircle, CheckCircle2, 
  AlertTriangle, XCircle, Search, Plus, Send, RefreshCw, ChevronRight
} from 'lucide-react';

// --- GOOGLE FONTS INJECTION ---
if (typeof window !== 'undefined') {
  const link1 = document.createElement('link');
  link1.rel = 'stylesheet';
  link1.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap';
  document.head.appendChild(link1);
}

// --- PALETTE DE COULEURS & STYLES GENERAUX ---
const colors = {
  bgCrème: '#FBF7F0',
  texteFoncé: '#16302B',
  vertPrincipal: '#0E8A5F',
  vertFoncé: '#0A5E41',
  vertClair: '#D9F2E6',
  corail: '#FF7A59',
  jauneSoleil: '#FFC857',
  beige: '#EDE6DA',
  rougeAlerte: '#E14B3B'
};

const styles = {
  appContainer: {
    backgroundColor: '#16302B',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Nunito", sans-serif',
    padding: '20px'
  },
  phoneMockup: {
    width: '390px',
    height: '760px',
    backgroundColor: colors.bgCrème,
    borderRadius: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: '8px solid #2d3748'
  },
  statusBar: {
    height: '40px',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: colors.texteFoncé,
    fontFamily: '"Fredoka", sans-serif',
    userSelect: 'none'
  },
  screenContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    paddingBottom: '80px',
    scrollbarWidth: 'none'
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '68px',
    backgroundColor: '#FFFFFF',
    borderTop: `2px solid ${colors.beige}`,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: '4px'
  },
  navButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    color: '#8A9A96',
    fontSize: '11px',
    fontWeight: '700'
  },
  title: {
    fontFamily: '"Fredoka", sans-serif',
    color: colors.texteFoncé,
    margin: '0 0 12px 0'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(22, 48, 43, 0.04)',
  }
};

// --- MASCOTTE PIA INLINE SVG ---
const PiaMascot = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="55" r="35" fill={colors.vertPrincipal} />
    <circle cx="38" cy="50" r="6" fill="white" />
    <circle cx="39" cy="50" r="2.5" fill={colors.texteFoncé} />
    <circle cx="62" cy="50" r="6" fill="white" />
    <circle cx="61" cy="50" r="2.5" fill={colors.texteFoncé} />
    <path d="M 42 68 Q 50 76 58 68" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 50 20 L 50 10" stroke={colors.jauneSoleil} strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="8" r="4" fill={colors.corail} />
  </svg>
);

// --- COMPOSANTS DE BULLES D'AIDE ET POPOVER ---
const PiaBubble = ({ text }) => (
  <div style={{ display: 'flex', gap: '10px', backgroundColor: colors.vertClair, padding: '12px', borderRadius: '20px', marginBottom: '16px', alignItems: 'center', border: `1px solid ${colors.vertPrincipal}` }}>
    <div style={{ flexShrink: 0 }}><PiaMascot size={42} /></div>
    <div style={{ fontSize: '13px', color: colors.texteFoncé, fontWeight: '600', lineHeight: '1.4' }}>
      <span style={{ fontFamily: '"Fredoka", sans-serif', color: colors.vertFoncé, display: 'block', marginBottom: '2px' }}>Pia conseille :</span>
      {text}
    </div>
  </div>
);

const HelpTooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginLeft: '4px' }}>
      <button 
        onClick={(e) => { e.stopPropagation(); setVisible(!visible); }}
        style={{ background: colors.jauneSoleil, border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: colors.texteFoncé }}
      >
        ?
      </button>
      {visible && (
        <>
          <div style={{ fixed: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} onClick={() => setVisible(false)} />
          <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', width: '200px', backgroundColor: colors.texteFoncé, color: '#FFFFFF', padding: '10px', borderRadius: '12px', fontSize: '12px', zIndex: 999, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', stroke: 'none' }}>
            {text}
          </div>
        </>
      )}
    </span>
  );
};

// --- DONNÉES DU LEXIQUE & RÈGLES ANTI-ARNAQUE ---
const lexiqueData = [
  { term: "IBAN", definition: "C'est l'adresse unique de ton compte bancaire. Tu la donnes pour recevoir de l'argent ou payer des factures." },
  { term: "RIB", definition: "Le Relevé d'Identité Bancaire. C'est le document papier ou numérique qui contient ton IBAN et prouve que le compte t'appartient." },
  { term: "Virement", definition: "Une action qui consiste à envoyer directement de l'argent de ton compte vers le compte d'une autre personne." },
  { term: "Prélèvement", definition: "C'est quand tu autorises une entreprise (comme ton forfait mobile) à venir chercher l'argent directement sur ton compte tous les mois." },
  { term: "Découvert", definition: "C'est quand ton compte passe en dessous de 0€. La banque te prête cet argent, mais attention, cela engendre souvent des frais !" },
  { term: "Phishing", definition: "Une technique d'arnaque où des voleurs se font passer pour ta banque ou un service public pour te voler tes codes ou mots de passe." },
  { term: "Sans contact", definition: "Payer en posant simplement ta carte sur le terminal de paiement, sans taper ton code secret. Limité à 50€ max par achat." }
];

const arnaqueCategories = [
  { keys: ['urgent', '24h', '48h', 'immédiat', 'tout de suite', 'dernier', 'expire', 'vite'], title: "Urgence / pression", desc: "On te met la pression pour t'empêcher de réfléchir calmement." },
  { keys: ['code', 'mot de passe', 'identifiant', 'pin', 'otp', '6 chiffres', 'secret'], title: "Demande de code secret", desc: "JAMAIS donner son code. Aucune banque ni organisme ne te le demandera par message." },
  { keys: ['http', 'bit.ly', 'clique', 'cliquez', 'lien', 'www', '.xyz'], title: "Lien suspect", desc: "Ne clique jamais sur ce lien. Connecte-toi toi-même via l'application officielle." },
  { keys: ['gagné', 'félicitations', 'cadeau', 'tirage', 'gratuit', 'iphone'], title: "Cadeau ou gain trop beau", desc: "Si c'est trop beau pour être vrai, c'est que c'est une arnaque !" },
  { keys: ['bloqué', 'suspendu', 'amende', 'poursuite', 'désactivé', 'sanction'], title: "Menace ou compte bloqué", desc: "L'arnaqueur utilise la peur pour te faire faire une bêtise rapidement." },
  { keys: ['frais', 'payer', 'réglez', 'douane', 'redevance', '1,99', '2,99'], title: "Petits frais à régler", desc: "Demander une petite somme pour débloquer un colis est un piège très classique." },
  { keys: ['rib', 'iban', 'numéro de carte', 'cvv', 'expiration'], title: "Infos bancaires demandées", desc: "On ne communique jamais ses coordonnées bancaires sensibles par simple SMS ou mail." }
];

const quizMessages = [
  { text: "Votre compte sera suspendu. Confirmez votre mot de passe ici : bit.ly/secure", isArnaque: true, explanation: "C'est une arnaque ! Un lien bizarre et une demande de mot de passe : alerte rouge !" },
  { text: "Spotify : votre abonnement a été renouvelé. Montant : 5,99€.", isArnaque: false, explanation: "C'est légitime. Un simple message de confirmation automatique sans demande suspecte." },
  { text: "Salut c'est Lucas, j'ai changé de numéro, tu peux m'avancer 50€ ?", isArnaque: true, explanation: "C'est une arnaque ! Très classique, un usurpateur se fait passer pour un proche en détresse." },
  { text: "Rappel : RDV chez le dentiste demain à 14h.", isArnaque: false, explanation: "C'est légitime. Un rappel classique de rendez-vous qui ne demande aucune action ni paiement." },
  { text: "Vous avez gagné 1000€ ! Réglez 2€ de frais pour débloquer.", isArnaque: true, explanation: "C'est une arnaque ! On te fait miroiter un gros lot pour te voler tes coordonnées de carte bancaire." }
];

// --- COMPOSANT PRINCIPAL ---
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding'); // onboarding, accueil, bouclier, virement, objectifs, lexique
  const [discoveryMode, setDiscoveryMode] = useState(true);
  
  // États de l'application
  const [onboardingSlide, setOnboardingSlide] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [solde, setSolde] = useState(247.83);
  const [selectedOp, setSelectedOp] = useState(null);
  
  // États Bouclier
  const [shieldScore, setShieldScore] = useState(40);
  const [scamInput, setScamInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null); // 'juste' ou 'faux'
  const [quizStreak, setQuizStreak] = useState(0);

  // États Virement
  const [virementForm, setVirementForm] = useState({ benef: '', iban: '', montant: '', motif: '' });
  const [virementError, setVirementError] = useState('');
  const [virementSuccess, setVirementSuccess] = useState(false);

  // États Objectifs
  const [objectifs, setObjectifs] = useState([
    { id: 1, name: "Permis de conduire", current: 180, target: 600 },
    { id: 2, name: "Téléphone", current: 95, target: 300 }
  ]);

  // États Lexique
  const [searchTerm, setSearchTerm] = useState('');

  // Historique des opérations de départ
  const [transactions] = useState([
    { id: 1, title: "Abonnement Spotify", amount: -9.99, date: "Hier", type: "débit", explication: "Un prélèvement automatique mensuel pour ton accès musique. L'argent part tout seul chaque mois si tu as donné l'autorisation." },
    { id: 2, title: "Virement de Maman", amount: 50.00, date: "28 Mai", type: "crédit", explication: "De l'argent reçu directement sur ton compte. Ton solde augmente immédiatement !" },
    { id: 3, title: "McDo", amount: -12.50, date: "25 Mai", type: "débit", explication: "Un paiement par carte bancaire. Le commerçant a retiré la somme de ton compte." }
  ]);

  // Fonctions de calcul pour l'analyseur de message
  const analyzeMessage = (text) => {
    if (!text.trim()) return;
    const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let detected = [];
    
    arnaqueCategories.forEach(cat => {
      const matchedKeys = cat.keys.filter(key => cleanText.includes(key));
      if (matchedKeys.length > 0) {
        detected.push(cat);
      }
    });

    let verdict = "Rien de suspect";
    let verdictColor = colors.vertPrincipal;
    if (detected.length === 1) {
      verdict = "Sois prudent·e";
      verdictColor = colors.corail;
    } else if (detected.length >= 2) {
      verdict = "Très probablement une arnaque";
      verdictColor = colors.rougeAlerte;
    }

    setAnalysisResult({ verdict, color: verdictColor, signals: detected });
    setShieldScore(prev => Math.min(100, prev + 5));
  };

  const handleQuizAnswer = (userChoice) => {
    const currentQuestion = quizMessages[quizIndex];
    if (userChoice === currentQuestion.isArnaque) {
      setQuizAnswered('juste');
      setQuizStreak(prev => prev + 1);
      setShieldScore(prev => Math.min(100, prev + 10));
    } else {
      setQuizAnswered('faux');
      setQuizStreak(0);
    }
  };

  const handleNextQuiz = () => {
    setQuizAnswered(null);
    setQuizIndex((prev) => (prev + 1) % quizMessages.length);
  };

  const executeVirement = (e) => {
    e.preventDefault();
    const amt = parseFloat(virementForm.montant);
    if (!virementForm.benef || !virementForm.iban || !virementForm.montant) {
      setVirementError("Remplis tous les champs essentiels !");
      return;
    }
    if (amt > solde) {
      setVirementError("Oups ! Tu ne peux pas envoyer plus d'argent que tu n'en as sur ton compte.");
      return;
    }
    setSolde(prev => prev - amt);
    setVirementError('');
    setVirementSuccess(true);
  };

  const addFundsToObjective = (id) => {
    setObjectifs(objectifs.map(obj => {
      if (obj.id === id && obj.current < obj.target) {
        if (solde >= 10) {
          setSolde(prev => prev - 10);
          return { ...obj, current: Math.min(obj.target, obj.current + 10) };
        }
      }
      return obj;
    }));
    setShieldScore(prev => Math.min(100, prev + 2));
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.phoneMockup}>
        
        {/* BARRE DE STATUT COMPLÈTE */}
        <div style={styles.statusBar}>
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setDiscoveryMode(!discoveryMode)}
              style={{
                backgroundColor: discoveryMode ? colors.vertPrincipal : colors.beige,
                color: discoveryMode ? '#FFFFFF' : colors.texteFoncé,
                border: 'none',
                borderRadius: '12px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: '700',
                transition: 'all 0.2s'
              }}
            >
              {discoveryMode ? "💡 Mode Découverte ON" : "💡 Mode Découverte OFF"}
            </button>
          </div>
        </div>

        {/* CONTENU DES ÉCRANS DE L'APPLICATION */}
        <div style={styles.screenContent}>
          
          {/* ÉCRAN 1 : ONBOARDING */}
          {currentScreen === 'onboarding' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', textAlign: 'center' }}>
              <div style={{ marginTop: '20px' }}>
                <span style={{ fontFamily: '"Fredoka", sans-serif', color: colors.vertPrincipal, fontSize: '24px', fontWeight: 'bold' }}>Boussole🧭</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: colors.texteFoncé, fontWeight: '600' }}>la banque qui t'explique tout</p>
              </div>

              <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PiaMascot size={90} />
                {onboardingSlide === 0 && (
                  <>
                    <h2 style={{ ...styles.title, fontSize: '22px', marginTop: '16px' }}>Bienvenue chez toi !</h2>
                    <p style={{ color: colors.texteFoncé, fontSize: '15px', lineHeight: '1.5', padding: '0 10px' }}>
                      Ici, pas de jargon compliqué. On va t'apprendre à gérer ton argent sans aucun stress. Prêt·e à piloter ton compte ?
                    </p>
                  </>
                )}
                {onboardingSlide === 1 && (
                  <>
                    <h2 style={{ ...styles.title, fontSize: '22px', marginTop: '16px', color: colors.corail }}>Le Bouclier Anti-Arnaque</h2>
                    <p style={{ color: colors.texteFoncé, fontSize: '15px', lineHeight: '1.5', padding: '0 10px' }}>
                      Un doute sur un SMS reçu ou un e-mail bizarre ? Colle-le dans notre super Bouclier. Pia l'analyse en direct pour te protéger !
                    </p>
                  </>
                )}
                {onboardingSlide === 2 && (
                  <>
                    <h2 style={{ ...styles.title, fontSize: '22px', marginTop: '16px', color: colors.vertFoncé }}>À toi de jouer !</h2>
                    <p style={{ color: colors.texteFoncé, fontSize: '15px', lineHeight: '1.5', padding: '0 10px' }}>
                      Active le <strong>Mode Découverte</strong> dès que tu as une question. Notre mascotte Pia sera là à chaque étape pour t'éclairer.
                    </p>
                  </>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: onboardingSlide === idx ? colors.vertPrincipal : colors.beige }} />
                  ))}
                </div>
                <button 
                  onClick={() => {
                    if (onboardingSlide < 2) {
                      setOnboardingSlide(onboardingSlide + 1);
                    } else {
                      setCurrentScreen('accueil');
                    }
                  }}
                  style={{ width: '100%', backgroundColor: colors.vertPrincipal, color: '#FFFFFF', border: 'none', borderRadius: '16px', padding: '14px', fontSize: '16px', fontWeight: '700', fontFamily: '"Fredoka", sans-serif', cursor: 'pointer', marginBottom: '12px' }}
                >
                  {onboardingSlide === 2 ? "C'est parti !" : "Continuer"}
                </button>
                {onboardingSlide < 2 && (
                  <button onClick={() => setCurrentScreen('accueil')} style={{ background: 'none', border: 'none', color: '#8A9A96', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                    Passer l'introduction
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ÉCRAN 2 : ACCUEIL */}
          {currentScreen === 'accueil' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h1 style={{ ...styles.title, fontSize: '24px', margin: 0 }}>Salut Sofia 👋</h1>
              </div>

              {discoveryMode && <PiaBubble text="Voici ton tableau de bord ! Clique sur l'œil pour cacher ton solde si tu as du monde autour de toi." />}

              {/* CARTE BANCAIRE DÉGRADÉE */}
              <div style={{ background: `linear-gradient(135deg, ${colors.vertPrincipal}, ${colors.vertFoncé})`, borderRadius: '24px', padding: '20px', color: '#FFFFFF', boxShadow: '0 8px 20px rgba(10,94,65,0.2)', marginBottom: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: '0.8', fontSize: '14px', fontWeight: '600' }}>
                  <span>Mon Solde Épargne & Carte</span>
                  <span>Boussole 🧭</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
                  <span style={{ fontFamily: '"Fredoka", sans-serif', fontSize: '32px', fontWeight: '700' }}>
                    {balanceVisible ? `${solde.toFixed(2)} €` : "•••••• €"}
                  </span>
                  <button onClick={() => setBalanceVisible(!balanceVisible)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div style={{ fontSize: '12px', opacity: '0.7', letterSpacing: '2px' }}>•••• •••• •••• 4921</div>
              </div>

              {/* BANDEAU RECONNAISSANCE BOUCLIER */}
              <div onClick={() => setCurrentScreen('bouclier')} style={{ ...styles.card, background: colors.vertClair, border: `2px dashed ${colors.vertPrincipal}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={32} color={colors.vertPrincipal} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: colors.vertFoncé, fontFamily: '"Fredoka", sans-serif' }}>🛡️ Teste le Bouclier Anti-Arnaque</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: colors.texteFoncé }}>Vérifie immédiatement un message suspect.</p>
                </div>
                <ChevronRight size={20} color={colors.vertFoncé} />
              </div>

              {/* BOUTONS ACCÈS RAPIDE */}
              <h3 style={{ ...styles.title, fontSize: '16px', marginTop: '20px' }}>Raccourcis rapides</h3>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button onClick={() => setCurrentScreen('virement')} style={{ flex: 1, backgroundColor: '#FFFFFF', border: `1px solid ${colors.beige}`, padding: '12px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <div style={{ backgroundColor: colors.vertClair, padding: '8px', borderRadius: '12px' }}><ArrowUpRight size={20} color={colors.vertPrincipal} /></div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: colors.texteFoncé }}>Virement</span>
                </button>
                <button onClick={() => setCurrentScreen('bouclier')} style={{ flex: 1, backgroundColor: '#FFFFFF', border: `1px solid ${colors.beige}`, padding: '12px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <div style={{ backgroundColor: '#FFEBE6', padding: '8px', borderRadius: '12px' }}><Shield size={20} color={colors.corail} /></div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: colors.texteFoncé }}>Bouclier</span>
                </button>
                <button onClick={() => setCurrentScreen('objectifs')} style={{ flex: 1, backgroundColor: '#FFFFFF', border: `1px solid ${colors.beige}`, padding: '12px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <div style={{ backgroundColor: '#FFF6DF', padding: '8px', borderRadius: '12px' }}><TrendingUp size={20} color={colors.jauneSoleil} /></div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: colors.texteFoncé }}>Objectifs</span>
                </button>
              </div>

              {/* LISTE DES TRANSACTIONS */}
              <h3 style={{ ...styles.title, fontSize: '16px' }}>Dernières opérations</h3>
              <div>
                {transactions.map((op) => (
                  <div key={op.id} onClick={() => setSelectedOp(op)} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', transition: 'transform 0.1s' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: colors.texteFoncé, fontSize: '14px' }}>{op.title}</div>
                      <div style={{ fontSize: '12px', color: '#8A9A96', marginTop: '2px' }}>{op.date}</div>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: op.amount < 0 ? colors.rougeAlerte : colors.vertPrincipal }}>
                      {op.amount < 0 ? '' : '+'}{op.amount.toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              {/* POPUP EXPLICATIVE DES OPÉRATIONS */}
              {selectedOp && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(22, 48, 43, 0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
                  <div style={{ backgroundColor: colors.bgCrème, width: '100%', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '24px', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><PiaMascot size={55} /></div>
                    <h3 style={{ ...styles.title, textAlign: 'center', marginBottom: '4px' }}>Déchiffrer l'opération</h3>
                    <p style={{ textAlign: 'center', fontWeight: '700', fontSize: '18px', margin: '0 0 16px 0', color: selectedOp.amount < 0 ? colors.rougeAlerte : colors.vertPrincipal }}>
                      {selectedOp.title} ({selectedOp.amount.toFixed(2)} €)
                    </p>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '20px', fontSize: '14px', color: colors.texteFoncé, lineHeight: '1.5', marginBottom: '20px' }}>
                      {selectedOp.explication}
                    </div>
                    <button onClick={() => setSelectedOp(null)} style={{ width: '100%', backgroundColor: colors.texteFoncé, color: '#FFFFFF', border: 'none', borderRadius: '16px', padding: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      J'ai compris !
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ÉCRAN 3 : BOUCLIER ANTI-ARNAQUE (VEDETTE) */}
          {currentScreen === 'bouclier' && (
            <div>
              <h1 style={{ ...styles.title, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={26} color={colors.corail} /> Bouclier Anti-Arnaque
              </h1>
              
              {discoveryMode && <PiaBubble text="C'est ton espace sécurité ! Entraîne-toi avec le mini-jeu ou analyse les vrais messages pour faire grimper ton score de protection !" />}

              {/* 1. SCORE DE PROTECTION */}
              <div style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
                <div style={{ position: 'relative', width: '70px', height: '70px' }}>
                  <svg width="70" height="70" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke={colors.beige} strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke={colors.vertPrincipal} strokeWidth="3.5" strokeDasharray={`${shieldScore}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: '700', fontSize: '14px', color: colors.texteFoncé }}>
                    {shieldScore}%
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontFamily: '"Fredoka", sans-serif', color: colors.texteFoncé }}>Ton niveau de protection</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#5C726E' }}>Augmente-le en analysant et en jouant.</p>
                </div>
              </div>

              {/* 2. ANALYSEUR DE MESSAGE */}
              <div style={styles.card}>
                <h3 style={{ ...styles.title, fontSize: '16px', marginBottom: '8px' }}>🔍 Détecteur de pièges</h3>
                <p style={{ fontSize: '13px', color: colors.texteFoncé, margin: '0 0 12px 0' }}>Colle un message ou sélectionne un exemple ci-dessous :</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  <button onClick={() => setScamInput("⚠️ Chronopost : Votre colis a des frais de douane de 1,99€. Réglez ici : bit.ly/frais-colis")} style={{ fontSize: '11px', border: 'none', backgroundColor: colors.bgCrème, padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>📦 Faux colis</button>
                  <button onClick={() => setScamInput("BOUSSOLE INFO : Suite à un blocage de sécurité, merci de confirmer immédiatement votre code secret par SMS.")} style={{ fontSize: '11px', border: 'none', backgroundColor: colors.bgCrème, padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>🏦 Faux conseiller</button>
                  <button onClick={() => setScamInput("Félicitations 🎉 ! Tu as gagné un iPhone 15 Pro au tirage au sort ! Clique vite ici pour le recevoir gratuitement.")} style={{ fontSize: '11px', border: 'none', backgroundColor: colors.bgCrème, padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>🎁 Faux gain</button>
                  <button onClick={() => setScamInput("Coucou ! Est-ce qu'on se voit toujours pour le déjeuner demain midi vers 12h30 ?")} style={{ fontSize: '11px', border: 'none', backgroundColor: colors.bgCrème, padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>✅ Normal</button>
                </div>

                <textarea 
                  value={scamInput}
                  onChange={(e) => setScamInput(e.target.value)}
                  placeholder="Colle ton SMS ou email ici..."
                  style={{ width: '100%', height: '80px', border: `2px solid ${colors.beige}`, borderRadius: '16px', padding: '10px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '13px', resize: 'none', outline: 'none', focus: { borderColor: colors.vertPrincipal } }}
                />

                <button 
                  onClick={() => analyzeMessage(scamInput)}
                  style={{ width: '100%', marginTop: '10px', backgroundColor: colors.texteFoncé, color: '#FFFFFF', border: 'none', borderRadius: '14px', padding: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Send size={16} /> Analyser le message
                </button>

                {/* VERDICT DE L'ANALYSE */}
                {analysisResult && (
                  <div style={{ marginTop: '16px', padding: '12px', borderRadius: '16px', backgroundColor: '#F8F9FA', borderLeft: `5px solid ${analysisResult.color}` }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: analysisResult.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {analysisResult.verdict === "Rien de suspect" && <CheckCircle2 size={18} />}
                      {analysisResult.verdict === "Sois prudent·e" && <AlertTriangle size={18} />}
                      {analysisResult.verdict === "Très probablement une arnaque" && <XCircle size={18} />}
                      Verdict : {analysisResult.verdict}
                    </div>
                    {analysisResult.signals.length > 0 ? (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: colors.texteFoncé, marginBottom: '4px' }}>Indices suspects trouvés :</div>
                        {analysisResult.signals.map((sig, i) => (
                          <div key={i} style={{ fontSize: '12px', color: colors.texteFoncé, marginBottom: '4px', backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '8px' }}>
                            📍 <strong>{sig.title}</strong> : {sig.desc}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '12px', color: colors.texteFoncé, margin: '6px 0 0 0' }}>Aucun mot-clé d'alerte classique détecté. Reste quand même vigilant·e !</p>
                    )}
                  </div>
                )}
              </div>

              {/* 3. MINI-JEU VRAI OU ARNAQUE */}
              <div style={{ ...styles.card, border: `2px solid ${colors.jauneSoleil}`, backgroundColor: '#FFFDF9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ ...styles.title, fontSize: '16px', margin: 0 }}>🎮 Entraînement Express</h3>
                  <span style={{ fontSize: '12px', backgroundColor: colors.jauneSoleil, padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>Série : {quizStreak} 🔥</span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '14px', fontSize: '13px', border: `1px solid ${colors.beige}`, fontStyle: 'italic', color: colors.texteFoncé, marginBottom: '12px' }}>
                  "{quizMessages[quizIndex].text}"
                </div>

                {!quizAnswered ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleQuizAnswer(false)} style={{ flex: 1, backgroundColor: colors.vertClair, color: colors.vertFoncé, border: 'none', borderRadius: '12px', padding: '10px', fontWeight: '700', cursor: 'pointer' }}>✅ Légitime</button>
                    <button onClick={() => handleQuizAnswer(true)} style={{ flex: 1, backgroundColor: '#FFEBE6', color: colors.rougeAlerte, border: 'none', borderRadius: '12px', padding: '10px', fontWeight: '700', cursor: 'pointer' }}>🚨 Arnaque</button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', color: quizAnswered === 'juste' ? colors.vertPrincipal : colors.rougeAlerte, fontSize: '15px', marginBottom: '6px' }}>
                      {quizAnswered === 'juste' ? "🎉 Bravo, c'est exact !" : "💥 Dommage, c'est un piège !"}
                    </div>
                    <p style={{ fontSize: '12px', color: colors.texteFoncé, margin: '0 0 12px 0' }}>{quizMessages[quizIndex].explanation}</p>
                    <button onClick={handleNextQuiz} style={{ backgroundColor: colors.texteFoncé, color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Suivant <RefreshCw size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ÉCRAN 4 : VIREMENT */}
          {currentScreen === 'virement' && (
            <div>
              <h1 style={{ ...styles.title, fontSize: '24px' }}>Faire un virement</h1>
              
              {discoveryMode && <PiaBubble text="Pour envoyer de l'argent, tu as juste besoin du nom et de l'IBAN du destinataire. C'est super sécurisé." />}

              {virementSuccess ? (
                <div style={{ ...styles.card, textAlign: 'center', padding: '30px 20px' }}>
                  <div style={{ backgroundColor: colors.vertClair, width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <CheckCircle2 size={36} color={colors.vertPrincipal} />
                  </div>
                  <h3 style={{ ...styles.title, fontSize: '20px' }}>Envoi Réussi !</h3>
                  <p style={{ fontSize: '14px', color: colors.texteFoncé }}>Ton virement de <strong>{virementForm.montant} €</strong> a bien été transmis à {virementForm.benef}.</p>
                  <button 
                    onClick={() => {
                      setVirementSuccess(false);
                      setVirementForm({ benef: '', iban: '', montant: '', motif: '' });
                      setCurrentScreen('accueil');
                    }}
                    style={{ marginTop: '16px', backgroundColor: colors.texteFoncé, color: '#FFFFFF', border: 'none', borderRadius: '14px', padding: '10px 20px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Retour à l'accueil
                  </button>
                </div>
              ) : (
                <form onSubmit={executeVirement} style={styles.card}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px', color: colors.texteFoncé }}>
                      Bénéficiaire
                      {discoveryMode && <HelpTooltip text="C'est le nom de la personne ou du magasin à qui tu envoies l'argent." />}
                    </label>
                    <input type="text" placeholder="Ex: Lucas Dupont" value={virementForm.benef} onChange={e => setVirementForm({...virementForm, benef: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: `1px solid ${colors.beige}`, boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px', color: colors.texteFoncé }}>
                      IBAN
                      {discoveryMode && <HelpTooltip text="La longue clé unique de son compte. Elle commence par FR et contient 27 caractères." />}
                    </label>
                    <input type="text" placeholder="FR76 3000 6000 ..." value={virementForm.iban} onChange={e => setVirementForm({...virementForm, iban: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: `1px solid ${colors.beige}`, boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px', color: colors.texteFoncé }}>
                      Montant (€)
                      {discoveryMode && <HelpTooltip text="La somme que tu veux envoyer. Attention à ne pas dépasser ton solde !" />}
                    </label>
                    <input type="number" placeholder="0.00" value={virementForm.montant} onChange={e => setVirementForm({...virementForm, montant: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: `1px solid ${colors.beige}`, boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px', color: colors.texteFoncé }}>
                      Motif (Optionnel)
                      {discoveryMode && <HelpTooltip text="Un petit mot pour vous souvenir plus tard de la raison de cet envoi (ex: 'Remboursement ciné')." />}
                    </label>
                    <input type="text" placeholder="Ex: Remboursement McDo" value={virementForm.motif} onChange={e => setVirementForm({...virementForm, motif: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: `1px solid ${colors.beige}`, boxSizing: 'border-box' }} />
                  </div>

                  {virementError && (
                    <div style={{ color: colors.rougeAlerte, fontSize: '12px', fontWeight: '700', marginBottom: '12px' }}>
                      ⚠️ {virementError}
                    </div>
                  )}

                  <button type="submit" style={{ width: '100%', backgroundColor: colors.vertPrincipal, color: '#FFFFFF', border: 'none', borderRadius: '14px', padding: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                    Valider le virement
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ÉCRAN 5 : OBJECTIFS */}
          {currentScreen === 'objectifs' && (
            <div>
              <h1 style={{ ...styles.title, fontSize: '24px' }}>Mes Tirelires 🎯</h1>
              
              {discoveryMode && <PiaBubble text="Pour t'acheter ce qui te fait plaisir, mets un peu d'argent de côté ici de temps en temps. Ça évite de tout dépenser d'un coup !" />}

              <div>
                {objectifs.map((obj) => {
                  const percent = Math.round((obj.current / obj.target) * 100);
                  return (
                    <div key={obj.id} style={styles.card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '700', color: colors.texteFoncé }}>{obj.name}</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: colors.vertFoncé }}>{obj.current} / {obj.target} €</span>
                      </div>
                      
                      {/* BARRE DE PROGRESSION */}
                      <div style={{ width: '100%', height: '12px', backgroundColor: colors.beige, borderRadius: '6px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
                        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: colors.vertPrincipal, borderRadius: '6px', transition: 'width 0.3s' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#8A9A96', fontWeight: '600' }}>{percent}% complété</span>
                        <button 
                          onClick={() => addFundsToObjective(obj.id)} 
                          disabled={obj.current >= obj.target}
                          style={{ backgroundColor: obj.current >= obj.target ? colors.beige : colors.jauneSoleil, color: colors.texteFoncé, border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: obj.current >= obj.target ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Plus size={14} /> Ajouter 10 €
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ÉCRAN 6 : LEXIQUE */}
          {currentScreen === 'lexique' && (
            <div>
              <h1 style={{ ...styles.title, fontSize: '24px' }}>Dico de la Banque</h1>
              
              {discoveryMode && <PiaBubble text="Un mot t'échappe ? Pas de panique, tape-le ici pour obtenir une explication ultra simple." />}

              {/* BARRE DE RECHERCHE */}
              <div style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: `1px solid ${colors.beige}` }}>
                <Search size={18} color="#8A9A96" />
                <input 
                  type="text" 
                  placeholder="Rechercher un mot (ex: IBAN...)" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ border: 'none', background: 'none', width: '100%', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              {/* LISTE MOTS FILTRÉS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lexiqueData
                  .filter(item => item.term.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item, i) => (
                    <div key={i} style={{ ...styles.card, margin: 0 }}>
                      <span style={{ fontFamily: '"Fredoka", sans-serif', color: colors.vertPrincipal, fontWeight: '700', fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                        {item.term}
                      </span>
                      <p style={{ margin: 0, fontSize: '13px', color: colors.texteFoncé, lineHeight: '1.4' }}>
                        {item.definition}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

        {/* BARRE DE NAVIGATION INFÉRIEURE DU TÉLÉPHONE */}
        {currentScreen !== 'onboarding' && (
          <nav style={styles.navBar}>
            <button onClick={() => setCurrentScreen('accueil')} style={{ ...styles.navButton, color: currentScreen === 'accueil' ? colors.vertPrincipal : '#8A9A96' }}>
              <Home size={22} />
              <span>Accueil</span>
            </button>
            <button onClick={() => setCurrentScreen('bouclier')} style={{ ...styles.navButton, color: currentScreen === 'bouclier' ? colors.vertPrincipal : '#8A9A96' }}>
              <Shield size={22} />
              <span>Bouclier</span>
            </button>
            <button onClick={() => setCurrentScreen('objectifs')} style={{ ...styles.navButton, color: currentScreen === 'objectifs' ? colors.vertPrincipal : '#8A9A96' }}>
              <TrendingUp size={22} />
              <span>Objectifs</span>
            </button>
            <button onClick={() => setCurrentScreen('lexique')} style={{ ...styles.navButton, color: currentScreen === 'lexique' ? colors.vertPrincipal : '#8A9A96' }}>
              <BookOpen size={22} />
              <span>Lexique</span>
            </button>
          </nav>
        )}

      </div>
    </div>
  );
}