interface AnkiNote {
    id: number;
    flds: string;
    tags: string;
    mid: number;
  }
  
  interface MediaMap {
    [key: string]: string;
  }
  
  interface SQLiteDatabase {
    all<T = AnkiNote>(sql: string): Promise<T[]>;
    close(): Promise<void>;
  }
  
  declare module 'sqlite' {
    export function open(config: {
      filename: string;
      driver: typeof import('sqlite3').Database;
    }): Promise<SQLiteDatabase>;
  }
  
  declare module 'adm-zip' {
    class AdmZip {
      constructor(filePath: string);
      extractAllTo(path: string, overwrite: boolean): void;
    }
    export = AdmZip;
  }