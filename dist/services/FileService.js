"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class FileService {
    constructor(filePath) {
        this.filePath = filePath;
    }
    async readJson() {
        try {
            await promises_1.default.mkdir(path_1.default.dirname(this.filePath), { recursive: true });
            const fileContent = await promises_1.default.readFile(this.filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
        catch (error) {
            // Jika file belum ada, aplikasi membuat file kosong.
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                await this.writeJson([]);
                return [];
            }
            throw new Error(`Gagal membaca file ${this.filePath}.`);
        }
    }
    async writeJson(data) {
        try {
            await promises_1.default.mkdir(path_1.default.dirname(this.filePath), { recursive: true });
            await promises_1.default.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch {
            throw new Error(`Gagal menulis file ${this.filePath}.`);
        }
    }
}
exports.FileService = FileService;
