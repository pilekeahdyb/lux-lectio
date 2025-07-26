import express from 'express';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import sqlite3 from 'sqlite3';
import cron from 'node-cron';

const app = express();
const PORT = 4000;
const DB_PATH = './offices.sqlite';

// --- SQLite DB INIT ---
const db = new sqlite3.Database(DB_PATH);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS offices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    office TEXT NOT NULL,
    data TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS metadata (
    date TEXT PRIMARY KEY,
    temps_liturgique TEXT,
    semaine_psautier INTEGER,
    couleur TEXT,
    celebration TEXT
  )`);
});

// --- HELPERS ---
function getSemainePsautier(dateStr) {
  // Semaine I commence au 1er dimanche de l'Avent précédent
  const debutAvent = dayjs(dateStr).startOf('year').subtract(1, 'month').date(30); // approximation
  const diff = dayjs(dateStr).diff(debutAvent, 'week');
  return (diff % 4) + 1;
}

function getCouleurLiturgique(temps) {
  if (/avent|careme/i.test(temps)) return 'violet';
  if (/no[eë]l|paques|epiphanie|ascension|trinite|toussaint/i.test(temps)) return 'blanc';
  if (/pentecote|martyr|esprit|ap[ôo]tres|confirmation|sacrement/i.test(temps)) return 'rouge';
  return 'vert';
}

// --- API ROUTES ---
app.get('/api/offices', (req, res) => {
  db.all('SELECT DISTINCT office FROM offices', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.office));
  });
});

app.get('/api/offices/:date', (req, res) => {
  const { date } = req.params;
  db.all('SELECT office, data FROM offices WHERE date = ?', [date], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const offices = {};
    rows.forEach(r => { offices[r.office] = JSON.parse(r.data); });
    db.get('SELECT * FROM metadata WHERE date = ?', [date], (err2, meta) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ date, ...meta, offices });
    });
  });
});

app.get('/api/offices/:date/:office', (req, res) => {
  const { date, office } = req.params;
  db.get('SELECT data FROM offices WHERE date = ? AND office = ?', [date, office], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    db.get('SELECT * FROM metadata WHERE date = ?', [date], (err2, meta) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ date, ...meta, office: office, ...JSON.parse(row.data) });
    });
  });
});

app.get('/api/metadata/:date', (req, res) => {
  const { date } = req.params;
  db.get('SELECT * FROM metadata WHERE date = ?', [date], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// --- EXEMPLE D'INSERTION (à remplacer par une vraie génération/cron) ---
function insertExampleVepres() {
  const date = '2025-06-10';
  const office = 'vepres';
  const temps_liturgique = 'Temps ordinaire';
  const semaine_psautier = 2;
  const couleur = 'vert';
  const celebration = JSON.stringify({ nom: 'Saint Barnabé', rang: 'mémoire', couleur });
  const data = JSON.stringify({
    type: 'vepres',
    titre: 'Vêpres',
    description: 'Prière du soir',
    contenu: {
      introduction: { texte: 'Dieu, viens à mon aide ; Seigneur, à notre secours.' },
      hymne: { titre: 'Hymne du soir', texte: 'Splendeur de la création...' },
      psaumes: [
        { titre: 'Psaume 1', texte: 'Heureux l’homme qui se plaît dans la loi du Seigneur...' },
        { titre: 'Psaume 2', texte: 'Pourquoi ce tumulte des nations...' }
      ],
      lecture: { reference: 'Rm 8, 28-30', texte: 'Lecture pour les vêpres du 10 juin 2025...' },
      repons: { texte: 'R/ Gloire à toi, Seigneur.' },
      cantique: { titre: 'Cantique de Marie', texte: 'Mon âme exalte le Seigneur...' },
      intercessions: [
        { intention: 'Pour l’Église, lumière des nations', repons: 'R/ Seigneur, exauce-nous.' }
      ],
      oraison: 'Dieu éternel, tu as donné à ton Église...' 
    }
  });
  db.run('INSERT OR REPLACE INTO offices (date, office, data) VALUES (?, ?, ?)', [date, office, data]);
  db.run('INSERT OR REPLACE INTO metadata (date, temps_liturgique, semaine_psautier, couleur, celebration) VALUES (?, ?, ?, ?, ?)', [date, temps_liturgique, semaine_psautier, couleur, celebration]);
}

insertExampleVepres();

// --- CRON pour MAJ quotidienne (exemple) ---
cron.schedule('0 2 * * *', () => {
  // Ici, on pourrait générer les offices du jour et les insérer
  // Ex: fetch depuis AELF, ou génération locale
  console.log('Cron: mise à jour des offices du jour');
});

app.listen(PORT, () => {
  console.log(`Lux Lectio API running on http://localhost:${PORT}`);
});
