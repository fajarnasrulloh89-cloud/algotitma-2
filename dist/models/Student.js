"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const Person_1 = require("./Person");
// Student mewarisi Person. Ini contoh inheritance.
class Student extends Person_1.Person {
    constructor(record) {
        super(record.id, record.name, record.email);
        this.nim = record.nim;
        this.major = record.major;
        this.semester = record.semester;
    }
    getNim() {
        return this.nim;
    }
    setNim(newNim) {
        this.nim = newNim;
    }
    getMajor() {
        return this.major;
    }
    setMajor(newMajor) {
        this.major = newMajor;
    }
    getSemester() {
        return this.semester;
    }
    setSemester(newSemester) {
        this.semester = newSemester;
    }
    // Polymorphism: implementasi getInfo milik Student berbeda dari class lain yang mungkin mewarisi Person.
    getInfo() {
        return `${this.getNim()} - ${this.getName()} (${this.getMajor()}, semester ${this.getSemester()})`;
    }
    toRecord() {
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
exports.Student = Student;
