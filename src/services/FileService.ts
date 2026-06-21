import fs from 'fs/promises';
import path from 'path';

export class FileService<T> {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async readJson(): Promise<T[]> {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(fileContent) as T[];
    } catch (error: unknown) {
      // Jika file belum ada, aplikasi membuat file kosong.
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.writeJson([]);
        return [];
      }
      throw new Error(`Gagal membaca file ${this.filePath}.`);
    }
  }

  async writeJson(data: T[]): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      throw new Error(`Gagal menulis file ${this.filePath}.`);
    }
  }
}
