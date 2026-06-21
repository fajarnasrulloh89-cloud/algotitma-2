"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    async sendOtpEmail(toEmail, otpCode) {
        const smtpHost = process.env.SMTP_HOST;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        // Mode demo: jika SMTP belum disetel, OTP tetap tampil di terminal agar project bisa dites.
        if (!smtpHost || !smtpUser || !smtpPass) {
            console.log(`[MODE DEMO] OTP untuk ${toEmail}: ${otpCode}`);
            return;
        }
        const transporter = nodemailer_1.default.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });
        await transporter.sendMail({
            from: process.env.SMTP_FROM || smtpUser,
            to: toEmail,
            subject: 'Kode OTP Verifikasi Akun',
            text: `Kode OTP Anda adalah ${otpCode}. Kode berlaku selama 5 menit.`,
            html: `<p>Kode OTP Anda adalah <b>${otpCode}</b>.</p><p>Kode berlaku selama 5 menit.</p>`
        });
    }
}
exports.EmailService = EmailService;
