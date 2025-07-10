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
          "Salut ! 👋 Je suis Alex, votre assistant personnel chez IN AUTO. Je suis là pour discuter avec vous de tout ce qui concerne votre véhicule ! \n\nQue ce soit pour un conseil technique, une prise de rendez-vous, ou même juste pour papoter auto... je suis tout ouïe ! 😊\n\nComment puis-je vous aider aujourd'hui ?",
          [
            "J'ai besoin d'aide avec ma voiture",
            "Je veux prendre rendez-vous",
            "Parle-moi de vos services",
            "J'ai une question technique",
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

    // Réponses conversationnelles avancées
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello') || message.includes('bonsoir')) {
      const timeGreeting = new Date().getHours() < 18 ? 'journée' : 'soirée';
      simulateTyping(() => {
        addBotMessage(
          `${getPersonalizedGreeting()} Excellente ${timeGreeting} ${context.userName ? context.userName : 'à vous'} ! ${getRandomEmoji('positive')}\n\nJe suis ravi de vous rencontrer ! Chez IN AUTO, on adore discuter avec nos clients. Votre véhicule va bien ? Qu'est-ce qui vous amène aujourd'hui ?`,
          [
            "Ma voiture a un problème",
            "Je veux un entretien",
            "Juste des infos",
            "Tu es sympa ! 😊"
          ]
        );
      });
    } else if (message.includes('comment ça va') || message.includes('comment allez-vous')) {
      simulateTyping(() => {
        addBotMessage(
          `Ça va super bien, merci de demander ! ${getRandomEmoji('positive')} Je suis en pleine forme pour vous aider avec votre véhicule !\n\nEt vous, comment ça se passe avec votre voiture ? Tout roule comme sur des roulettes ? ${getRandomEmoji('car')}`,
          [
            "Oui, tout va bien !",
            "J'ai quelques soucis...",
            "Je veux juste m'informer",
            "Parle-moi de tes services"
          ]
        );
      });
    } else if (message.includes('qui es-tu') || message.includes('qui êtes-vous') || message.includes('présente-toi')) {
      simulateTyping(() => {
        addBotMessage(
          `Moi c'est Alex ! ${getRandomEmoji('positive')} Je suis l'assistant virtuel d'IN AUTO, mais j'aime me considérer comme votre ami mécano numérique ! 🤖\n\nJ'ai été créé pour rendre votre expérience automobile plus simple et plus humaine. Je connais tout sur nos services, je peux vous conseiller, prendre vos rendez-vous, et même discuter de mécanique si ça vous dit !\n\nJ'adore les voitures autant que vous ! ${getRandomEmoji('car')} Qu'est-ce qui vous passionne dans l'automobile ?`,
          [
            "Les voitures de sport !",
            "L'entretien de ma voiture",
            "Les nouvelles technologies",
            "Juste que ça marche ! 😅"
          ]
        );
      });
    } else if (message.includes('merci') || message.includes('thanks')) {
      simulateTyping(() => {
        addBotMessage(
          `Avec grand plaisir ! ${getRandomEmoji('positive')} C'est exactement pour ça que je suis là !\n\n${context.userName ? `${context.userName}, ` : ''}n'hésitez jamais à revenir me voir. Que ce soit pour un conseil, une question technique, ou même juste pour discuter... je suis toujours disponible ! ${getRandomEmoji('service')}\n\nVotre satisfaction, c'est notre priorité chez IN AUTO ! 🎯`,
          [
            "Tu es vraiment sympa !",
            "J'aurai sûrement d'autres questions",
            "Prendre rendez-vous maintenant",
            "À bientôt Alex ! 👋"
          ]
        );
      });
    } else if (message.includes('problème') || message.includes('panne') || message.includes('souci') || message.includes('bug')) {
      simulateTyping(() => {
        addBotMessage(
          `Oh là là ! ${getRandomEmoji('thinking')} Un problème avec votre véhicule ? Ne vous inquiétez pas, on va résoudre ça ensemble !\n\nRacontez-moi tout : qu'est-ce qui se passe exactement ? Des bruits bizarres ? Un voyant qui s'allume ? La voiture qui fait des caprices ?\n\nPlus vous me donnez de détails, mieux je peux vous orienter ! ${getRandomEmoji('tools')}`,
          [
            "Bruit étrange au moteur",
            "Voyant qui s'allume",
            "Problème de démarrage",
            "Climatisation en panne",
            "Freins qui grincent",
            "Autre problème..."
          ]
        );
      });
    } else if (message.includes('bruit') && (message.includes('moteur') || message.includes('motor'))) {
      simulateTyping(() => {
        addBotMessage(
          `Ah, un bruit au moteur... ${getRandomEmoji('thinking')} C'est effectivement quelque chose à prendre au sérieux !\n\nPour mieux vous aider, dites-moi :\n• Le bruit apparaît quand ? (au démarrage, en roulant, à l'arrêt ?)\n• Ça ressemble à quoi ? (grincement, claquement, sifflement ?)\n• Depuis quand vous l'entendez ?\n\nEn attendant, évitez de forcer sur le moteur. Nos experts peuvent faire un diagnostic complet pour 15 000 FCFA seulement ! ${getRandomEmoji('tools')}`,
          [
            "Bruit au démarrage",
            "Bruit en roulant",
            "Grincement",
            "Claquement",
            "Prendre RDV diagnostic"
          ]
        );
      });
    } else if (message.includes('voyant') || message.includes('témoin')) {
      simulateTyping(() => {
        addBotMessage(
          `Un voyant allumé ! ${getRandomEmoji('thinking')} Votre voiture essaie de vous dire quelque chose d'important !\n\nDe quelle couleur est le voyant ?\n🔴 **Rouge** = Arrêtez-vous immédiatement !\n🟡 **Orange/Jaune** = Attention, à vérifier rapidement\n🔵 **Bleu** = Généralement informatif\n\nQuel voyant exactement ? Moteur ? Huile ? Batterie ? Freins ?\n\nNotre diagnostic électronique peut identifier le problème en 15 minutes ! ${getRandomEmoji('service')}`,
          [
            "Voyant moteur",
            "Voyant huile",
            "Voyant batterie",
            "Voyant freins",
            "Je ne sais pas lequel",
            "Diagnostic immédiat"
          ]
        );
      });
    } else if (message.includes('démarrage') || message.includes('démarre pas') || message.includes('ne démarre pas')) {
      simulateTyping(() => {
        addBotMessage(
          `Problème de démarrage ? ${getRandomEmoji('thinking')} C'est frustrant, je comprends !\n\nQuelques questions pour vous aider :\n• Le moteur fait-il un bruit quand vous tournez la clé ?\n• Les phares s'allument-ils normalement ?\n• Avez-vous entendu des "clics" ?\n\nÇa peut être la batterie (très fréquent), le démarreur, ou l'alternateur. Nos techniciens peuvent intervenir rapidement !\n\n🚨 **Service d'urgence disponible 24h/24** ! ${getRandomEmoji('service')}`,
          [
            "Aucun bruit",
            "Fait des clics",
            "Phares faibles",
            "Moteur tousse",
            "Appel d'urgence",
            "Diagnostic batterie"
          ]
        );
      });
    } else if (message.includes('climatisation') || message.includes('clim') || message.includes('froid') || message.includes('chaud')) {
      simulateTyping(() => {
        addBotMessage(
          `Ah la climatisation ! ${getRandomEmoji('service')} Avec la chaleur qu'il fait au Cameroun, c'est vraiment essentiel !\n\nQuel est le souci exactement ?\n• Plus de froid du tout ?\n• Froid faible ?\n• Mauvaise odeur ?\n• Bruit bizarre ?\n\nSouvent c'est juste une recharge de gaz ou un filtre à changer. Notre service clim complet démarre à 25 000 FCFA avec garantie 6 mois ! ❄️\n\nOn peut vous arranger ça rapidement ! ${getRandomEmoji('positive')}`,
          [
            "Plus de froid",
            "Froid faible",
            "Mauvaise odeur",
            "Bruit bizarre",
            "Recharge gaz",
            "RDV climatisation"
          ]
        );
      });
    } else if (message.includes('freins') || message.includes('frein') || message.includes('grince')) {
      simulateTyping(() => {
        addBotMessage(
          `Les freins qui grincent ? ${getRandomEmoji('thinking')} C'est un signal d'alarme important pour votre sécurité !\n\nNe prenez pas ça à la légère ! Ça peut indiquer :\n• Plaquettes usées\n• Disques abîmés\n• Manque de liquide de frein\n\nNotre conseil : **venez rapidement** pour un contrôle gratuit ! Votre sécurité n'a pas de prix. ${getRandomEmoji('service')}\n\nNos experts freinage peuvent vous recevoir en urgence ! 🛡️`,
          [
            "Contrôle gratuit freins",
            "RDV urgent",
            "Grincement fort",
            "Pédale molle",
            "Appeler maintenant"
          ]
        );
      });
    } else if (message.includes('conseil') || message.includes('recommandation') || message.includes('que faire')) {
      simulateTyping(() => {
        addBotMessage(
          `Vous voulez des conseils ? ${getRandomEmoji('positive')} J'adore ça ! Partager mon expertise, c'est ma passion !\n\nSur quoi voulez-vous mes conseils ?\n• Entretien préventif ?\n• Économies de carburant ?\n• Choix de pneus ?\n• Préparation voyage ?\n• Conduite éco-responsable ?\n\nJe suis là pour vous aider à prendre soin de votre véhicule comme un pro ! ${getRandomEmoji('tools')}`,
          [
            "Entretien préventif",
            "Économiser le carburant",
            "Choisir mes pneus",
            "Préparer un voyage",
            "Conduite écologique",
            "Autre conseil"
          ]
        );
      });
    } else if (message.includes('entretien') || message.includes('maintenance') || message.includes('révision')) {
      simulateTyping(() => {
        addBotMessage(
          `L'entretien ! ${getRandomEmoji('positive')} Voilà quelqu'un qui prend soin de sa voiture ! J'adore ça !\n\nUn véhicule bien entretenu, c'est :\n✨ Plus de fiabilité\n💰 Moins de pannes coûteuses\n🌱 Moins de pollution\n🎯 Meilleure revente\n\nQuand avez-vous fait votre dernière vidange ? Avec la chaleur camerounaise, on recommande tous les 5000-7500 km selon l'huile utilisée.\n\nNotre pack entretien complet démarre à 35 000 FCFA ! ${getRandomEmoji('service')}`,
          [
            "Dernière vidange il y a...",
            "Pack entretien complet",
            "Quand faire la révision ?",
            "Conseils entretien",
            "Prendre RDV entretien"
          ]
        );
      });
    } else if (message.includes('prix') || message.includes('tarif') || message.includes('coût') || message.includes('combien')) {
      simulateTyping(() => {
        addBotMessage(
          `Les tarifs ? ${getRandomEmoji('positive')} Chez IN AUTO, on croit en la transparence totale ! Pas de mauvaises surprises !\n\n💎 **Nos prix justes** :\n• Diagnostic : 15 000 FCFA\n• Vidange complète : 35 000 FCFA\n• Montage pneu : 5 000 FCFA\n• Géométrie : 15 000 FCFA\n• Service clim : 25 000 FCFA\n\n🛡️ **Garantie incluse** sur tout !\n💡 **Devis gratuit** avant intervention !\n\nQuel service vous intéresse ? Je peux vous donner un prix précis ! ${getRandomEmoji('service')}`,
          [
            "Devis personnalisé",
            "Diagnostic complet",
            "Entretien vidange",
            "Service climatisation",
            "Tous les tarifs"
          ]
        );
      });
    } else if (message.includes('rendez-vous') || message.includes('rdv') || message.includes('réserver') || message.includes('appointment')) {
      setContext(prev => ({ ...prev, appointmentStep: 1 }));
      simulateTyping(() => {
        addBotMessage(
          `Super ! ${getRandomEmoji('positive')} Prendre rendez-vous, c'est parti !\n\n${context.userName ? `${context.userName}, ` : ''}pour vous organiser le créneau parfait, j'ai besoin de quelques infos :\n\n1️⃣ **Quel service vous intéresse ?**\n2️⃣ **Quand souhaitez-vous venir ?**\n3️⃣ **Urgence ou planifié ?**\n\nCommençons par le service ! Qu'est-ce qui amène votre véhicule chez nous ? ${getRandomEmoji('car')}`,
          [
            "Diagnostic électronique",
            "Vidange + entretien",
            "Pneus + géométrie", 
            "Climatisation",
            "Freinage",
            "Réparation urgente",
            "Révision complète"
          ],
          'appointment'
        );
      });
    } else if (message.includes('horaire') || message.includes('ouvert') || message.includes('fermé') || message.includes('quand')) {
      simulateTyping(() => {
        addBotMessage(
          `Nos horaires ? ${getRandomEmoji('positive')} On est là pour vous quand vous en avez besoin !\n\n🕒 **Horaires normaux** :\n📅 Lundi à Samedi : 8h00 - 18h00\n🚫 Dimanche : Fermé (repos bien mérité ! 😴)\n\n🚨 **Mais attention** : Service d'urgence 24h/24 !\nPanne en pleine nuit ? Week-end ? On est là ! 💪\n\n📞 Urgences : (+237) 675 978 777\n\nQuand voulez-vous passer nous voir ? ${getRandomEmoji('service')}`,
          [
            "Aujourd'hui",
            "Cette semaine", 
            "Week-end",
            "Service d'urgence",
            "Prendre RDV"
          ]
        );
      });
    } else if (message.includes('où') || message.includes('adresse') || message.includes('localisation') || message.includes('situé')) {
      simulateTyping(() => {
        addBotMessage(
          `On nous trouve facilement ! ${getRandomEmoji('positive')} Voici notre adresse :\n\n📍 **IN AUTO**\n🏢 Rue PAU, Akwa\n🎯 **Repère facile** : En face d'AGROMAC\n🏪 À côté de la microfinance FIGEC\n🌍 Douala, Cameroun\n\n🚗 **Parking gratuit** disponible\n🚌 **Accessible** en transport\n🛣️ **Facile d'accès** depuis le centre-ville\n\nVous connaissez le quartier ? ${getRandomEmoji('car')}`,
          [
            "Je connais AGROMAC",
            "Comment y aller ?",
            "Transport en commun",
            "Prendre RDV",
            "Appeler pour directions"
          ],
          'contact'
        );
      });
    } else if (message.includes('équipe') || message.includes('technicien') || message.includes('mécanicien') || message.includes('qui')) {
      simulateTyping(() => {
        addBotMessage(
          `Notre équipe ? ${getRandomEmoji('positive')} C'est notre fierté ! Des vrais passionnés d'automobile !\n\n👨‍🔧 **Nos techniciens** :\n✅ Certifiés et formés en continu\n🎓 Spécialisés multi-marques\n💡 Experts en diagnostic électronique\n🛠️ Maîtrisent les dernières technologies\n\n❤️ **Mais surtout** : ils ADORENT les voitures autant que vous !\n\nChaque membre de l'équipe peut vous expliquer clairement ce qui ne va pas et comment on va le réparer. Transparence totale ! ${getRandomEmoji('tools')}`,
          [
            "Impressionnant !",
            "Ils sont sympas ?",
            "Spécialités techniques",
            "Rencontrer l'équipe",
            "Prendre RDV"
          ]
        );
      });
    } else if (message.includes('garantie') || message.includes('assurance') || message.includes('sûr')) {
      simulateTyping(() => {
        addBotMessage(
          `La garantie ? ${getRandomEmoji('positive')} C'est notre engagement envers vous !\n\n🛡️ **Notre promesse** :\n• **6 mois** sur toutes interventions\n• **12 mois** sur pièces majeures\n• **Pièces d'origine** garanties\n• **Main d'œuvre** incluse\n\n💪 **Si ça ne va pas** : on reprend GRATUITEMENT !\n\nC'est ça, la confiance IN AUTO ! On assume nos réparations à 100%. Vous dormez tranquille, on s'occupe de tout ! ${getRandomEmoji('service')}\n\nQuelque chose vous inquiète en particulier ?`,
          [
            "C'est rassurant !",
            "Pièces d'origine ?",
            "Que couvre la garantie ?",
            "J'ai confiance",
            "Prendre RDV"
          ]
        );
      });
    } else if (message.includes('urgent') || message.includes('urgence') || message.includes('vite') || message.includes('rapidement')) {
      simulateTyping(() => {
        addBotMessage(
          `Urgence ? ${getRandomEmoji('thinking')} On comprend, c'est stressant quand la voiture nous lâche !\n\n🚨 **Service d'urgence 24h/24** :\n📞 **Appelez immédiatement** : (+237) 675 978 777\n⚡ **Intervention rapide** possible\n🔧 **Dépannage sur route** disponible\n🏥 **Diagnostic express** en 15 minutes\n\nEn attendant :\n• Mettez-vous en sécurité\n• N'insistez pas si ça force\n• Notez les symptômes\n\n**On arrive !** ${getRandomEmoji('service')}`,
          [
            "Appeler maintenant",
            "Dépannage sur route",
            "Venir au garage",
            "Décrire le problème",
            "C'est vraiment urgent !"
          ]
        );
      });
    } else if (message.includes('sympa') || message.includes('cool') || message.includes('génial') || message.includes('super')) {
      simulateTyping(() => {
        addBotMessage(
          `Aww, merci ! ${getRandomEmoji('positive')} Ça me fait vraiment plaisir ! 😊\n\nVous savez quoi ? C'est exactement l'esprit qu'on veut chez IN AUTO ! Des relations humaines, de la bonne humeur, et la passion de l'automobile qui nous unit !\n\n${context.userName ? `${context.userName}, ` : ''}vous avez l'air sympa aussi ! J'ai hâte que vous rencontriez notre équipe, ils sont encore plus cool que moi ! 😄\n\nAlors, qu'est-ce qu'on peut faire pour votre véhicule ? ${getRandomEmoji('car')}`,
          [
            "Tu me fais rire ! 😄",
            "Hâte de vous rencontrer",
            "Parlons de ma voiture",
            "Prendre rendez-vous",
            "Juste discuter encore"
          ]
        );
      });
    } else if (message.includes('blague') || message.includes('drôle') || message.includes('rire') || message.includes('humour')) {
      const jokes = [
        "Pourquoi les mécaniciens sont-ils toujours de bonne humeur ? Parce qu'ils savent comment remonter le moral... et les moteurs ! 😄",
        "Que dit un pneu à un autre pneu ? 'Tu me gonfles !' 🎈",
        "Pourquoi les voitures vont-elles chez le médecin ? Pour faire contrôler leur tension... de courroie ! 🩺",
        "Comment appelle-t-on un chat qui répare les voitures ? Un mé-chat-nicien ! 🐱🔧"
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      
      simulateTyping(() => {
        addBotMessage(
          `Ah, vous aimez l'humour ! ${getRandomEmoji('positive')} Moi aussi ! Voici une petite blague auto :\n\n${randomJoke}\n\nAlors, ça vous a fait sourire ? 😊 Chez IN AUTO, on aime garder la bonne humeur même quand on parle mécanique !\n\nBon, revenons à nos voitures maintenant ! ${getRandomEmoji('car')}`,
          [
            "Haha, pas mal ! 😄",
            "Encore une blague !",
            "Tu es marrant Alex",
            "Parlons sérieusement maintenant",
            "Ma voiture a besoin d'aide"
          ]
        );
      });
    } else if (message.includes('au revoir') || message.includes('bye') || message.includes('à bientôt') || message.includes('tchao')) {
      simulateTyping(() => {
        addBotMessage(
          `Au revoir ${context.userName ? context.userName : ''} ! ${getRandomEmoji('positive')} C'était un plaisir de discuter avec vous !\n\n🚗 **N'oubliez pas** : votre véhicule mérite le meilleur !\n💬 **Revenez quand vous voulez** : je suis toujours là !\n📞 **En urgence** : (+237) 675 978 777\n\nPrenez soin de vous et de votre voiture ! À très bientôt chez IN AUTO ! ${getRandomEmoji('car')} ✨`,
          [
            "À bientôt Alex ! 👋",
            "Merci pour tout !",
            "Je reviendrai sûrement",
            "Prendre RDV avant de partir"
          ]
        );
      });
    } else {
      // Réponse intelligente par défaut
      const responses = [
        `Hmm, intéressant ! ${getRandomEmoji('thinking')} Je ne suis pas sûr de bien saisir, mais j'aimerais vous aider !`,
        `${getPersonalizedGreeting()} Pouvez-vous me donner un peu plus de détails ?`,
        `Je vois ! ${getRandomEmoji('positive')} Reformulez-moi ça différemment, je veux être sûr de bien vous comprendre !`,
        `Ah ! ${getRandomEmoji('thinking')} J'ai peut-être mal compris. Expliquez-moi autrement ?`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      simulateTyping(() => {
        addBotMessage(
          `${randomResponse}\n\nEn attendant, voici ce que je peux faire pour vous :`,
          [
            "Prendre un rendez-vous",
            "Problème avec ma voiture",
            "Voir vos services",
            "Obtenir des tarifs",
            "Juste discuter ! 😊",
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
                  En ligne • Répond comme un humain
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
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200 transition-colors flex items-center"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                🚨 Problème
              </button>
              <button
                onClick={() => handleQuickReply("Prendre un rendez-vous")}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors flex items-center"
              >
                <Calendar className="h-3 w-3 mr-1" />
                📅 RDV
              </button>
              <button
                onClick={() => handleQuickReply("Voir vos services")}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors flex items-center"
              >
                <Wrench className="h-3 w-3 mr-1" />
                🔧 Services
              </button>
              <a
                href="tel:+237675978777"
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 transition-colors flex items-center"
              >
                <Phone className="h-3 w-3 mr-1" />
                📞 Appeler
              </a>
            </div>
            
            {/* Status bar */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                💬 Propulsé par l'IA conversationnelle • Réponses humaines garanties
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;