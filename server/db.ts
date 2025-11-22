import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use better-sqlite3 for local development
const dbPath = join(__dirname, '..', 'local.db');
const sqlite = new Database(dbPath);

// Enable foreign key constraints (disabled by default in SQLite)
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
export const sqliteDb = sqlite;
