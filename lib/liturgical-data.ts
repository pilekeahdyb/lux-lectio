export interface Office {
  type: string;
  titre: string;
  description: string;
  contenu: {
    introduction?: string;
    hymne?: {
      titre: string;
      texte: string;
    };
    antiennes: string[];
    psaumes: Array<{
      numero: string;
      titre: string;
      texte: string;
      antienne?: string;
    }>;
    lecture?: {
      reference: string;
      titre: string;
      texte: string;
    };
    repons?: {
      verset: string;
      repons: string;
    };
    cantique?: {
      reference: string;
      titre: string;
      texte: string;
      antienne: string;
    };
    intercessions?: Array<{
      intention: string;
      repons: string;
    }>;
    oraison?: string;
    conclusion?: string;
  };
}

export interface JourLiturgique {
  date: string;
  jour_semaine: string;
  temps_liturgique: string;
  semaine_psautier: string;
  celebration?: {
    nom: string;
    rang: string;
    couleur: string;
  };
  offices: Record<string, Office>;
}

// Base de données liturgique
export const LITURGICAL_DATABASE: Record<string, JourLiturgique> = {
  "2025-06-13": {
    date: "2025-06-13",
    jour_semaine: "vendredi",
    temps_liturgique: "Temps ordinaire",
    semaine_psautier: "semaine IV",
    celebration: {
      nom: "Saint Antoine de Padoue",
      rang: "mémoire",
      couleur: "blanc"
    },
    offices: {
      "office_lectures": {
        type: "office_lectures",
        titre: "Office des lectures",
        description: "Prière de méditation de la Parole",
        contenu: {
          introduction: "Seigneur, ouvre mes lèvres, et ma bouche publiera ta louange.",
          hymne: {
            titre: "Hymne de l'office des lectures",
            texte: "Seigneur, en ta lumière, nous voyons la lumière, toi la source de vie."
          },
          antiennes: [
            "Heureux l'homme qui médite la loi du Seigneur !",
            "Notre Dieu vient, il ne garde pas le silence."
          ],
          psaumes: [
            {
              numero: "1",
              titre: "Les deux voies",
              texte: "Heureux est l'homme qui n'entre pas au conseil des méchants, qui ne suit pas le chemin des pécheurs, ne siège pas avec ceux qui ricanent, mais se plaît dans la loi du Seigneur et murmure sa loi jour et nuit !",
              antienne: "Heureux l'homme qui se plaît dans la loi du Seigneur !"
            },
            {
              numero: "2",
              titre: "Le Messie, Roi vainqueur",
              texte: "Pourquoi ce tumulte des nations, ce vain murmure des peuples ? Les rois de la terre se dressent, les grands se liguent entre eux contre le Seigneur et son messie."
            }
          ],
          lecture: {
            reference: "He 13, 7-9a",
            titre: "Lecture de la lettre aux Hébreux",
            texte: "Souvenez-vous de ceux qui vous ont dirigés : ils vous ont annoncé la parole de Dieu. Méditez sur l'aboutissement de la vie qu'ils ont menée, et imitez leur foi. Jésus Christ, hier et aujourd'hui, est le même, il l'est pour l'éternité. Ne vous laissez pas égarer par toutes sortes de doctrines étrangères."
          },
          repons: {
            verset: "Ils ont annoncé l'œuvre de Dieu.",
            repons: "Et ils ont compris ce qu'il a fait."
          },
          oraison: "Seigneur, tu as accordé à saint Antoine de Padoue de prêcher les mystères du Christ ; fais que, sous la conduite de l'Évangile, nous découvrions ta présence en toute chose. Par Jésus Christ, ton Fils, notre Seigneur et notre Dieu, qui règne avec toi et le Saint Esprit, maintenant et pour les siècles des siècles.",
          conclusion: "Bénissons le Seigneur. Nous rendons grâce à Dieu."
        }
      },
      "laudes": {
        type: "laudes",
        titre: "Laudes du vendredi",
        description: "Prière du matin",
        contenu: {
          introduction: "Seigneur, ouvre mes lèvres, et ma bouche publiera ta louange.",
          hymne: {
            titre: "Hymne du matin",
            texte: "Splendeur jaillie du sein du Père avant que naisse la lumière, Tu es le jour qui forme en nous les fils du jour et de lumière."
          },
          antiennes: [
            "Par ton sang, Seigneur, tu nous as rachetés pour Dieu.",
            "Le Seigneur l'a juré, il ne s'en dédira pas : Tu es prêtre pour toujours."
          ],
          psaumes: [
            {
              numero: "51",
              titre: "Pitié, Seigneur",
              texte: "Pitié pour moi, mon Dieu, dans ton amour, selon ta grande miséricorde, efface mon péché.",
              antienne: "Dieu, crée pour moi un cœur pur, renouvelle en ma poitrine un esprit fidèle."
            },
            {
              numero: "100",
              titre: "La joie de ceux qui entrent dans le temple",
              texte: "Acclamez le Seigneur, terre entière, servez le Seigneur dans l'allégresse, venez à lui avec des chants de joie !",
              antienne: "Entrez dans le Temple du Seigneur aux accents de louange."
            }
          ],
          lecture: {
            reference: "Ep 4, 29-32",
            titre: "Lecture de la lettre de saint Paul Apôtre aux Éphésiens",
            texte: "Aucune parole mauvaise ne doit sortir de votre bouche ; mais, s'il en est besoin, que ce soit une parole bonne et constructive, profitable à ceux qui vous écoutent. N'attristez pas le Saint Esprit de Dieu, qui vous a marqués de son sceau en vue du jour de votre délivrance. Amertume, irritation, colère, éclats de voix ou insultes, tout cela doit être éliminé de votre vie, ainsi que toute espèce de méchanceté. Soyez entre vous pleins de générosité et de tendresse. Pardonnez-vous les uns aux autres, comme Dieu vous a pardonné dans le Christ."
          },
          repons: {
            verset: "Béni soit le Seigneur, dès maintenant et à jamais !",
            repons: "Du lever du soleil à son coucher, loué soit le nom du Seigneur !"
          },
          cantique: {
            reference: "Cantique de Zacharie",
            titre: "Benedictus",
            texte: "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple.",
            antienne: "Le Seigneur nous a visités et rachetés."
          },
          intercessions: [
            {
              intention: "Pour l'Église, qu'elle soit témoin fidèle de ton amour",
              repons: "Seigneur, nous te prions."
            },
            {
              intention: "Pour les malades et les souffrants",
              repons: "Seigneur, nous te prions."
            },
            {
              intention: "Pour la paix dans le monde",
              repons: "Seigneur, nous te prions."
            }
          ],
          oraison: "Dieu qui as fait de saint Antoine de Padoue un témoin infatigable de l'Évangile, donne-nous de vivre selon ta parole et d'être dans le monde les témoins de ta charité. Par Jésus Christ, ton Fils, notre Seigneur et notre Dieu, qui règne avec toi et le Saint Esprit, maintenant et pour les siècles des siècles.",
          conclusion: "Que le Seigneur nous bénisse, qu'il nous garde de tout mal et nous conduise à la vie éternelle. Amen."
        }
      },
      "tierce": {
        type: "tierce",
        titre: "Tierce",
        description: "Prière du milieu de la matinée",
        contenu: {
          introduction: "Dieu, viens à mon aide ! Seigneur, à notre secours !",
          hymne: {
            titre: "Hymne de Tierce",
            texte: "Viens, Esprit Saint, en nos cœurs, et envoie du haut du ciel un rayon de ta lumière."
          },
          antiennes: [
            "La loi du Seigneur est parfaite, qui redonne vie."
          ],
          psaumes: [
            {
              numero: "119, 1-8",
              titre: "Méditation de la parole de Dieu dans la loi",
              texte: "Heureux les hommes intègres dans leurs voies qui marchent suivant la loi du Seigneur ! Heureux ceux qui gardent ses exigences, ils le cherchent de tout cœur !",
              antienne: "Guide-moi, Seigneur, sur la voie de tes commandements."
            }
          ],
          lecture: {
            reference: "1 R 8, 60-61",
            titre: "Lecture du premier livre des Rois",
            texte: "Tous les peuples de la terre sauront que le Seigneur seul est Dieu, qu'il n'y en a pas d'autre. Que votre cœur soit tout entier au Seigneur, notre Dieu, pour suivre ses lois et garder ses commandements."
          },
          repons: {
            verset: "Seigneur, enseigne-moi tes voies,",
            repons: "Fais-moi connaître ta route."
          },
          oraison: "Seigneur Dieu, Père tout-puissant, tu nous as fait parvenir à cette heure du matin ; que ta puissance nous guide au long du jour, afin que nous ne nous écartions pas du droit chemin. Par Jésus Christ, ton Fils, notre Seigneur et notre Dieu, qui règne avec toi et le Saint Esprit, maintenant et pour les siècles des siècles.",
          conclusion: "Bénissons le Seigneur. Nous rendons grâce à Dieu."
        }
      },
      "sexte": {
        type: "sexte",
        titre: "Sexte",
        description: "Prière du milieu du jour",
        contenu: {
          introduction: "Dieu, viens à mon aide ! Seigneur, à notre secours !",
          hymne: {
            titre: "Hymne de Sexte",
            texte: "Quand le soleil est au plus haut dans notre ciel, fais-nous connaître, Dieu très bon, les vrais biens."
          },
          antiennes: [
            "Tu es mon Dieu, j'ai confiance en toi."
          ],
          psaumes: [
            {
              numero: "123",
              titre: "Notre aide est dans le nom du Seigneur",
              texte: "Sans le Seigneur qui était pour nous quand des hommes nous assaillirent, alors ils nous avalaient tout vivants, dans le feu de leur colère.",
              antienne: "Notre aide est dans le nom du Seigneur qui a fait le ciel et la terre."
            }
          ],
          lecture: {
            reference: "Am 4, 13",
            titre: "Lecture du livre d'Amos",
            texte: "C'est lui qui forme les montagnes et qui crée le vent, qui révèle à l'homme ses pensées, qui change l'aurore en ténèbres, qui marche sur les hauteurs de la terre : son nom est Le Seigneur, Dieu de l'univers."
          },
          repons: {
            verset: "À toi, Seigneur, la grandeur et la force !",
            repons: "À toi, la gloire et la victoire !"
          },
          oraison: "Dieu fort, Dieu fidèle, tu apaises la soif de ceux qui peinent sous le poids du jour ; donne-nous maintenant le réconfort de ta présence, pour te servir sans défaillance. Par Jésus Christ, ton Fils, notre Seigneur et notre Dieu, qui règne avec toi et le Saint Esprit, maintenant et pour les siècles des siècles.",
          conclusion: "Bénissons le Seigneur. Nous rendons grâce à Dieu."
        }
      },
      "none": {
        type: "none",
        titre: "None",
        description: "Prière de l'après-midi",
        contenu: {
          introduction: "Dieu, viens à mon aide ! Seigneur, à notre secours !",
          hymne: {
            titre: "Hymne de None",
            texte: "En cette heure où le soleil décline vers le soir, nous te prions, Seigneur : que ta clarté ne cesse de nous conduire."
          },
          antiennes: [
            "Le Seigneur est ma force et mon chant, je lui dois le salut."
          ],
          psaumes: [
            {
              numero: "126",
              titre: "La joie du retour",
              texte: "Quand le Seigneur ramena les captifs à Sion, nous étions comme en rêve ! Alors notre bouche était pleine de rires, nous poussions des cris de joie.",
              antienne: "Qui sème dans les larmes moissonne dans la joie."
            }
          ],
          lecture: {
            reference: "1 Co 12, 13",
            titre: "Lecture de la première lettre de saint Paul Apôtre aux Corinthiens",
            texte: "Nous avons été baptisés dans l'unique Esprit pour former un seul corps. Tous nous avons bu à l'unique Esprit."
          },
          repons: {
            verset: "Les disciples étaient assidus à la prière,",
            repons: "Avec Marie, la mère de Jésus."
          },
          oraison: "Dieu éternel, tu restes fidèle à ton alliance ; en cette heure où tu clouais ton Fils à la croix pour le salut du monde, accorde-nous de recevoir la grâce qui découle de ses plaies. Lui qui règne avec toi et le Saint Esprit, maintenant et pour les siècles des siècles.",
          conclusion: "Bénissons le Seigneur. Nous rendons grâce à Dieu."
        }
      },
      "vepres": {
        type: "vepres",
        titre: "Vêpres du vendredi",
        description: "Prière du soir",
        contenu: {
          introduction: "Dieu, viens à mon aide ! Seigneur, à notre secours !",
          hymne: {
            titre: "Hymne du soir",
            texte: "Que le soir approche et que le jour s'en aille, Tu es toujours le même, Tu es l'éternité."
          },
          antiennes: [
            "Le Seigneur est ma lumière et mon salut.",
            "Le Seigneur est la force de ma vie."
          ],
          psaumes: [
            {
              numero: "141",
              titre: "Tu es mon refuge",
              texte: "À pleine voix, je crie vers le Seigneur ! À pleine voix, je supplie le Seigneur !",
              antienne: "Tu es mon refuge, Seigneur, ma part dans la terre des vivants."
            },
            {
              numero: "142",
              titre: "Tu es juste, Seigneur",
              texte: "Seigneur, entends ma prière ; dans ta justice écoute mes appels.",
              antienne: "Au matin, que j'entende ton amour."
            }
          ],
          lecture: {
            reference: "1 P 2, 21-25",
            titre: "Lecture de la première lettre de saint Pierre Apôtre",
            texte: "C'est pour nous que le Christ a souffert ; il nous a marqué le chemin pour que nous allions sur ses traces. Il n'a pas commis le péché ; dans sa bouche, on n'a pas trouvé de mensonge. Insulté, il ne rendait pas l'insulte, dans la souffrance, il ne menaçait pas, mais il s'en remettait à Celui qui juge avec justice."
          },
          repons: {
            verset: "Le Christ nous a aimés, il nous a délivrés de nos péchés par son sang.",
            repons: "Il a fait de nous un royaume et des prêtres pour son Dieu et Père."
          },
          cantique: {
            reference: "Cantique de Marie",
            titre: "Magnificat",
            texte: "Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur !",
            antienne: "Le Puissant fit pour moi des merveilles : Saint est son nom !"
          },
          intercessions: [
            {
              intention: "Pour ceux qui te cherchent sans te connaître",
              repons: "Seigneur, nous te prions."
            },
            {
              intention: "Pour les défunts qui nous ont précédés",
              repons: "Seigneur, nous te prions."
            }
          ],
          oraison: "Seigneur, nous te prions : que descende sur nous la grâce de l'Esprit Saint ; qu'elle nous rende toujours plus attentifs à ta parole, pour que nous puissions contempler ta gloire. Par Jésus Christ, ton Fils, notre Seigneur et notre Dieu, qui règne avec toi et le Saint Esprit, maintenant et pour les siècles des siècles.",
          conclusion: "Que le Seigneur nous bénisse, qu'il nous garde de tout mal et nous conduise à la vie éternelle. Amen."
        }
      },
      "complies": {
        type: "complies",
        titre: "Complies",
        description: "Prière du soir avant le repos",
        contenu: {
          introduction: "Que le Seigneur tout-puissant nous accorde une nuit tranquille et une fin heureuse.",
          hymne: {
            titre: "Hymne de Complies",
            texte: "Avant la fin du jour, nous te prions, Créateur de l'univers, dans ta bienveillance, d'être notre gardien, notre protecteur."
          },
          antiennes: [
            "Dans ta main, Seigneur, je remets mon esprit."
          ],
          psaumes: [
            {
              numero: "91",
              titre: "Sous la protection divine",
              texte: "Quand je me tiens sous l'abri du Très-Haut et repose à l'ombre du Puissant, je dis au Seigneur : « Mon refuge, mon rempart, mon Dieu, dont je suis sûr ! »",
              antienne: "À l'ombre de tes ailes, Seigneur, protège-nous."
            }
          ],
          lecture: {
            reference: "1 Th 5, 23",
            titre: "Lecture de la première lettre de saint Paul Apôtre aux Thessaloniciens",
            texte: "Que le Dieu de la paix lui-même vous sanctifie tout entiers ; que votre esprit, votre âme et votre corps, soient tout entiers gardés sans reproche pour la venue de notre Seigneur Jésus Christ."
          },
          repons: {
            verset: "En tes mains, Seigneur, je remets mon esprit.",
            repons: "Sur ton serviteur, que s'illumine ta face."
          },
          cantique: {
            reference: "Cantique de Syméon",
            titre: "Nunc dimittis",
            texte: "Maintenant, ô Maître souverain, tu peux laisser ton serviteur s'en aller en paix, selon ta parole.",
            antienne: "Sauve-nous, Seigneur, quand nous veillons ; garde-nous quand nous dormons ; nous veillerons avec le Christ et nous reposerons en paix."
          },
          oraison: "Seigneur, tandis que nous dormirons en paix, fais germer et grandir jusqu'à la moisson la semence du Royaume que nous avons accueillie en ce jour. Par Jésus Christ, ton Fils, notre Seigneur et notre Dieu, qui règne avec toi et le Saint Esprit, maintenant et pour les siècles des siècles.",
          conclusion: "Que le Seigneur tout-puissant nous accorde une nuit tranquille et une mort heureuse. Amen."
        }
      }
    }
  }
};
