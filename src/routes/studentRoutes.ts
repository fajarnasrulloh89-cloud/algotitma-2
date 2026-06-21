import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';

const router = Router();
const studentController = new StudentController();

const uploadDir = path.join(process.cwd(), 'data', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_request, file, callback) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    callback(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_request, file, callback) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    callback(null, allowedTypes.includes(file.mimetype));
  }
});

router.get('/', studentController.getStudents);
router.get('/linked-list', studentController.getLinkedListStudents);
router.post('/', studentController.createStudent);
router.put('/:nim', studentController.updateStudent);
router.delete('/:nim', studentController.deleteStudent);
router.post('/import/json', studentController.importJson);
router.post('/import/csv', studentController.importCsv);
router.post('/import/file', upload.single('document'), studentController.importFile);
router.get('/export/json', studentController.exportJson);
router.get('/export/csv', studentController.exportCsv);

export default router;
