import { Office } from '@/lib/types/liturgical-types';

interface OfficeDisplayProps {
  office: Office;
}

export function OfficeDisplay({ office }: OfficeDisplayProps) {
  // Si le contenu est un tableau de sections (scraping AELF)
  if (Array.isArray(office.content)) {
    return (
      <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <header className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{office.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{office.description}</p>
        </header>
        {office.content.map((section: any, idx: number) => (
          <section key={idx} className="space-y-2">
            {section.titre && <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{section.titre}</h3>}
            {section.contenu && <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{section.contenu}</pre>}
          </section>
        ))}
      </div>
    );
  }

  // Sinon, fallback sur l’affichage typé classique
  const c = office.content;
  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <header className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{office.name}</h2>
        <p className="text-gray-600 dark:text-gray-400">{office.description}</p>
      </header>

      {/* Introduction */}
      {c.introduction && (
        <section className="text-center italic text-gray-700 dark:text-gray-300">
          <div>{c.introduction.verset}</div>
          <div>{c.introduction.repons}</div>
        </section>
      )}

      {/* Invitatoire */}
      {c.invitatoire && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Antienne invitatoire</h3>
          <p className="italic text-gray-700 dark:text-gray-300">{c.invitatoire.antienne}</p>
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mt-2">Psaume invitatoire : ({c.invitatoire.psaume.numero})</h4>
          {c.invitatoire.psaume.versets.map((v, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300">{v.numero} {v.texte}</p>
          ))}
        </section>
      )}

      {/* Hymne */}
      {c.hymne && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Hymne : {c.hymne.titre}</h3>
          {c.hymne.auteur && <p className="text-gray-500 text-sm">{c.hymne.auteur}</p>}
          {c.hymne.texte.map((strophe, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{strophe}</p>
          ))}
          {c.hymne.refrain && <p className="italic text-gray-700 dark:text-gray-300">R/ {c.hymne.refrain}</p>}
        </section>
      )}

      {/* Psaumes et cantiques */}
      {Array.isArray(c.psaumes) && c.psaumes.length > 0 && (
        <section className="space-y-4">
          {c.psaumes.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {item.antienne && <p className="italic text-gray-700 dark:text-gray-300">Antienne : {item.antienne}</p>}
              {item.psaume && (
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Psaume : {item.psaume.numero}</h4>
                  {item.psaume.versets.map((v, i) => (
                    <p key={i} className="text-gray-700 dark:text-gray-300">{v.numero} {v.texte}</p>
                  ))}
                </div>
              )}
              {item.cantique && (
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{item.cantique.titre} ({item.cantique.reference})</h4>
                  {item.cantique.versets.map((v, i) => (
                    <p key={i} className="text-gray-700 dark:text-gray-300">{v.numero} {v.texte}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Cantique de Zacharie */}
      {c.cantique_zacharie && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Cantique de Zacharie (Lc 1, 68-79)</h3>
          <p className="italic text-gray-700 dark:text-gray-300">Antienne : {c.cantique_zacharie.antienne}</p>
          {c.cantique_zacharie.cantique.versets.map((v, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300">{v.numero} {v.texte}</p>
          ))}
        </section>
      )}

      {/* Lecture */}
      {c.lecture && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Lecture</h3>
          <p className="text-gray-600 dark:text-gray-400">{c.lecture.reference}</p>
          <p className="text-gray-700 dark:text-gray-300">{c.lecture.texte}</p>
        </section>
      )}

      {/* Répons */}
      {c.repons && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Répons</h3>
          <p className="text-gray-700 dark:text-gray-300">R/ {c.repons.repons}</p>
          {c.repons.versets && c.repons.versets.map((v, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300">V/ {v} R/</p>
          ))}
        </section>
      )}

      {/* Intercessions */}
      {c.intercessions && c.intercessions.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Intercessions</h3>
          {c.intercessions.map((inter, i) => (
            <div key={i} className="space-y-1">
              <p className="text-gray-700 dark:text-gray-300">V/ {inter.intention}</p>
              <p className="text-gray-700 dark:text-gray-300 italic">R/ {inter.repons}</p>
            </div>
          ))}
        </section>
      )}

      {/* Notre Père */}
      {c.notre_pere && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Notre Père</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{c.notre_pere}</p>
        </section>
      )}

      {/* Oraison */}
      {c.oraison && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Oraison</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{c.oraison}</p>
        </section>
      )}
    </div>
  );
}
