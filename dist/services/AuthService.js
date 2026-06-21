"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const ValidationService_1 = require("./ValidationService");
class AuthService {
    constructor() {
        this.adminUser = {
            username: process.env.ADMIN_USERNAME || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: process.env.ADMIN_PASSWORD || 'Admin123!'
        };
    }
    login(username, password) {
        if (!username || !password) {
            throw new Error('Username dan password wajib diisi.');
        }
        if (!ValidationService_1.ValidationService.validatePassword(password)) {
            throw new Error('Format password tidak valid. Minimal 8 karakter, huruf besar, huruf kecil, angka, dan simbol.');
        }
        if (username !== this.adminUser.username || password !== this.adminUser.password) {
            throw new Error('Username atau password salah. Silakan coba lagi.');
        }
        return this.adminUser;
    }
}
exports.AuthService = AuthService;
