import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("triviapop.db");

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS saved_facts (
      id INTEGER PRIMARY KEY NOT NULL,
      fact TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `);
};

export const saveFactToDB = (factObj) => {
  db.runSync(
    `INSERT OR IGNORE INTO saved_facts (id, fact, description)
     VALUES (?, ?, ?)`,
    [factObj.id, factObj.fact, factObj.description]
  );
};

export const removeFactFromDB = (id) => {
  db.runSync(`DELETE FROM saved_facts WHERE id = ?`, [id]);
};

export const getSavedFacts = () => {
  return db.getAllSync(`SELECT * FROM saved_facts`);
};