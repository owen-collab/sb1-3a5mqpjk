import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Phone, Calendar, MapPin, Clock, Wrench, DollarSign, Shield, AlertCircle, CheckCircle, ArrowRight, Heart, Lightbulb, Coffee, Car, Zap, Wind } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickReplies?: string[];
  type?: 'text' | 'service' | 'contact' | 'appointment' | 'advice' | 'general';
}

interface ConversationContext {
  userName?: string;
  currentService?: string;
  appointmentStep?: number;
  lastTopic?: string;
  userPreferences?: string[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "Salut ! 👋 Je suis Alex, votre assistant personnel chez IN AUTO. Je suis là pour vous aider avec tout ce qui concerne votre véhicule !\n\nQue ce soit pour :\n• Prendre un rendez-vous\n• Connaître nos services et tarifs\n• Obtenir des conseils techniques\n• Localiser notre garage\n• Ou simplement discuter auto...\n\nJe suis tout ouïe ! 😊 Comment puis-je vous aider aujourd'hui ?",
          [
            "Prendre rendez-vous",
            "Voir vos services",
            "Problème avec ma voiture",
            "Vos tarifs",
            "Où êtes-vous situés ?",
            "Juste dire bonjour ! 👋"
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, quickReplies?: string[], type: Message['type'] = 'text') => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isBot: true,
      timestamp: new Date(),
      quickReplies,
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void, delay = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const extractUserName = (message: string): string | undefined => {
    const namePatterns = [
      /je m'appelle (\w+)/i,
      /mon nom est (\w+)/i,
      /je suis (\w+)/i,
      /c'est (\w+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match) return match[1];
    }
    return undefined;
  };

  const getPersonalizedGreeting = (): string => {
    const greetings = [
      "Parfait ! 😊",
      "Excellente question ! 👍",
      "Je vais vous aider avec ça ! 🚗",
      "Ah, intéressant ! 🤔",
      "Bonne idée ! ✨",
      "Je comprends ! 💡"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const getRandomEmoji = (category: string): string => {
    const emojis = {
      car: ['🚗', '🚙', '🚕', '🚐', '🏎️'],
      tools: ['🔧', '🛠️', '⚙️', '🔩'],
      positive: ['😊', '👍', '✨', '💪', '🎯'],
      thinking: ['🤔', '💭', '🧐', '💡'],
      service: ['⚡', '🛡️', '❄️', '🔥', '💎']
    };
    const categoryEmojis = emojis[category as keyof typeof emojis] || emojis.positive;
    return categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
  };

  const handleAdvancedResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    // Extraction du nom si mentionné
    const userName = extractUserName(userMessage);
    if (userName && !context.userName) {
      setContext(prev => ({ ...prev, userName }));
    }

    // Réponses intelligentes basées sur des mots-clés multiples
    if (message.includes('service') || message.includes('que faites-vous') || message.includes('quoi comme service') || message.includes('voir vos services')) {
      simulateTyping(() => {
        addBotMessage(
          `${getPersonalizedGreeting()} Voici tous nos services professionnels chez IN AUTO :\n\n🔧 **NOS SERVICES COMPLETS :**\n\n⚡ **Diagnostic Électronique** - 15 000 FCFA\n• Valise professionnelle dernière génération\n• Identification précise des pannes\n• Rapport détaillé avec conseils\n• Durée : 15-45 minutes\n\n🛠️ **Vidange + Entretien** - 35 000 FCFA\n• Huile moteur premium\n• Changement filtres (huile, air)\n• Vérification 20 points\n• Durée : 45 minutes\n\n❄️ **Climatisation** - 25 000 FCFA\n• Recharge gaz R134a\n• Nettoyage évaporateur\n• Test étanchéité complet\n• Durée : 60-90 minutes\n\n🛡️ **Système de Freinage** - 45 000 FCFA\n• Plaquettes et disques\n• Liquide de frein\n• Test performance sécurité\n• Durée : 90 minutes\n\n🚗 **Pneus + Géométrie** - 15 000 FCFA\n• Montage et équilibrage\n• Géométrie 4 roues\n• Contrôle pression\n• Durée : 60 minutes\n\n🔧 **Révision Complète** - 75 000 FCFA\n• Contrôle 50 points\n• Vidange complète\n• Filtres multiples\n• Rapport détaillé\n• Durée : 2 heures\n\n✨ **GARANTIES INCLUSES :**\n• 6 mois sur toutes interventions\n• Pièces d'origine uniquement\n• Devis gratuit avant travaux\n• Service d'urgence 24h/24\n\nQuel service vous intéresse le plus ?",
          [
            "Diagnostic électronique",
            "Vidange + entretien",
            "Climatisation",
            "Freinage",
            "Pneus + géométrie",
            "Révision complète",
            "Prendre rendez-vous",
            "Vos garanties"
          ],
          'service'
        );
      });
    } else if (message.includes('bonjour') || message.includes('salut') || message.includes('hello') || message.includes('bonsoir') || message.includes('hey') || message.includes('coucou')) {
      const timeGreeting = new Date().getHours() < 18 ? 'journée' : 'soirée';
      simulateTyping(() => {
        addBotMessage(
          `${getPersonalizedGreeting()} Excellente ${timeGreeting} ${context.userName ? context.userName : 'à vous'} ! ${getRandomEmoji('positive')}\n\nJe suis ravi de vous rencontrer ! Chez IN AUTO, on adore discuter avec nos clients. Votre véhicule va bien ? Qu'est-ce qui vous amène aujourd'hui ?\n\nJe peux vous aider avec :\n• Prise de rendez-vous\n• Informations sur nos services\n• Conseils techniques\n• Tarifs et devis\n• Localisation du garage`,
          [
            "Ma voiture a un problème",
            "Je veux un entretien",
            "Voir vos services",
            "Vos tarifs",
            "Où êtes-vous ?",
            "Juste des infos"
          ]
        );
      });
    } else if (message.includes('prix') || message.includes('tarif') || message.includes('coût') || message.includes('combien') || message.includes('ça coûte')) {
      simulateTyping(() => {
        addBotMessage(
          `${getPersonalizedGreeting()} Nos tarifs sont transparents et compétitifs ! ${getRandomEmoji('positive')}\n\n💎 **TARIFS OFFICIELS IN AUTO** :\n\n• **Diagnostic électronique** : 15 000 FCFA\n• **Vidange complète** : 35 000 FCFA\n• **Service climatisation** : 25 000 FCFA\n• **Système de freinage** : 45 000 FCFA\n• **Pneus + géométrie** : 15 000 FCFA\n• **Révision complète** : 75 000 FCFA\n\n🛡️ **INCLUS DANS TOUS NOS PRIX** :\n• Garantie 6 mois pièces et main d'œuvre\n• Devis gratuit et détaillé\n• Diagnostic préliminaire offert\n• Conseils personnalisés\n\n💡 **OFFRES SPÉCIALES** :\n• Forfait entretien annuel : -20%\n• Diagnostic gratuit pour nouveaux clients\n• Réduction fidélité après 3 services\n\nQuel service vous intéresse pour un devis précis ?",
          [
            "Devis personnalisé",
            "Diagnostic gratuit",
            "Forfait entretien",
            "Offres spéciales",
            "Prendre rendez-vous"
          ]
        );
      });
    } else if (message.includes('rendez-vous') || message.includes('rdv') || message.includes('réserver') || message.includes('appointment') || message.includes('prendre rendez-vous')) {
      setContext(prev => ({ ...prev, appointmentStep: 1 }));
      simulateTyping(() => {
        addBotMessage(
          `Super ! ${getRandomEmoji('positive')} Je vais vous aider à prendre rendez-vous !\n\n${context.userName ? `${context.userName}, ` : ''}voici comment procéder :\n\n📋 **ÉTAPES SIMPLES** :\n1️⃣ Choisissez votre service\n2️⃣ Sélectionnez date et heure\n3️⃣ Confirmez vos coordonnées\n\n⚡ **SERVICES DISPONIBLES** :\n• Diagnostic électronique (15 min)\n• Vidange express (45 min)\n• Climatisation (1h30)\n• Freinage (1h30)\n• Pneus + géométrie (1h)\n• Révision complète (2h)\n• Réparation urgente\n\n🕒 **CRÉNEAUX DISPONIBLES** :\n• Lundi à Samedi : 8h00 - 18h00\n• Service d'urgence : 24h/24\n\nQuel service vous intéresse ?",
          [
            "Diagnostic électronique",
            "Vidange express",
            "Climatisation",
            "Freinage",
            "Pneus + géométrie",
            "Révision complète",
            "Réparation urgente"
          ],
          'appointment'
        );
      });
    } else if (message.includes('où') || message.includes('adresse') || message.includes('localisation') || message.includes('situé') || message.includes('comment venir')) {
      simulateTyping(() => {
        addBotMessage(
          `Nous sommes très faciles à trouver ! ${getRandomEmoji('positive')}\n\n📍 **ADRESSE EXACTE** :\n🏢 **IN AUTO**\n📍 Rue PAU, Akwa\n🎯 **Repère principal** : En face d'AGROMAC\n🏪 À côté de la microfinance FIGEC\n🌍 Douala, Cameroun\n\n🚗 **ACCÈS FACILE** :\n• Parking gratuit disponible\n• Accessible en transport public\n• Proche du centre-ville d'Akwa\n• Visible depuis la rue principale\n\n🕒 **HORAIRES** :\n• Lundi à Samedi : 8h00 - 18h00\n• Dimanche : Fermé (sauf urgences)\n• Service d'urgence : 24h/24\n\n📞 **CONTACT DIRECT** :\n• Téléphone : (+237) 675 978 777\n• Email : infos@inauto.fr\n\nVous connaissez le quartier Akwa ?`,
          [
            "Je connais AGROMAC",
            "Comment y aller ?",
            "Transport en commun",
            "Prendre RDV",
            "Appeler maintenant"
          ],
          'contact'
        );
      });
    } else if (message.includes('problème') || message.includes('panne') || message.includes('souci') || message.includes('bug') || message.includes('ne marche pas') || message.includes('en panne')) {
      simulateTyping(() => {
        addBotMessage(
          `Oh là là ! ${getRandomEmoji('thinking')} Un problème avec votre véhicule ? Ne vous inquiétez pas, on va résoudre ça ensemble !\n\n🔍 **DIAGNOSTIC RAPIDE** :\nRacontez-moi tout en détail :\n• Quels sont les symptômes exacts ?\n• Quand le problème apparaît-il ?\n• Des bruits particuliers ?\n• Des voyants allumés ?\n• Depuis quand ça dure ?\n\n⚡ **PROBLÈMES FRÉQUENTS** :\n🔴 Voyant moteur allumé\n🔴 Bruit au démarrage\n🔴 Problème de freinage\n🔴 Climatisation en panne\n🔴 Batterie faible\n🔴 Pneus usés\n\n🚨 **SERVICE D'URGENCE** :\nSi c\'est urgent, appelez immédiatement :\n📞 (+237) 675 978 777\n\nDécrivez-moi votre problème, je vais vous orienter !`,
          [
            "Voyant moteur allumé",
            "Bruit étrange",
            "Problème de freinage",
            "Climatisation en panne",
            "Batterie faible",
            "Autre problème",
            "Appel d'urgence"
          ]
        );
      });
    } else if (message.includes('merci') || message.includes('thanks') || message.includes('remercie')) {
      simulateTyping(() => {
        addBotMessage(
          `Avec grand plaisir ! ${getRandomEmoji('positive')} C'est exactement pour ça que je suis là !\n\n${context.userName ? `${context.userName}, ` : ''}n'hésitez jamais à revenir me voir. Que ce soit pour :\n• Un conseil technique\n• Une question sur nos services\n• Prendre un rendez-vous\n• Ou même juste pour discuter auto...\n\nJe suis toujours disponible ! ${getRandomEmoji('service')}\n\n🎯 **VOTRE SATISFACTION = NOTRE PRIORITÉ**\n\nAutre chose que je peux faire pour vous ?`,
          [
            "Tu es vraiment sympa !",
            "J'aurai d'autres questions",
            "Prendre rendez-vous",
            "Voir vos services",
            "À bientôt Alex ! 👋"
          ]
        );
      });
    } else if (message.includes('horaire') || message.includes('ouvert') || message.includes('fermé') || message.includes('quand') || message.includes('heure')) {
      simulateTyping(() => {
        addBotMessage(
          `Nos horaires ? ${getRandomEmoji('positive')} On est là pour vous quand vous en avez besoin !\n\n🕒 **HORAIRES NORMAUX** :\n📅 **Lundi à Samedi** : 8h00 - 18h00\n🚫 **Dimanche** : Fermé (repos bien mérité ! 😴)\n\n🚨 **MAIS ATTENTION** :\n⚡ **Service d'urgence 24h/24** !\nPanne en pleine nuit ? Week-end ? On est là ! 💪\n\n📞 **URGENCES** : (+237) 675 978 777\n\n⏰ **CRÉNEAUX POPULAIRES** :\n• 8h00-10h00 : Moins d'attente\n• 14h00-16h00 : Idéal pour RDV\n• 16h00-18h00 : Service express\n\n🎯 **CONSEIL** : Réservez votre créneau pour éviter l'attente !\n\nQuand souhaitez-vous venir ?`,
          [
            "Aujourd'hui",
            "Cette semaine",
            "Week-end",
            "Service d'urgence",
            "Prendre RDV maintenant"
          ]
        );
      });
    } else if (message.includes('équipe') || message.includes('technicien') || message.includes('mécanicien') || message.includes('qui') || message.includes('staff')) {
      simulateTyping(() => {
        addBotMessage(
          `Notre équipe ? ${getRandomEmoji('positive')} C'est notre fierté ! Des vrais passionnés d\'automobile !\n\n👨‍🔧 **NOS EXPERTS** :\n✅ Techniciens certifiés multi-marques\n🎓 Formation continue sur les nouvelles technologies\n💡 Spécialistes en diagnostic électronique\n🛠️ Maîtrise des systèmes modernes et classiques\n🏆 Plus de 10 ans d'expérience moyenne\n\n❤️ **NOTRE PHILOSOPHIE** :\n• Passion pour l\'automobile\n• Transparence totale avec les clients\n• Explications claires et détaillées\n• Conseils honnêtes et personnalisés\n• Respect des délais annoncés\n\n🎯 **SPÉCIALITÉS DE L'ÉQUIPE** :\n• Diagnostic électronique avancé\n• Systèmes de climatisation\n• Mécanique générale\n• Géométrie de précision\n• Freinage haute performance\n\nVous voulez rencontrer l\'équipe ?`,
          [
            "Impressionnant !",
            "Leurs spécialités",
            "Rencontrer l'équipe",
            "Prendre RDV",
            "Vos certifications"
          ]
        );
      });
    } else if (message.includes('garantie') || message.includes('assurance') || message.includes('sûr') || message.includes('protection')) {
      simulateTyping(() => {
        addBotMessage(
          `La garantie ? ${getRandomEmoji('positive')} C'est notre engagement envers vous !\n\n🛡️ **NOTRE PROMESSE GARANTIE** :\n• **6 mois** sur toutes interventions\n• **12 mois** sur pièces majeures\n• **Pièces d'origine** ou équivalent constructeur\n• **Main d'œuvre** incluse dans la garantie\n\n💪 **SI ÇA NE VA PAS** :\n✅ Reprise GRATUITE du travail\n✅ Remplacement des pièces défectueuses\n✅ Aucun frais supplémentaire\n✅ Satisfaction garantie à 100%\n\n📋 **CE QUI EST COUVERT** :\n• Défauts de fabrication des pièces\n• Erreurs de montage\n• Dysfonctionnements liés à l'intervention\n• Usure prématurée anormale\n\n🎯 **NOTRE ENGAGEMENT** :\n"Votre tranquillité d'esprit est notre priorité"\n\nC'est ça, la confiance IN AUTO ! Des questions sur nos garanties ?`,
          [
            "C'est rassurant !",
            "Pièces d'origine ?",
            "Que couvre exactement ?",
            "J'ai confiance",
            "Prendre RDV"
          ]
        );
      });
    } else if (message.includes('urgent') || message.includes('urgence') || message.includes('vite') || message.includes('rapidement') || message.includes('emergency')) {
      simulateTyping(() => {
        addBotMessage(
          `Urgence ? ${getRandomEmoji('thinking')} On comprend, c'est stressant quand la voiture nous lâche !\n\n🚨 **SERVICE D\'URGENCE 24h/24** :\n📞 **APPELEZ IMMÉDIATEMENT** : (+237) 675 978 777\n⚡ **Intervention rapide** possible\n🔧 **Dépannage sur route** disponible\n🏥 **Diagnostic express** en 15 minutes\n\n⚠️ **EN ATTENDANT NOTRE INTERVENTION** :\n• Mettez-vous en sécurité\n• N'insistez pas si le moteur force\n• Notez tous les symptômes\n• Allumez vos feux de détresse\n\n🎯 **TYPES D\'URGENCES TRAITÉES** :\n• Panne sur route\n• Problème de démarrage\n• Surchauffe moteur\n• Problème de freinage\n• Batterie à plat\n• Crevaison\n\n**On arrive !** ${getRandomEmoji('service')}`,
          [
            "Appeler maintenant",
            "Dépannage sur route",
            "Venir au garage",
            "Décrire le problème",
            "C'est vraiment urgent !"
          ]
        );
      });
    } else if (message.includes('conseil') || message.includes('recommandation') || message.includes('que faire') || message.includes('aide') || message.includes('astuce')) {
      simulateTyping(() => {
        addBotMessage(
          `Vous voulez des conseils ? ${getRandomEmoji('positive')} J'adore ça ! Partager mon expertise, c'est ma passion !\n\n💡 **MES CONSEILS D'EXPERT** :\n\n🔧 **ENTRETIEN PRÉVENTIF** :\n• Vidange tous les 7500 km\n• Vérification mensuelle des niveaux\n• Contrôle pression pneus (2 semaines)\n• Révision annuelle complète\n\n⛽ **ÉCONOMISER LE CARBURANT** :\n• Conduite souple et anticipée\n• Pneus bien gonflés\n• Entretien régulier du moteur\n• Éviter les surcharges\n\n❄️ **PRÉPARER L'HIVER** :\n• Vérifier la batterie\n• Contrôler l'antigel\n• Pneus adaptés à la saison\n• Test du système de chauffage\n\n🛣️ **AVANT UN LONG VOYAGE** :\n• Révision complète\n• Vérification freinage\n• Contrôle éclairage\n• Kit de secours à bord\n\nSur quoi voulez-vous mes conseils spécifiques ?`,
          [
            "Entretien préventif",
            "Économiser carburant",
            "Préparer un voyage",
            "Conduite écologique",
            "Choisir mes pneus",
            "Autre conseil"
          ]
        );
      });
    } else if (message.includes('blague') || message.includes('drôle') || message.includes('rire') || message.includes('humour') || message.includes('joke')) {
      const jokes = [
        "Pourquoi les mécaniciens sont-ils toujours de bonne humeur ? Parce qu'ils savent comment remonter le moral... et les moteurs ! 😄",
        "Que dit un pneu à un autre pneu ? 'Tu me gonfles !' 🎈",
        "Pourquoi les voitures vont-elles chez le médecin ? Pour faire contrôler leur tension... de courroie ! 🩺",
        "Comment appelle-t-on un chat qui répare les voitures ? Un mé-chat-nicien ! 🐱🔧",
        "Que dit un moteur fatigué ? 'J'ai besoin d'une pause... essence !' ⛽😴"
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      
      simulateTyping(() => {
        addBotMessage(
          `Ah, vous aimez l'humour ! ${getRandomEmoji('positive')} Moi aussi ! Voici une petite blague auto :\n\n${randomJoke}\n\nAlors, ça vous a fait sourire ? 😊 Chez IN AUTO, on aime garder la bonne humeur même quand on parle mécanique !\n\nBon, revenons à nos voitures maintenant ! ${getRandomEmoji('car')}`,
          [
            "Haha, pas mal ! 😄",
            "Encore une blague !",
            "Tu es marrant Alex",
            "Parlons sérieusement",
            "Ma voiture a besoin d'aide"
          ]
        );
      });
    } else if (message.includes('au revoir') || message.includes('bye') || message.includes('à bientôt') || message.includes('tchao') || message.includes('salut')) {
      simulateTyping(() => {
        addBotMessage(
          `Au revoir ${context.userName ? context.userName : ''} ! ${getRandomEmoji('positive')} C'était un plaisir de discuter avec vous !\n\n🚗 **N'OUBLIEZ PAS** :\n• Votre véhicule mérite le meilleur !\n• Nous sommes toujours là pour vous aider\n• Service d'urgence 24h/24 disponible\n\n💬 **REVENEZ QUAND VOUS VOULEZ** !\n📞 **En urgence** : (+237) 675 978 777\n📍 **Notre adresse** : Rue PAU, Akwa (face AGROMAC)\n\nPrenez soin de vous et de votre voiture ! À très bientôt chez IN AUTO ! ${getRandomEmoji('car')} ✨`,
          [
            "À bientôt Alex ! 👋",
            "Merci pour tout !",
            "Je reviendrai sûrement",
            "Prendre RDV avant de partir"
          ]
        );
      });
    } else {
      // Réponse intelligente par défaut avec analyse du contexte
      const responses = [
        `${getPersonalizedGreeting()} Je comprends votre question ! Laissez-moi vous aider de la meilleure façon possible.`,
        `Intéressant ! ${getRandomEmoji('thinking')} Pouvez-vous me donner un peu plus de détails pour que je puisse mieux vous orienter ?`,
        `Je vois ! ${getRandomEmoji('positive')} Reformulez-moi ça différemment, je veux être sûr de bien vous comprendre et vous donner la meilleure réponse !`,
        `Ah ! ${getRandomEmoji('thinking')} J'ai peut-être mal saisi. Expliquez-moi autrement, je suis là pour vous aider !`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      simulateTyping(() => {
        addBotMessage(
          `${randomResponse}\n\n💡 **Voici ce que je peux faire pour vous** :\n• Répondre à toutes vos questions auto\n• Vous aider à prendre rendez-vous\n• Expliquer nos services en détail\n• Donner des conseils techniques\n• Vous orienter vers les bonnes solutions\n\nQue puis-je faire pour vous aider concrètement ?`,
          [
            "Prendre un rendez-vous",
            "Problème avec ma voiture",
            "Voir vos services",
            "Obtenir des tarifs",
            "Conseils techniques",
            "Parler à un humain"
          ],
          'general'
        );
      });
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addUserMessage(inputText);
      handleAdvancedResponse(inputText);
      setInputText('');
    }
  };

  const handleQuickReply = (reply: string) => {
    addUserMessage(reply);
    handleAdvancedResponse(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Bouton flottant amélioré */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse relative"
          >
            <MessageCircle className="h-6 w-6" />
            {/* Notification badge */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              <Heart className="h-3 w-3" />
            </div>
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-20 left-0 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Salut ! Je suis Alex 👋
          </div>
        </div>
      )}

      {/* Fenêtre de chat améliorée */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-96 h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header personnalisé */}
          <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white p-6 flex items-center justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full blur-xl"></div>
            </div>
            
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center relative">
                <Bot className="h-7 w-7" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Alex - Assistant IN AUTO</h3>
                <p className="text-sm opacity-90 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  En ligne • Répond à tout
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors relative z-10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages avec style amélioré */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                  <div className={`p-4 rounded-2xl ${
                    message.isBot 
                      ? 'bg-white text-gray-800 shadow-lg border border-gray-100' 
                      : 'bg-gradient-to-r from-blue-600 to-red-500 text-white shadow-lg'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.isBot && (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-2 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick replies améliorées */}
                  {message.quickReplies && (
                    <div className="mt-3 space-y-2">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="block w-full text-left p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                        >
                          <span className="flex items-center">
                            <span className="mr-2">{getRandomEmoji('positive')}</span>
                            {reply}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {!message.isBot && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-red-500 rounded-full flex items-center justify-center ml-3 order-2 flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator amélioré */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-red-500 rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Alex écrit</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input amélioré */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Tapez votre message${context.userName ? `, ${context.userName}` : ''}...`}
                className="flex-1 p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-3 bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            {/* Actions rapides améliorées */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickReply("J'ai un problème avec ma voiture")}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs hover:bg-red-200 transition-colors flex items-center"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                🚨 Problème
              </button>
              <button
                onClick={() => handleQuickReply("Prendre un rendez-vous")}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors flex items-center"
              >
                <Calendar className="h-3 w-3 mr-1" />
                📅 RDV
              </button>
              <button
                onClick={() => handleQuickReply("Voir vos services")}
                className="px-3 py-1 bg-black text-white rounded-full text-xs hover:bg-gray-800 transition-colors flex items-center"
              >
                <Wrench className="h-3 w-3 mr-1" />
                🔧 Services
              </button>
              <a
                href="tel:+237675978777"
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs hover:bg-red-200 transition-colors flex items-center"
              >
                <Phone className="h-3 w-3 mr-1" />
                📞 Appeler
              </a>
            </div>
            
            {/* Status bar */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                💬 Assistant IA intelligent • Répond à toutes vos questions
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;