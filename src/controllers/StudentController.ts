import { Request, Response } from 'express';
import { CsvService } from '../services/CsvService';
import { SearchMethod, SortMethod, StudentRepository } from '../services/StudentRepository';
import { SortKey } from '../algorithms/sorting';
import { StudentRecord } from '../models/Student';

export class StudentController {
  private readonly studentRepository = new StudentRepository();

  getStudents = async (request: Request, response: Response): Promise<void> => {
    try {
      const keyword = String(request.query.keyword || '');
      const searchMethod = String(request.query.searchMethod || 'linear') as SearchMethod;
      const sortMethod = String(request.query.sortMethod || 'none') as SortMethod;
      const sortKey = String(request.query.sortKey || 'nim') as SortKey;

      const searchedStudents = await this.studentRepository.search(keyword, searchMethod);
      const sortedStudents = this.studentRepository.sort(searchedStudents, sortMethod, sortKey);

      response.json({ success: true, data: sortedStudents });
    } catch (error: unknown) {
      response.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Gagal mengambil data mahasiswa.'
      });
    }
  };

  getLinkedListStudents = async (_request: Request, response: Response): Promise<void> => {
    try {
      const students = await this.studentRepository.getAsLinkedList();
      response.json({ success: true, data: students });
    } catch (error: unknown) {
      response.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Gagal mengambil data linked list.'
      });
    }
  };

  createStudent = async (request: Request, response: Response): Promise<void> => {
    try {
      const student = await this.studentRepository.create(request.body);
      response.status(201).json({ success: true, message: 'Data mahasiswa berhasil ditambahkan.', data: student });
    } catch (error: unknown) {
      response.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Gagal menambah data mahasiswa.'
      });
    }
  };

  updateStudent = async (request: Request, response: Response): Promise<void> => {
    try {
      const updatedStudent = await this.studentRepository.update(request.params.nim, request.body);
      response.json({ success: true, message: 'Data mahasiswa berhasil diperbarui.', data: updatedStudent });
    } catch (error: unknown) {
      response.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Gagal mengubah data mahasiswa.'
      });
    }
  };

  deleteStudent = async (request: Request, response: Response): Promise<void> => {
    try {
      await this.studentRepository.delete(request.params.nim);
      response.json({ success: true, message: 'Data mahasiswa berhasil dihapus.' });
    } catch (error: unknown) {
      response.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Gagal menghapus data mahasiswa.'
      });
    }
  };

  importJson = async (request: Request, response: Response): Promise<void> => {
    try {
      const students = request.body.students as StudentRecord[];
      if (!Array.isArray(students)) {
        throw new Error('Format JSON harus berupa { "students": [...] }.');
      }

      const importedStudents = await this.studentRepository.importStudents(students);
      response.json({ success: true, message: 'Import JSON berhasil.', data: importedStudents });
    } catch (error: unknown) {
      response.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Import JSON gagal.'
      });
    }
  };

  importCsv = async (request: Request, response: Response): Promise<void> => {
    try {
      const csvText = String(request.body.csvText || '');
      const students = CsvService.fromCsv(csvText);
      const importedStudents = await this.studentRepository.importStudents(students);

      response.json({ success: true, message: 'Import CSV berhasil.', data: importedStudents });
    } catch (error: unknown) {
      response.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Import CSV gagal.'
      });
    }
  };

  importFile = async (request: Request, response: Response): Promise<void> => {
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
    } catch (error: unknown) {
      response.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Upload file gagal.'
      });
    }
  };

  exportJson = async (_request: Request, response: Response): Promise<void> => {
    try {
      const students = await this.studentRepository.getAll();
      response.setHeader('Content-Disposition', 'attachment; filename="data-mahasiswa.json"');
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringify(students, null, 2));
    } catch (error: unknown) {
      response.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Export JSON gagal.'
      });
    }
  };

  exportCsv = async (_request: Request, response: Response): Promise<void> => {
    try {
      const students = await this.studentRepository.getAll();
      response.setHeader('Content-Disposition', 'attachment; filename="data-mahasiswa.csv"');
      response.setHeader('Content-Type', 'text/csv');
      response.send(CsvService.toCsv(students));
    } catch (error: unknown) {
      response.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Export CSV gagal.'
      });
    }
  };
}
