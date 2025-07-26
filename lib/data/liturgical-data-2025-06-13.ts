// Données liturgiques pour le 13 juin 2025 (Fête de Saint Antoine de Padoue)
export const OFFICE_13_JUIN_2025 = {
  metadata: {
    date: "2025-06-13",
    temps_liturgique: "Temps ordinaire",
    semaine_psautier: 3,
    celebration: {
      nom: "Saint Antoine de Padoue",
      rang: "mémoire",
      couleur: "blanc"
    }
  },
  offices: {
    laudes: {
      introduction: {
        verset: "V/ Seigneur, ouvre mes lèvres,",
        repons: "R/ et ma bouche publiera ta louange."
      },
      invitatoire: {
        antienne: "Béni sois-tu, Seigneur, Dieu de tendresse et d'amour.",
        psaume: {
          numero: "94",
          versets: [
            { numero: "1", texte: "Venez, crions de joie pour le Seigneur, acclamons notre Rocher, notre salut !" },
            { numero: "2", texte: "Allons jusqu'à lui en rendant grâce, par nos hymnes de fête acclamons-le !" },
            { numero: "3", texte: "Oui, le grand Dieu, c'est le Seigneur, le grand roi au-dessus de tous les dieux :" },
            { numero: "4", texte: "il tient en main les profondeurs de la terre, et les sommets des montagnes sont à lui ;" },
            { numero: "5", texte: "à lui la mer, c'est lui qui l'a faite, et les terres, car ses mains les ont pétries." },
            { numero: "6", texte: "Entrez, inclinez-vous, prosternez-vous, adorons le Seigneur qui nous a faits." },
            { numero: "7", texte: "Oui, il est notre Dieu ; nous sommes le peuple qu'il conduit, le troupeau guidé par sa main." }
          ]
        }
      },
      hymne: {
        titre: "Qui donc est Dieu pour se livrer perdant",
        auteur: "Servel — Chalet",
        texte: [
          "Qui donc est Dieu pour se livrer perdant\naux mains de l'homme ?",
          "Qui donc est Dieu, qui pleure notre mal\ncomme une mère ?",
          "Qui donc est Dieu pour nous aimer ainsi ?",
          "Qui donc est Dieu, qui tire de sa mort\nnotre naissance ?",
          "Qui donc est Dieu pour nous ouvrir sa joie\net son royaume ?"
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
              { numero: "6", texte: "Contre toi, et toi seul, j'ai péché, ce qui est mal à tes yeux, je l'ai fait." }
            ]
          }
        },
        {
          antienne: "Souviens-toi, Seigneur, d'avoir pitié.",
          cantique: {
            titre: "Cantique d'Habaquq",
            reference: "Ha 3",
            versets: [
              { numero: "2", texte: "Seigneur, j'ai entendu parler de toi ; devant ton œuvre, Seigneur, j'ai craint !" },
              { numero: "3", texte: "Dans le cours des années, fais-la revivre, dans le cours des années, fais-la connaître !" },
              { numero: "4", texte: "Quand tu frémis de colère, souviens-toi d'avoir pitié." }
            ]
          }
        },
        {
          antienne: "Alléluia !",
          psaume: {
            numero: "147",
            versets: [
              { numero: "12", texte: "Glorifie le Seigneur, Jérusalem ! Célèbre ton Dieu, ô Sion !" },
              { numero: "13", texte: "Il a consolidé les barres de tes portes, dans tes murs il a béni tes enfants." },
              { numero: "14", texte: "Il fait régner la paix à tes frontières, et d'un pain de froment te rassasie." }
            ]
          }
        }
      ],
      lecture: {
        reference: "Ep 2, 13-16",
        texte: "Maintenant, dans le Christ Jésus, vous qui étiez loin, vous êtes devenus proches par le sang du Christ. C'est lui, le Christ, qui est notre paix : des deux, Israël et les païens, il a fait un seul peuple ; par sa chair crucifiée, il a fait tomber ce qui les séparait, le mur de la haine, en supprimant les prescriptions juridiques de la loi de Moïse. Il voulait ainsi rassembler les uns et les autres en faisant la paix, et créer en lui un seul Homme nouveau. Les uns comme les autres, réunis en un seul corps, il voulait les réconcilier avec Dieu par la croix : en sa personne, il a tué la haine."
      },
      repons: {
        repons: "Par son sang, par sa croix, le Christ est notre paix.",
        versets: [
          "Vous qui étiez loin, en lui vous êtes proches.",
          "Il a tué la haine et fait de nous son corps."
        ]
      },
      cantique_evangelique: {
        antienne: "Par l'amour du cœur de notre Dieu, la lumière d'en haut vient nous visiter.",
        cantique: {
          titre: "Cantique de Zacharie",
          reference: "Lc 1",
          versets: [
            { numero: "68", texte: "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple." },
            { numero: "69", texte: "Il a fait surgir la force qui nous sauve dans la maison de David, son serviteur," },
            { numero: "70", texte: "comme il l'avait dit par la bouche des saints, par ses prophètes, depuis les temps anciens :" }
          ]
        }
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
      oraison: {
        texte: "Dieu éternel et tout-puissant, tu as voulu que ton peuple trouve en saint Antoine de Padoue un grand prédicateur de l'Évangile et un défenseur des pauvres ; permets qu'avec son aide, et fidèles à ses leçons de vie chrétienne, nous ressentions dans toutes nos épreuves le bienfait de ton secours."
      }
    }
  }
};
