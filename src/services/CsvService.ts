import { StudentRecord } from '../models/Student';

export class CsvService {
  static toCsv(students: StudentRecord[]): string {
    const header = ['id', 'nim', 'name', 'email', 'major', 'semester'];
    const rows = students.map((student) => [
      student.id,
      student.nim,
      student.name,
      student.email,
      student.major,
      String(student.semester)
    ]);

    return [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  static fromCsv(csvText: string): StudentRecord[] {
    const lines = csvText.trim().split(/\r?\n/);
    const [headerLine, ...dataLines] = lines;

    if (!headerLine) {
      return [];
    }

    const headers = this.parseLine(headerLine);
    return dataLines.map((line) => {
      const values = this.parseLine(line);
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));

      return {
        id: row.id || `std-${Date.now()}`,
        nim: row.nim,
        name: row.name,
        email: row.email,
        major: row.major,
        semester: Number(row.semester)
      };
    });
  }

  private static parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let insideQuote = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const nextChar = line[index + 1];

      if (char === '"' && insideQuote && nextChar === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }
}
