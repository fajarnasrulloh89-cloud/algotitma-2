import { Person } from './Person';

export interface StudentRecord {
  id: string;
  nim: string;
  name: string;
  email: string;
  major: string;
  semester: number;
}

// Student mewarisi Person. Ini contoh inheritance.
export class Student extends Person {
  private nim: string;
  private major: string;
  private semester: number;

  constructor(record: StudentRecord) {
    super(record.id, record.name, record.email);
    this.nim = record.nim;
    this.major = record.major;
    this.semester = record.semester;
  }

  getNim(): string {
    return this.nim;
  }

  setNim(newNim: string): void {
    this.nim = newNim;
  }

  getMajor(): string {
    return this.major;
  }

  setMajor(newMajor: string): void {
    this.major = newMajor;
  }

  getSemester(): number {
    return this.semester;
  }

  setSemester(newSemester: number): void {
    this.semester = newSemester;
  }

  // Polymorphism: implementasi getInfo milik Student berbeda dari class lain yang mungkin mewarisi Person.
  getInfo(): string {
    return `${this.getNim()} - ${this.getName()} (${this.getMajor()}, semester ${this.getSemester()})`;
  }

  toRecord(): StudentRecord {
    return {
      id: this.getId(),
      nim: this.nim,
      name: this.getName(),
      email: this.getEmail(),
      major: this.major,
      semester: this.semester
    };
  }
}
