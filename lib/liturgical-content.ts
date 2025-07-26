import { 
  Psaume,
  Hymne,
  Lecture as ParoleDeDieu,
  Repons,
  Intercession,
  Office,
  LiturgicalDay
} from './types/liturgical-types';

// Le contenu liturgique du 13 juin 2025
export const liturgicalContent2025_06_13: Record<string, Office> = {
  laudes: {
    name: 'Laudes',
    description: 'Office du matin',
    date: '2025-06-13',
    liturgicalInfo: {
      season: 'Temps ordinaire',
      week: 'Semaine I',
      celebration: 'Saint Antoine de Padoue, mémoire obligatoire'
    },
    content: {
      introduction: {
        verset: "V/ Seigneur, ouvre mes lèvres,",
        repons: "R/ et ma bouche publiera ta louange."
      },
      invitatoire: {
        antienne: "Béni sois-tu, Seigneur, Dieu de tendresse et d'amour.",
        psaume: {
          numero: "94",
          versets: [
            { numero: "1", texte: "Venez, crions de joie pour le Seigneur,\nacclamons notre Rocher, notre salut !" },
            { numero: "2", texte: "Allons jusqu'à lui en rendant grâce,\npar nos hymnes de fête acclamons-le !" },
            { numero: "3", texte: "Oui, le grand Dieu, c'est le Seigneur,\nle grand roi au-dessus de tous les dieux :" },
            { numero: "4", texte: "il tient en main les profondeurs de la terre,\net les sommets des montagnes sont à lui ;" },
            { numero: "5", texte: "à lui la mer, c'est lui qui l'a faite,\net les terres, car ses mains les ont pétries." },
            { numero: "6", texte: "Entrez, inclinez-vous, prosternez-vous,\nadorons le Seigneur qui nous a faits." },
            { numero: "7", texte: "Oui, il est notre Dieu ; +\nnous sommes le peuple qu'il conduit,\nle troupeau guidé par sa main." },
            { numero: "8", texte: "Aujourd'hui écouterez-vous sa parole ? +\n« Ne fermez pas votre cœur comme au désert,\ncomme au jour de tentation et de défi," },
            { numero: "9", texte: "où vos pères m'ont tenté et provoqué,\net pourtant ils avaient vu mon exploit." },
            { numero: "10", texte: "Quarante ans leur génération m'a déçu, +\net j'ai dit : Ce peuple a le cœur égaré,\nil n'a pas connu mes chemins." },
            { numero: "11", texte: "Dans ma colère, j'en ai fait le serment :\nJamais ils n'entreront dans mon repos. »" }
          ]
        }
      },
      hymne: {
        titre: "Qui donc est Dieu pour se livrer perdant",
        auteur: "Servel — Chalet",
        texte: [
          "Qui donc est Dieu pour se livrer perdant\naux mains de l’homme ?\nQui donc est Dieu, qui pleure notre mal\ncomme une mère ?",
          "R/Qui donc est Dieu pour nous aimer ainsi ?",
          "Qui donc est Dieu, qui tire de sa mort\nnotre naissance ?\nQui donc est Dieu pour nous ouvrir sa joie\net son royaume ?",
          "Qui donc est Dieu pour nous donner son Fils\nné de la femme ?\nQui donc est Dieu qui veut à tous ses fils\ndonner sa mère ?",
          "Qui donc est Dieu pour être notre Pain\nà chaque cène ?\nQui donc est Dieu pour appeler nos corps\njusqu’en sa gloire ?",
          "Qui donc est Dieu ? L’Amour est-il son nom\net son visage ?\nQui donc est Dieu qui fait de nous ses fils\nà son image ?"
        ],
        refrain: "Qui donc est Dieu pour nous aimer ainsi ?"
      },
      psaumes: [
        {
          antienne: "En ta tendresse, Seigneur, efface mon péché.",
          psaume: {
            numero: "50",
            versets: [
              { numero: "3", texte: "Pitié pour moi, mon Dieu, dans ton amour, selon ta grande miséricorde, efface mon péché." },
              { numero: "4", texte: "Lave-moi tout entier de ma faute, purifie-moi de mon offense." },
              { numero: "5", texte: "Oui, je connais mon péché, ma faute est toujours devant moi." },
              { numero: "6", texte: "Contre toi, et toi seul, j’ai péché, ce qui est mal à tes yeux, je l’ai fait." },
              { numero: "7", texte: "Moi, je suis né dans la faute, j’étais pécheur dès le sein de ma mère." },
              { numero: "8", texte: "Mais tu veux au fond de moi la vérité ; dans le secret, tu m’apprends la sagesse." },
              { numero: "9", texte: "Purifie-moi avec l’hysope, et je serai pur ; lave-moi et je serai blanc, plus que la neige." },
              { numero: "10", texte: "Fais que j’entende les chants et la fête : ils danseront, les os que tu broyais." },
              { numero: "11", texte: "Détourne ta face de mes fautes, enlève tous mes péchés." },
              { numero: "12", texte: "Crée en moi un cœur pur, ô mon Dieu, renouvelle et raffermis au fond de moi mon esprit." },
              { numero: "13", texte: "Ne me chasse pas loin de ta face, ne me reprends pas ton esprit saint." },
              { numero: "14", texte: "Rends-moi la joie d’être sauvé ; que l’esprit généreux me soutienne." },
              { numero: "15", texte: "Aux pécheurs, j’enseignerai tes chemins ; vers toi, reviendront les égarés." },
              { numero: "16", texte: "Libère-moi du sang versé, Dieu, mon Dieu sauveur, et ma langue acclamera ta justice." },
              { numero: "17", texte: "Seigneur, ouvre mes lèvres, et ma bouche annoncera ta louange." },
              { numero: "18", texte: "Si j’offre un sacrifice, tu n’en veux pas, tu n’acceptes pas d’holocauste." },
              { numero: "19", texte: "Le sacrifice qui plaît à Dieu, c’est un esprit brisé ; tu ne repousses pas, ô mon Dieu, un cœur brisé et broyé." },
              { numero: "20", texte: "Accorde à Sion le bonheur, relève les murs de Jérusalem." },
              { numero: "21", texte: "Alors tu accepteras de justes sacrifices, oblations et holocaustes ; alors on offrira des taureaux sur ton autel." }
            ]
          }
        },
        {
          antienne: "Souviens-toi, Seigneur, d’avoir pitié.",
          cantique: {
            titre: "Cantique d'Habaquq",
            reference: "Ha 3",
            versets: [
              { numero: "2", texte: "Seigneur, j'ai entendu parler de toi ; devant ton œuvre, Seigneur, j'ai craint ! Dans le cours des années, fais-la revivre, dans le cours des années, fais-la connaître ! Quand tu frémis de colère, souviens-toi d'avoir pitié." },
              { numero: "3", texte: "Dieu vient de Téman, et le saint, du Mont de Paran ; sa majesté couvre les cieux, sa gloire emplit la terre." },
              { numero: "4", texte: "Son éclat est pareil à la lumière ; + deux rayons sortent de ses mains : là se tient cachée sa puissance." },
              { numero: "13", texte: "Tu es sorti pour sauver ton peuple pour sauver ton messie." },
              { numero: "15", texte: "Tu as foulé, de tes chevaux, la mer et le remous des eaux profondes." },
              { numero: "16", texte: "J'ai entendu et mes entrailles ont frémi ; + à cette voix, mes lèvres tremblent, la carie pénètre mes os. Et moi je frémis d'être là, + d'attendre en silence le jour d'angoisse qui se lèvera sur le peuple dressé contre nous." },
              { numero: "17", texte: "Le figuier n'a pas fleuri ; pas de récolte dans les vignes. Le fruit de l'olivier a déçu ; dans les champs, plus de nourriture. L'enclos s'est vidé de ses brebis, et l'étable, de son bétail." },
              { numero: "18", texte: "Et moi, je bondis de joie dans le Seigneur, j'exulte en Dieu, mon Sauveur ! Le Seigneur mon Dieu est ma force ; + il me donne l'agilité du chamois, il me fait marcher dans les hauteurs." }
            ]
          }
        },
        {
          antienne: "Alléluia !",
          psaume: {
            numero: "147",
            versets: [
              { numero: "12", texte: "Glorifie le Seigneur, Jérusalem ! Célèbre ton Dieu, ô Sion !" },
              { numero: "13", texte: "Il a consolidé les barres de tes portes, dans tes murs il a béni tes enfants ;" },
              { numero: "14", texte: "il fait régner la paix à tes frontières, et d’un pain de froment te rassasie." },
              { numero: "15", texte: "Il envoie sa parole sur la terre : rapide, son verbe la parcourt." },
              { numero: "16", texte: "Il étale une toison de neige, il sème une poussière de givre." },
              { numero: "17", texte: "Il jette à poignées des glaçons ; devant ce froid, qui pourrait tenir ?" },
              { numero: "18", texte: "Il envoie sa parole : survient le dégel ; il répand son souffle : les eaux coulent." },
              { numero: "19", texte: "Il révèle sa parole à Jacob, ses volontés et ses lois à Israël." },
              { numero: "20", texte: "Pas un peuple qu’il ait ainsi traité ; nul autre n’a connu ses volontés." }
            ]
          }
        }
      ],
      cantique_zacharie: {
        antienne: "Par l’amour du cœur de notre Dieu, la lumière d’en haut vient nous visiter.",
        cantique: {
          titre: "Cantique de Zacharie",
          reference: "Lc 1",
          versets: [
            { numero: "68", texte: "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple." },
            { numero: "69", texte: "Il a fait surgir la force qui nous sauve dans la maison de David, son serviteur," },
            { numero: "70", texte: "comme il l'avait dit par la bouche des saints, par ses prophètes, depuis les temps anciens :" },
            { numero: "71", texte: "salut qui nous arrache à l'ennemi, à la main de tous nos oppresseurs," },
            { numero: "72", texte: "amour qu'il montre envers nos pères, mémoire de son alliance sainte," },
            { numero: "73", texte: "serment juré à notre père Abraham de nous rendre sans crainte," },
            { numero: "74", texte: "afin que, délivrés de la main des ennemis, +" },
            { numero: "75", texte: "nous le servions dans la justice et la sainteté, en sa présence, tout au long de nos jours." },
            { numero: "76", texte: "Et toi, petit enfant, tu seras appelé prophète du Très-Haut : * tu marcheras devant, à la face du Seigneur, et tu prépareras ses chemins" },
            { numero: "77", texte: "pour donner à son peuple de connaître le salut par la rémission de ses péchés," },
            { numero: "78", texte: "grâce à la tendresse, à l'amour de notre Dieu, quand nous visite l'astre d'en haut," },
            { numero: "79", texte: "pour illuminer ceux qui habitent les ténèbres et l'ombre de la mort, * pour conduire nos pas au chemin de la paix." }
          ]
        }
      },
      lecture: {
        reference: "Ep 2, 13-16",
        texte: "Maintenant, dans le Christ Jésus, vous qui étiez loin, vous êtes devenus proches par le sang du Christ. C’est lui, le Christ, qui est notre paix : des deux, Israël et les païens, il a fait un seul peuple ; par sa chair crucifiée, il a fait tomber ce qui les séparait, le mur de la haine, en supprimant les prescriptions juridiques de la loi de Moïse. Il voulait ainsi rassembler les uns et les autres en faisant la paix, et créer en lui un seul Homme nouveau. Les uns comme les autres, réunis en un seul corps, il voulait les réconcilier avec Dieu par la croix : en sa personne, il a tué la haine."
      },
      repons: {
        repons: "Par son sang, par sa croix, le Christ est notre paix.",
        versets: [
          "Vous qui étiez loin, en lui vous êtes proches.",
          "Il a tué la haine et fait de nous son corps."
        ]
      },
      intercessions: [
        {
          intention: "Seigneur Jésus, nous étions dans les ténèbres :",
          repons: "— tu ouvres nos yeux à la lumière."
        },
        {
          intention: "Seigneur Jésus, nous avions blasphémé ton nom :",
          repons: "— tu as pardonné notre faute."
        },
        {
          intention: "Seigneur Jésus, nous étions séparés de toi :",
          repons: "— tu nous rétablis dans ton alliance."
        },
        {
          intention: "Seigneur Jésus, nous vivions désunis :",
          repons: "— tu nous rassembles dans ton Corps."
        },
        {
          intention: "Seigneur Jésus, nous étions morts :",
          repons: "— par ta mort, tu nous rends la vie."
        }
      ],
      notre_pere: "Notre Père, qui es aux cieux, que ton nom soit sanctifié, que ton règne vienne, que ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd’hui notre pain de ce jour. Pardonne-nous nos offenses, comme nous pardonnons aussi à ceux qui nous ont offensés. Et ne nous laisse pas entrer en tentation mais délivre-nous du Mal. Amen.",
      oraison: "Dieu éternel et tout-puissant, tu as voulu que ton peuple trouve en saint Antoine de Padoue un grand prédicateur de l'Évangile et un défenseur des pauvres ; permets qu'avec son aide, et fidèles à ses leçons de vie chrétienne, nous ressentions dans toutes nos épreuves le bienfait de ton secours."
    }
  },
  tierce: {
    name: 'Tierce',
    description: 'Office du milieu de la matinée',
    date: '2025-06-13',
    liturgicalInfo: {
      season: 'Temps ordinaire',
      week: 'Semaine I',
      celebration: 'Férie'
    },
    content: {
      hymne: { titre: 'Hymne de Tierce', texte: ['Hymne de Tierce...'], refrain: '' },
      antiennes: ['Antienne de Tierce...'],
      psaumes: {
        psaume1: { numero: '120', versets: [{ numero: '1', texte: 'Psaume 120...' }] },
        cantique: { titre: 'Cantique', reference: 'Réf.', versets: [{ numero: '1', texte: 'Cantique...' }] },
        psaume2: { numero: '121', versets: [{ numero: '1', texte: 'Psaume 121...' }] }
      },
      lecture: { reference: 'Lecture de Tierce', texte: 'Lecture...' },
      repons: { repons: 'Répons de Tierce', versets: ['Verset...'] },
      intercessions: [{ intention: 'Intention...', repons: 'Répons...' }],
      oraison: 'Oraison de Tierce...'
    }
  },
  sexte: {
    name: 'Sexte',
    description: 'Office de la mi-journée',
    date: '2025-06-13',
    liturgicalInfo: {
      season: 'Temps ordinaire',
      week: 'Semaine I',
      celebration: 'Férie'
    },
    content: {
      hymne: { titre: 'Hymne de Sexte', texte: ['Hymne de Sexte...'], refrain: '' },
      antiennes: ['Antienne de Sexte...'],
      psaumes: {
        psaume1: { numero: '122', versets: [{ numero: '1', texte: 'Psaume 122...' }] },
        cantique: { titre: 'Cantique', reference: 'Réf.', versets: [{ numero: '1', texte: 'Cantique...' }] },
        psaume2: { numero: '123', versets: [{ numero: '1', texte: 'Psaume 123...' }] }
      },
      lecture: { reference: 'Lecture de Sexte', texte: 'Lecture...' },
      repons: { repons: 'Répons de Sexte', versets: ['Verset...'] },
      intercessions: [{ intention: 'Intention...', repons: 'Répons...' }],
      oraison: 'Oraison de Sexte...'
    }
  },
  none: {
    name: 'None',
    description: 'Office de l’après-midi',
    date: '2025-06-13',
    liturgicalInfo: {
      season: 'Temps ordinaire',
      week: 'Semaine I',
      celebration: 'Férie'
    },
    content: {
      hymne: { titre: 'Hymne de None', texte: ['Hymne de None...'], refrain: '' },
      antiennes: ['Antienne de None...'],
      psaumes: {
        psaume1: { numero: '124', versets: [{ numero: '1', texte: 'Psaume 124...' }] },
        cantique: { titre: 'Cantique', reference: 'Réf.', versets: [{ numero: '1', texte: 'Cantique...' }] },
        psaume2: { numero: '125', versets: [{ numero: '1', texte: 'Psaume 125...' }] }
      },
      lecture: { reference: 'Lecture de None', texte: 'Lecture...' },
      repons: { repons: 'Répons de None', versets: ['Verset...'] },
      intercessions: [{ intention: 'Intention...', repons: 'Répons...' }],
      oraison: 'Oraison de None...'
    }
  },
  vepres: {
    name: 'Vêpres',
    description: 'Office du soir',
    date: '2025-06-13',
    liturgicalInfo: {
      season: 'Temps ordinaire',
      week: 'Semaine I',
      celebration: 'Férie'
    },
    content: {
      hymne: { titre: 'Hymne de Vêpres', texte: ['Hymne de Vêpres...'], refrain: '' },
      antiennes: ['Antienne de Vêpres...'],
      psaumes: {
        psaume1: { numero: '126', versets: [{ numero: '1', texte: 'Psaume 126...' }] },
        cantique: { titre: 'Cantique', reference: 'Réf.', versets: [{ numero: '1', texte: 'Cantique...' }] },
        psaume2: { numero: '127', versets: [{ numero: '1', texte: 'Psaume 127...' }] }
      },
      lecture: { reference: 'Lecture de Vêpres', texte: 'Lecture...' },
      repons: { repons: 'Répons de Vêpres', versets: ['Verset...'] },
      intercessions: [{ intention: 'Intention...', repons: 'Répons...' }],
      oraison: 'Oraison de Vêpres...'
    }
  },
  complies: {
    name: 'Complies',
    description: 'Prière du soir avant la nuit',
    date: '2025-06-13',
    liturgicalInfo: {
      season: 'Temps ordinaire',
      week: 'Semaine I',
      celebration: 'Férie'
    },
    content: {
      hymne: { titre: 'Hymne de Complies', texte: ['Hymne de Complies...'], refrain: '' },
      antiennes: ['Antienne de Complies...'],
      psaumes: {
        psaume1: { numero: '128', versets: [{ numero: '1', texte: 'Psaume 128...' }] },
        cantique: { titre: 'Cantique', reference: 'Réf.', versets: [{ numero: '1', texte: 'Cantique...' }] },
        psaume2: { numero: '129', versets: [{ numero: '1', texte: 'Psaume 129...' }] }
      },
      lecture: { reference: 'Lecture de Complies', texte: 'Lecture...' },
      repons: { repons: 'Répons de Complies', versets: ['Verset...'] },
      intercessions: [{ intention: 'Intention...', repons: 'Répons...' }],
      oraison: 'Oraison de Complies...'
    }
  }
};
