import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { OtpService } from '../services/OtpService';

export class AuthController {
  private readonly authService = new AuthService();
  private readonly otpService = new OtpService();

  login = (request: Request, response: Response): void => {
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
    } catch (error: unknown) {
      response.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login gagal.'
      });
    }
  };

  requestOtp = async (request: Request, response: Response): Promise<void> => {
    try {
      const { email } = request.body;
      await this.otpService.requestOtp(email);

      response.json({
        success: true,
        message: 'OTP berhasil dikirim. Jika SMTP belum disetel, cek terminal server.'
      });
    } catch (error: unknown) {
      response.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Gagal mengirim OTP.'
      });
    }
  };

  verifyOtp = async (request: Request, response: Response): Promise<void> => {
    try {
      const { email, otpCode } = request.body;
      const verified = await this.otpService.verifyOtp(email, otpCode);

      if (!verified) {
        response.status(400).json({ success: false, message: 'OTP salah atau sudah kedaluwarsa.' });
        return;
      }

      response.json({ success: true, message: 'OTP berhasil diverifikasi.' });
    } catch (error: unknown) {
      response.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Verifikasi OTP gagal.'
      });
    }
  };
}
