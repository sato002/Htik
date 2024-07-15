
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'profiles.db');

export class DatabaseService {
    private static instance: DatabaseService;
    private db: Database.Database;

    private constructor() {
        this.db = new Database(dbPath);
        this.initialize();
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    private initialize() {
        if (!fs.existsSync(dbPath)) {
            this.db.exec(`
            CREATE TABLE IF NOT EXISTS profile (
              id STRING PRIMARY KEY,
              name TEXT NOT NULL,
              tds_username TEXT NOT NULL,
              tds_password TEXT NOT NULL,
              tds_access_token TEXT,
              tds_total_coin INTEGER,
              tik_username TEXT NOT NULL,
              tik_password TEXT NOT NULL
            );
          `);
        }
    }

    public saveProfile(id: string) {
        const stmt = this.db.prepare('INSERT INTO profiles (id) VALUES (?)');
        const info = stmt.run(id);
    }

    public getProfiles(): any[] {
        const stmt = this.db.prepare('SELECT * FROM profiles');
        return stmt.all();
    }

    public close() {
        this.db.close();
    }

}