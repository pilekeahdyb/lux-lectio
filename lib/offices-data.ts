// Base de données locale des offices liturgiques
// Structure complète selon la Liturgie des Heures officielle

export interface OfficeData {
  nom: string;
  office: {
    invitatoire?: {
      type: string;
      titre: string;
      contenu: string;
    };
    introduction?: {
      type: string;
      titre: string;
      contenu: string;
    };
    hymne?: {
      type: string;
      titre: string;
      contenu: string;
    };
    examen?: {
      type: string;
      titre: string;
      contenu: string;
    };
    psaume_invitatoire?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    psaume_1?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    psaume_2?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    psaume_3?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    cantique_ancien?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    cantique_nouveau?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    cantique_zacharie?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    cantique_marie?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    cantique_simeon?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    lecture_breve?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
    };
    lecture_1?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
    };
    lecture_2?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
    };
    verset?: {
      type: string;
      titre: string;
      contenu: string;
    };
    repons_bref?: {
      type: string;
      titre: string;
      contenu: string;
    };
    repons_1?: {
      type: string;
      titre: string;
      contenu: string;
    };
    repons_2?: {
      type: string;
      titre: string;
      contenu: string;
    };
    intercessions?: {
      type: string;
      titre: string;
      contenu: string;
    };
    notre_pere?: {
      type: string;
      titre: string;
      contenu: string;
    };
    te_deum?: {
      type: string;
      titre: string;
      contenu: string;
    };
    antienne_mariale?: {
      type: string;
      titre: string;
      contenu: string;
    };
    benediction?: {
      type: string;
      titre: string;
      contenu: string;
    };
    conclusion?: {
      type: string;
      titre: string;
      contenu: string;
    };
    // Anciens champs pour compatibilité
    lectures?: Array<{
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    }>;
    psaumes?: Array<{
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    }>;
    cantique?: {
      type: string;
      titre: string;
      contenu: string;
      ref?: string;
      antienne?: string;
    };
    repons?: {
      type: string;
      titre: string;
      contenu: string;
    };
    intercession?: {
      type: string;
      titre: string;
      contenu: string;
    };
  };
}

export const officesDatabase: Record<string, OfficeData> = {
  laudes: {
    nom: "Laudes",
    office: {
      introduction: {
        type: "introduction",
        titre: "Formule d'introduction",
        contenu: "Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen."
      },
      hymne: {
        type: "hymne",
        titre: "Hymne",
        contenu: "Hymne des Laudes - Texte à récupérer depuis l'API AELF"
      },
      psaume_1: {
        type: "psaume",
        titre: "Psaume du matin",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du psaume à récupérer depuis l'API AELF"
      },
      cantique_ancien: {
        type: "cantique",
        titre: "Cantique de l'Ancien Testament",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du cantique à récupérer depuis l'API AELF"
      },
      psaume_2: {
        type: "psaume",
        titre: "Psaume de louange",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du psaume à récupérer depuis l'API AELF"
      },
      lecture_breve: {
        type: "lecture",
        titre: "Lecture brève",
        ref: "À récupérer depuis l'API",
        contenu: "Contenu de la lecture à récupérer depuis l'API AELF"
      },
      repons_bref: {
        type: "repons",
        titre: "Répons bref",
        contenu: "Contenu du répons à récupérer depuis l'API AELF"
      },
      cantique_zacharie: {
        type: "cantique",
        titre: "Cantique de Zacharie (Benedictus)",
        ref: "Lc 1, 68-79",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple..."
      },
      intercessions: {
        type: "intercession",
        titre: "Intercessions",
        contenu: "Contenu des intercessions à récupérer depuis l'API AELF"
      },
      notre_pere: {
        type: "priere",
        titre: "Notre Père",
        contenu: "Notre Père qui es aux cieux, que ton nom soit sanctifié..."
      },
      conclusion: {
        type: "conclusion",
        titre: "Oraison",
        contenu: "Oraison à récupérer depuis l'API AELF"
      }
    }
  },
  vepres: {
    nom: "Vêpres",
    office: {
      introduction: {
        type: "introduction",
        titre: "Formule d'introduction",
        contenu: "Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen."
      },
      hymne: {
        type: "hymne",
        titre: "Hymne",
        contenu: "Hymne des Vêpres - Texte à récupérer depuis l'API AELF"
      },
      psaume_1: {
        type: "psaume",
        titre: "Premier psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du premier psaume à récupérer depuis l'API AELF"
      },
      psaume_2: {
        type: "psaume",
        titre: "Deuxième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du deuxième psaume à récupérer depuis l'API AELF"
      },
      cantique_nouveau: {
        type: "cantique",
        titre: "Cantique du Nouveau Testament",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du cantique à récupérer depuis l'API AELF"
      },
      lecture_breve: {
        type: "lecture",
        titre: "Lecture brève",
        ref: "À récupérer depuis l'API",
        contenu: "Contenu de la lecture à récupérer depuis l'API AELF"
      },
      repons_bref: {
        type: "repons",
        titre: "Répons bref",
        contenu: "Contenu du répons à récupérer depuis l'API AELF"
      },
      cantique_marie: {
        type: "cantique",
        titre: "Cantique de Marie (Magnificat)",
        ref: "Lc 1, 46-55",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur..."
      },
      intercessions: {
        type: "intercession",
        titre: "Intercessions",
        contenu: "Contenu des intercessions à récupérer depuis l'API AELF"
      },
      notre_pere: {
        type: "priere",
        titre: "Notre Père",
        contenu: "Notre Père qui es aux cieux, que ton nom soit sanctifié..."
      },
      conclusion: {
        type: "conclusion",
        titre: "Oraison",
        contenu: "Oraison à récupérer depuis l'API AELF"
      }
    }
  },
  complies: {
    nom: "Complies",
    office: {
      introduction: {
        type: "introduction",
        titre: "Formule d'introduction",
        contenu: "Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen."
      },
      examen: {
        type: "examen",
        titre: "Examen de conscience",
        contenu: "Examen de conscience à récupérer depuis l'API AELF"
      },
      hymne: {
        type: "hymne",
        titre: "Hymne",
        contenu: "Hymne des Complies - Texte à récupérer depuis l'API AELF"
      },
      psaume_1: {
        type: "psaume",
        titre: "Psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du psaume à récupérer depuis l'API AELF"
      },
      lecture_breve: {
        type: "lecture",
        titre: "Lecture brève",
        ref: "À récupérer depuis l'API",
        contenu: "Contenu de la lecture à récupérer depuis l'API AELF"
      },
      cantique_simeon: {
        type: "cantique",
        titre: "Cantique de Siméon (Nunc Dimittis)",
        ref: "Lc 2, 29-32",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Maintenant, ô Maître, tu peux laisser ton serviteur s'en aller dans la paix..."
      },
      conclusion: {
        type: "conclusion",
        titre: "Oraison",
        contenu: "Oraison à récupérer depuis l'API AELF"
      },
      antienne_mariale: {
        type: "antienne",
        titre: "Antienne mariale",
        contenu: "Antienne mariale à récupérer depuis l'API AELF"
      },
      benediction: {
        type: "benediction",
        titre: "Bénédiction finale",
        contenu: "Bénédiction finale à récupérer depuis l'API AELF"
      }
    }
  },
  tierce: {
    nom: "Tierce",
    office: {
      introduction: {
        type: "introduction",
        titre: "Formule d'introduction",
        contenu: "Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen."
      },
      hymne: {
        type: "hymne",
        titre: "Hymne",
        contenu: "Hymne de Tierce - Texte à récupérer depuis l'API AELF"
      },
      psaume_1: {
        type: "psaume",
        titre: "Premier psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du premier psaume à récupérer depuis l'API AELF"
      },
      psaume_2: {
        type: "psaume",
        titre: "Deuxième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du deuxième psaume à récupérer depuis l'API AELF"
      },
      psaume_3: {
        type: "psaume",
        titre: "Troisième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du troisième psaume à récupérer depuis l'API AELF"
      },
      lecture_breve: {
        type: "lecture",
        titre: "Lecture brève",
        ref: "À récupérer depuis l'API",
        contenu: "Contenu de la lecture à récupérer depuis l'API AELF"
      },
      verset: {
        type: "verset",
        titre: "Verset",
        contenu: "Contenu du verset à récupérer depuis l'API AELF"
      },
      conclusion: {
        type: "conclusion",
        titre: "Oraison",
        contenu: "Oraison à récupérer depuis l'API AELF"
      }
    }
  },
  sexte: {
    nom: "Sexte",
    office: {
      introduction: {
        type: "introduction",
        titre: "Formule d'introduction",
        contenu: "Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen."
      },
      hymne: {
        type: "hymne",
        titre: "Hymne",
        contenu: "Hymne de Sexte - Texte à récupérer depuis l'API AELF"
      },
      psaume_1: {
        type: "psaume",
        titre: "Premier psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du premier psaume à récupérer depuis l'API AELF"
      },
      psaume_2: {
        type: "psaume",
        titre: "Deuxième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du deuxième psaume à récupérer depuis l'API AELF"
      },
      psaume_3: {
        type: "psaume",
        titre: "Troisième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du troisième psaume à récupérer depuis l'API AELF"
      },
      lecture_breve: {
        type: "lecture",
        titre: "Lecture brève",
        ref: "À récupérer depuis l'API",
        contenu: "Contenu de la lecture à récupérer depuis l'API AELF"
      },
      verset: {
        type: "verset",
        titre: "Verset",
        contenu: "Contenu du verset à récupérer depuis l'API AELF"
      },
      conclusion: {
        type: "conclusion",
        titre: "Oraison",
        contenu: "Oraison à récupérer depuis l'API AELF"
      }
    }
  },
  none: {
    nom: "None",
    office: {
      introduction: {
        type: "introduction",
        titre: "Formule d'introduction",
        contenu: "Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen."
      },
      hymne: {
        type: "hymne",
        titre: "Hymne",
        contenu: "Hymne de None - Texte à récupérer depuis l'API AELF"
      },
      psaume_1: {
        type: "psaume",
        titre: "Premier psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du premier psaume à récupérer depuis l'API AELF"
      },
      psaume_2: {
        type: "psaume",
        titre: "Deuxième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du deuxième psaume à récupérer depuis l'API AELF"
      },
      psaume_3: {
        type: "psaume",
        titre: "Troisième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du troisième psaume à récupérer depuis l'API AELF"
      },
      lecture_breve: {
        type: "lecture",
        titre: "Lecture brève",
        ref: "À récupérer depuis l'API",
        contenu: "Contenu de la lecture à récupérer depuis l'API AELF"
      },
      verset: {
        type: "verset",
        titre: "Verset",
        contenu: "Contenu du verset à récupérer depuis l'API AELF"
      },
      conclusion: {
        type: "conclusion",
        titre: "Oraison",
        contenu: "Oraison à récupérer depuis l'API AELF"
      }
    }
  },
  office_lectures: {
    nom: "Office des lectures",
    office: {
      invitatoire: {
        type: "invitatoire",
        titre: "Invitatoire",
        contenu: "Invitatoire à récupérer depuis l'API AELF"
      },
      introduction: {
        type: "introduction",
        titre: "Formule d'introduction",
        contenu: "Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen."
      },
      hymne: {
        type: "hymne",
        titre: "Hymne",
        contenu: "Hymne de l'Office des lectures - Texte à récupérer depuis l'API AELF"
      },
      psaume_1: {
        type: "psaume",
        titre: "Premier psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du premier psaume à récupérer depuis l'API AELF"
      },
      psaume_2: {
        type: "psaume",
        titre: "Deuxième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du deuxième psaume à récupérer depuis l'API AELF"
      },
      psaume_3: {
        type: "psaume",
        titre: "Troisième psaume",
        ref: "À récupérer depuis l'API",
        antienne: "Antienne à récupérer depuis l'API",
        contenu: "Contenu du troisième psaume à récupérer depuis l'API AELF"
      },
      verset: {
        type: "verset",
        titre: "Verset",
        contenu: "Contenu du verset à récupérer depuis l'API AELF"
      },
      lecture_1: {
        type: "lecture",
        titre: "Première lecture (biblique)",
        ref: "À récupérer depuis l'API",
        contenu: "Contenu de la première lecture à récupérer depuis l'API AELF"
      },
      repons_1: {
        type: "repons",
        titre: "Premier répons",
        contenu: "Contenu du premier répons à récupérer depuis l'API AELF"
      },
      lecture_2: {
        type: "lecture",
        titre: "Seconde lecture (patristique ou hagiographique)",
        ref: "À récupérer depuis l'API",
        contenu: "Contenu de la seconde lecture à récupérer depuis l'API AELF"
      },
      repons_2: {
        type: "repons",
        titre: "Second répons",
        contenu: "Contenu du second répons à récupérer depuis l'API AELF"
      },
      te_deum: {
        type: "hymne",
        titre: "Te Deum",
        contenu: "Te Deum à récupérer depuis l'API AELF"
      },
      conclusion: {
        type: "conclusion",
        titre: "Oraison",
        contenu: "Oraison à récupérer depuis l'API AELF"
      }
    }
  }
};

export function getOfficeData(office: string, date: string): OfficeData | null {
  const officeKey = office.toLowerCase();
  const baseOffice = officesDatabase[officeKey];
  
  if (!baseOffice) {
    return null;
  }

  // Retourner une copie pour éviter les mutations
  return JSON.parse(JSON.stringify(baseOffice));
}
