"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
class ValidationService {
    static validateEmail(email) {
        return this.emailRegex.test(email);
    }
    static validatePassword(password) {
        return this.passwordRegex.test(password);
    }
    static validateNim(nim) {
        return this.nimRegex.test(nim);
    }
    static validateName(name) {
        return this.nameRegex.test(name);
    }
    static validateStudentPayload(student) {
        if (!student.nim || !this.validateNim(student.nim)) {
            throw new Error('NIM harus angka dengan panjang 6 sampai 15 digit.');
        }
        if (!student.name || !this.validateName(student.name)) {
            throw new Error('Nama harus 3-60 karakter dan hanya berisi huruf/spasi/titik.');
        }
        if (!student.email || !this.validateEmail(student.email)) {
            throw new Error('Format email mahasiswa tidak valid.');
        }
        if (!student.major || student.major.trim().length < 3) {
            throw new Error('Jurusan minimal 3 karakter.');
        }
        if (!Number.isInteger(student.semester) || student.semester < 1 || student.semester > 14) {
            throw new Error('Semester harus berupa angka 1 sampai 14.');
        }
    }
}
exports.ValidationService = ValidationService;
// Regex email sederhana dan cukup umum dipakai untuk validasi dasar.
ValidationService.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// NIM hanya angka, panjang 6 sampai 15 digit.
ValidationService.nimRegex = /^\d{6,15}$/;
// Password minimal 8 karakter, ada huruf besar, huruf kecil, angka, dan simbol.
ValidationService.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
// Nama boleh huruf, spasi, titik, dan apostrof.
ValidationService.nameRegex = /^[A-Za-zÀ-ž.'\s]{3,60}$/;
