import path from 'path';
import { Student, StudentRecord } from '../models/Student';
import { StudentLinkedList } from '../models/StudentLinkedList';
import { FileService } from './FileService';
import { ValidationService } from './ValidationService';
import { linearSearchByName, sequentialSearchByNim, binarySearchByNim } from '../algorithms/searching';
import { bubbleSort, insertionSort, mergeSort, selectionSort, shellSort, SortKey } from '../algorithms/sorting';

export type SearchMethod = 'linear' | 'sequential' | 'binary';
export type SortMethod = 'none' | 'bubble' | 'selection' | 'insertion' | 'merge' | 'shell';

export class StudentRepository {
  private readonly fileService: FileService<StudentRecord>;

  constructor() {
    const studentsFilePath = path.join(process.cwd(), 'data', 'students.json');
    this.fileService = new FileService<StudentRecord>(studentsFilePath);
  }

  async getAll(): Promise<StudentRecord[]> {
    return this.fileService.readJson();
  }

  async getAsLinkedList(): Promise<StudentRecord[]> {
    const students = await this.getAll();
    const linkedList = new StudentLinkedList();

    students.forEach((student) => linkedList.append(student));
    return linkedList.toArray();
  }

  async create(payload: Omit<StudentRecord, 'id'>): Promise<StudentRecord> {
    const students = await this.getAll();
    const newStudent: StudentRecord = {
      id: `std-${Date.now()}`,
      nim: payload.nim.trim(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      major: payload.major.trim(),
      semester: Number(payload.semester)
    };

    ValidationService.validateStudentPayload(newStudent);

    const studentAlreadyExists = students.some((student) => student.nim === newStudent.nim || student.email === newStudent.email);
    if (studentAlreadyExists) {
      throw new Error('NIM atau email sudah terdaftar.');
    }

    const studentObject = new Student(newStudent); // Object dari class Student.
    const savedStudent = studentObject.toRecord();

    students.push(savedStudent); // Array dipakai sebagai struktur data utama penyimpanan sementara.
    await this.fileService.writeJson(students);
    return savedStudent;
  }

  async update(nim: string, payload: Omit<StudentRecord, 'id' | 'nim'>): Promise<StudentRecord> {
    const students = await this.getAll();
    const studentIndex = students.findIndex((student) => student.nim === nim);

    if (studentIndex === -1) {
      throw new Error('Mahasiswa tidak ditemukan.');
    }

    const updatedStudent: StudentRecord = {
      ...students[studentIndex],
      name: payload.name.trim(),
      email: payload.email.trim(),
      major: payload.major.trim(),
      semester: Number(payload.semester)
    };

    ValidationService.validateStudentPayload(updatedStudent);

    const duplicateEmail = students.some((student) => student.email === updatedStudent.email && student.nim !== nim);
    if (duplicateEmail) {
      throw new Error('Email sudah dipakai mahasiswa lain.');
    }

    const studentObject = new Student(updatedStudent);
    students[studentIndex] = studentObject.toRecord();
    await this.fileService.writeJson(students);

    return students[studentIndex];
  }

  async delete(nim: string): Promise<void> {
    const students = await this.getAll();
    const remainingStudents = students.filter((student) => student.nim !== nim);

    if (remainingStudents.length === students.length) {
      throw new Error('Mahasiswa tidak ditemukan.');
    }

    await this.fileService.writeJson(remainingStudents);
  }

  async search(keyword: string, method: SearchMethod): Promise<StudentRecord[]> {
    const students = await this.getAll();
    const cleanedKeyword = keyword.trim();

    if (!cleanedKeyword) {
      return students;
    }

    if (method === 'linear') {
      return linearSearchByName(students, cleanedKeyword);
    }

    if (method === 'sequential') {
      const foundStudent = sequentialSearchByNim(students, cleanedKeyword);
      return foundStudent ? [foundStudent] : [];
    }

    const sortedByNim = mergeSort(students, 'nim');
    const foundStudent = binarySearchByNim(sortedByNim, cleanedKeyword);
    return foundStudent ? [foundStudent] : [];
  }

  sort(students: StudentRecord[], method: SortMethod, key: SortKey): StudentRecord[] {
    switch (method) {
      case 'bubble':
        return bubbleSort(students, key);
      case 'selection':
        return selectionSort(students, key);
      case 'insertion':
        return insertionSort(students, key);
      case 'merge':
        return mergeSort(students, key);
      case 'shell':
        return shellSort(students, key);
      default:
        return students;
    }
  }

  async importStudents(studentsToImport: StudentRecord[]): Promise<StudentRecord[]> {
    const normalizedStudents = studentsToImport.map((student, index) => ({
      id: student.id || `std-import-${Date.now()}-${index}`,
      nim: String(student.nim).trim(),
      name: String(student.name).trim(),
      email: String(student.email).trim(),
      major: String(student.major).trim(),
      semester: Number(student.semester)
    }));

    normalizedStudents.forEach((student) => ValidationService.validateStudentPayload(student));

    const uniqueNims = new Set(normalizedStudents.map((student) => student.nim));
    const uniqueEmails = new Set(normalizedStudents.map((student) => student.email));

    if (uniqueNims.size !== normalizedStudents.length || uniqueEmails.size !== normalizedStudents.length) {
      throw new Error('Data import memiliki NIM/email yang duplikat.');
    }

    await this.fileService.writeJson(normalizedStudents);
    return normalizedStudents;
  }
}
