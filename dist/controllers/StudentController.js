"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const CsvService_1 = require("../services/CsvService");
const StudentRepository_1 = require("../services/StudentRepository");
class StudentController {
    constructor() {
        this.studentRepository = new StudentRepository_1.StudentRepository();
        this.getStudents = async (request, response) => {
            try {
                const keyword = String(request.query.keyword || '');
                const searchMethod = String(request.query.searchMethod || 'linear');
                const sortMethod = String(request.query.sortMethod || 'none');
                const sortKey = String(request.query.sortKey || 'nim');
                const searchedStudents = await this.studentRepository.search(keyword, searchMethod);
                const sortedStudents = this.studentRepository.sort(searchedStudents, sortMethod, sortKey);
                response.json({ success: true, data: sortedStudents });
            }
            catch (error) {
                response.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Gagal mengambil data mahasiswa.'
                });
            }
        };
        this.getLinkedListStudents = async (_request, response) => {
            try {
                const students = await this.studentRepository.getAsLinkedList();
                response.json({ success: true, data: students });
            }
            catch (error) {
                response.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Gagal mengambil data linked list.'
                });
            }
        };
        this.createStudent = async (request, response) => {
            try {
                const student = await this.studentRepository.create(request.body);
                response.status(201).json({ success: true, message: 'Data mahasiswa berhasil ditambahkan.', data: student });
            }
            catch (error) {
                response.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Gagal menambah data mahasiswa.'
                });
            }
        };
        this.updateStudent = async (request, response) => {
            try {
                const updatedStudent = await this.studentRepository.update(request.params.nim, request.body);
                response.json({ success: true, message: 'Data mahasiswa berhasil diperbarui.', data: updatedStudent });
            }
            catch (error) {
                response.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Gagal mengubah data mahasiswa.'
                });
            }
        };
        this.deleteStudent = async (request, response) => {
            try {
                await this.studentRepository.delete(request.params.nim);
                response.json({ success: true, message: 'Data mahasiswa berhasil dihapus.' });
            }
            catch (error) {
                response.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Gagal menghapus data mahasiswa.'
                });
            }
        };
        this.importJson = async (request, response) => {
            try {
                const students = request.body.students;
                if (!Array.isArray(students)) {
                    throw new Error('Format JSON harus berupa { "students": [...] }.');
                }
                const importedStudents = await this.studentRepository.importStudents(students);
                response.json({ success: true, message: 'Import JSON berhasil.', data: importedStudents });
            }
            catch (error) {
                response.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Import JSON gagal.'
                });
            }
        };
        this.importCsv = async (request, response) => {
            try {
                const csvText = String(request.body.csvText || '');
                const students = CsvService_1.CsvService.fromCsv(csvText);
                const importedStudents = await this.studentRepository.importStudents(students);
                response.json({ success: true, message: 'Import CSV berhasil.', data: importedStudents });
            }
            catch (error) {
                response.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Import CSV gagal.'
                });
            }
        };
        this.importFile = async (request, response) => {
            try {
                const uploadedFile = request.file;
                if (!uploadedFile) {
                    throw new Error('Tidak ada file yang diunggah.');
                }
                response.json({
                    success: true,
                    message: `File ${uploadedFile.originalname} berhasil diunggah.`,
                    data: {
                        filename: uploadedFile.filename,
                        originalName: uploadedFile.originalname,
                        mimeType: uploadedFile.mimetype,
                        size: uploadedFile.size
                    }
                });
            }
            catch (error) {
                response.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Upload file gagal.'
                });
            }
        };
        this.exportJson = async (_request, response) => {
            try {
                const students = await this.studentRepository.getAll();
                response.setHeader('Content-Disposition', 'attachment; filename="data-mahasiswa.json"');
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify(students, null, 2));
            }
            catch (error) {
                response.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Export JSON gagal.'
                });
            }
        };
        this.exportCsv = async (_request, response) => {
            try {
                const students = await this.studentRepository.getAll();
                response.setHeader('Content-Disposition', 'attachment; filename="data-mahasiswa.csv"');
                response.setHeader('Content-Type', 'text/csv');
                response.send(CsvService_1.CsvService.toCsv(students));
            }
            catch (error) {
                response.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Export CSV gagal.'
                });
            }
        };
    }
}
exports.StudentController = StudentController;
