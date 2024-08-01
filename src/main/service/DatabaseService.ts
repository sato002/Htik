import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { Profile } from '../model/Profile';
const filePath = './htik.db';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database.Database | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public initialize() {
    try {
      if (!this.db) {
        this.db = new Database(filePath, { verbose: console.log });
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guidId TEXT,
            tdsUsername TEXT,
            tdsPassword TEXT,
            tdsToken TEXT,
            tdsTotalCoin INTEGER DEFAULT 0,
            tdsTotalCoinJustEarned INTEGER DEFAULT 0,
            tdsCoinJustEarned INTEGER DEFAULT 0,
            tikUsername TEXT,
            tikPassword TEXT
          );
        `);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private ensureInitialized() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
  }
 
  public getUserById(userId: number) {
    this.ensureInitialized();
    const stmt = this.db!.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(userId);
  }

  public getAllProfiles() : Profile[] {
    this.ensureInitialized();
    const stmt = this.db!.prepare('SELECT * FROM profiles');
    const rows = stmt.all() as Profile[];
    return rows;
  }

  public createProfile(profile: Profile) {
    this.ensureInitialized();
    const stmt = this.db!.prepare(`INSERT INTO profiles (
      guidId, 
      tdsUsername, 
      tdsPassword,
      tdsToken,
      tikUsername,
      tikPassword
      ) VALUES (?,?,?,?,?,?)`);
    const result = stmt.run(profile.guidId, profile.tdsUsername, profile.tdsPassword, profile.tdsToken, profile.tikUsername, profile.tikPassword);
    return result.lastInsertRowid;
  }

  public close() {
    if (this.db) {
      this.db.close();
    }
  }
}