"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const StudentController_1 = require("../controllers/StudentController");
const router = (0, express_1.Router)();
const studentController = new StudentController_1.StudentController();
const uploadDir = path_1.default.join(process.cwd(), 'data', 'uploads');
fs_1.default.mkdirSync(uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: uploadDir,
    filename: (_request, file, callback) => {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        callback(null, `${timestamp}-${safeName}`);
    }
});
const upload = (0, multer_1.default)({
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
exports.default = router;
