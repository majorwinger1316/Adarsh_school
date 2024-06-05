import { invoke } from "@tauri-apps/api/tauri";

export interface QueryResult {
  rowsAffected: number;
  lastInsertId: number;
}

export default class Database {
  path: string;
  constructor(path: string) {
    this.path = path;
  }

  static async load(path: string): Promise<Database> {
    const _path = await invoke<string>("plugin:sql|load", { db: path });
    return new Database(_path);
  }

  static get(path: string): Database {
    return new Database(path);
  }

  async execute(query: string, bindValues?: unknown[]): Promise<QueryResult> {
    const [rowsAffected, lastInsertId] = await invoke<[number, number]>("plugin:sql|execute", {
      db: this.path,
      query,
      values: bindValues ?? [],
    });
    return { lastInsertId, rowsAffected };
  }

  async select<T>(query: string, bindValues?: unknown[]): Promise<T> {
    const result = await invoke<T>("plugin:sql|select", {
      db: this.path,
      query,
      values: bindValues ?? [],
    });
    return result;
  }

  async close(db?: string): Promise<boolean> {
    const success = await invoke<boolean>("plugin:sql|close", { db });
    return success;
  }
}
