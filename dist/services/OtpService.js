"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const path_1 = __importDefault(require("path"));
const FileService_1 = require("./FileService");
const EmailService_1 = require("./EmailService");
const ValidationService_1 = require("./ValidationService");
class OtpService {
    constructor() {
        this.otpFileService = new FileService_1.FileService(path_1.default.join(process.cwd(), 'data', 'otps.json'));
        this.emailService = new EmailService_1.EmailService();
    }
    async requestOtp(email) {
        if (!ValidationService_1.ValidationService.validateEmail(email)) {
            throw new Error('Format email tidak valid.');
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiredAt = Date.now() + 5 * 60 * 1000;
        const existingOtps = await this.otpFileService.readJson();
        const activeOtps = existingOtps.filter((otp) => otp.email !== email && otp.expiredAt > Date.now());
        activeOtps.push({ email, otpCode, expiredAt });
        await this.otpFileService.writeJson(activeOtps);
        await this.emailService.sendOtpEmail(email, otpCode);
    }
    async verifyOtp(email, otpCode) {
        const existingOtps = await this.otpFileService.readJson();
        const activeOtp = existingOtps.find((otp) => otp.email === email && otp.otpCode === otpCode && otp.expiredAt > Date.now());
        if (!activeOtp) {
            return false;
        }
        const remainingOtps = existingOtps.filter((otp) => !(otp.email === email && otp.otpCode === otpCode));
        await this.otpFileService.writeJson(remainingOtps);
        return true;
    }
}
exports.OtpService = OtpService;
