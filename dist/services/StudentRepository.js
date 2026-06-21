"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
const path_1 = __importDefault(require("path"));
const Student_1 = require("../models/Student");
const StudentLinkedList_1 = require("../models/StudentLinkedList");
const FileService_1 = require("./FileService");
const ValidationService_1 = require("./ValidationService");
const searching_1 = require("../algorithms/searching");
const sorting_1 = require("../algorithms/sorting");
class StudentRepository {
    constructor() {
        const studentsFilePath = path_1.default.join(process.cwd(), 'data', 'students.json');
        this.fileService = new FileService_1.FileService(studentsFilePath);
    }
    async getAll() {
        return this.fileService.readJson();
    }
    async getAsLinkedList() {
        const students = await this.getAll();
        const linkedList = new StudentLinkedList_1.StudentLinkedList();
        students.forEach((student) => linkedList.append(student));
        return linkedList.toArray();
    }
    async create(payload) {
        const students = await this.getAll();
        const newStudent = {
            id: `std-${Date.now()}`,
            nim: payload.nim.trim(),
            name: payload.name.trim(),
            email: payload.email.trim(),
            major: payload.major.trim(),
            semester: Number(payload.semester)
        };
        ValidationService_1.ValidationService.validateStudentPayload(newStudent);
        const studentAlreadyExists = students.some((student) => student.nim === newStudent.nim || student.email === newStudent.email);
        if (studentAlreadyExists) {
            throw new Error('NIM atau email sudah terdaftar.');
        }
        const studentObject = new Student_1.Student(newStudent); // Object dari class Student.
        const savedStudent = studentObject.toRecord();
        students.push(savedStudent); // Array dipakai sebagai struktur data utama penyimpanan sementara.
        await this.fileService.writeJson(students);
        return savedStudent;
    }
    async update(nim, payload) {
        const students = await this.getAll();
        const studentIndex = students.findIndex((student) => student.nim === nim);
        if (studentIndex === -1) {
            throw new Error('Mahasiswa tidak ditemukan.');
        }
        const updatedStudent = {
            ...students[studentIndex],
            name: payload.name.trim(),
            email: payload.email.trim(),
            major: payload.major.trim(),
            semester: Number(payload.semester)
        };
        ValidationService_1.ValidationService.validateStudentPayload(updatedStudent);
        const duplicateEmail = students.some((student) => student.email === updatedStudent.email && student.nim !== nim);
        if (duplicateEmail) {
            throw new Error('Email sudah dipakai mahasiswa lain.');
        }
        const studentObject = new Student_1.Student(updatedStudent);
        students[studentIndex] = studentObject.toRecord();
        await this.fileService.writeJson(students);
        return students[studentIndex];
    }
    async delete(nim) {
        const students = await this.getAll();
        const remainingStudents = students.filter((student) => student.nim !== nim);
        if (remainingStudents.length === students.length) {
            throw new Error('Mahasiswa tidak ditemukan.');
        }
        await this.fileService.writeJson(remainingStudents);
    }
    async search(keyword, method) {
        const students = await this.getAll();
        const cleanedKeyword = keyword.trim();
        if (!cleanedKeyword) {
            return students;
        }
        if (method === 'linear') {
            return (0, searching_1.linearSearchByName)(students, cleanedKeyword);
        }
        if (method === 'sequential') {
            const foundStudent = (0, searching_1.sequentialSearchByNim)(students, cleanedKeyword);
            return foundStudent ? [foundStudent] : [];
        }
        const sortedByNim = (0, sorting_1.mergeSort)(students, 'nim');
        const foundStudent = (0, searching_1.binarySearchByNim)(sortedByNim, cleanedKeyword);
        return foundStudent ? [foundStudent] : [];
    }
    sort(students, method, key) {
        switch (method) {
            case 'bubble':
                return (0, sorting_1.bubbleSort)(students, key);
            case 'selection':
                return (0, sorting_1.selectionSort)(students, key);
            case 'insertion':
                return (0, sorting_1.insertionSort)(students, key);
            case 'merge':
                return (0, sorting_1.mergeSort)(students, key);
            case 'shell':
                return (0, sorting_1.shellSort)(students, key);
            default:
                return students;
        }
    }
    async importStudents(studentsToImport) {
        const normalizedStudents = studentsToImport.map((student, index) => ({
            id: student.id || `std-import-${Date.now()}-${index}`,
            nim: String(student.nim).trim(),
            name: String(student.name).trim(),
            email: String(student.email).trim(),
            major: String(student.major).trim(),
            semester: Number(student.semester)
        }));
        normalizedStudents.forEach((student) => ValidationService_1.ValidationService.validateStudentPayload(student));
        const uniqueNims = new Set(normalizedStudents.map((student) => student.nim));
        const uniqueEmails = new Set(normalizedStudents.map((student) => student.email));
        if (uniqueNims.size !== normalizedStudents.length || uniqueEmails.size !== normalizedStudents.length) {
            throw new Error('Data import memiliki NIM/email yang duplikat.');
        }
        await this.fileService.writeJson(normalizedStudents);
        return normalizedStudents;
    }
}
exports.StudentRepository = StudentRepository;
