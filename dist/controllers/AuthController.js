"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const OtpService_1 = require("../services/OtpService");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
        this.otpService = new OtpService_1.OtpService();
        this.login = (request, response) => {
            try {
                const { username, password } = request.body;
                const user = this.authService.login(username, password);
                response.json({
                    success: true,
                    message: 'Login berhasil.',
                    user: {
                        username: user.username,
                        email: user.email
                    }
                });
            }
            catch (error) {
                response.status(401).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Login gagal.'
                });
            }
        };
        this.requestOtp = async (request, response) => {
            try {
                const { email } = request.body;
                await this.otpService.requestOtp(email);
                response.json({
                    success: true,
                    message: 'OTP berhasil dikirim. Jika SMTP belum disetel, cek terminal server.'
                });
            }
            catch (error) {
                response.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Gagal mengirim OTP.'
                });
            }
        };
        this.verifyOtp = async (request, response) => {
            try {
                const { email, otpCode } = request.body;
                const verified = await this.otpService.verifyOtp(email, otpCode);
                if (!verified) {
                    response.status(400).json({ success: false, message: 'OTP salah atau sudah kedaluwarsa.' });
                    return;
                }
                response.json({ success: true, message: 'OTP berhasil diverifikasi.' });
            }
            catch (error) {
                response.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Verifikasi OTP gagal.'
                });
            }
        };
    }
}
exports.AuthController = AuthController;
