import path from 'path';
import { FileService } from './FileService';
import { EmailService } from './EmailService';
import { ValidationService } from './ValidationService';

interface OtpRecord {
  email: string;
  otpCode: string;
  expiredAt: number;
}

export class OtpService {
  private readonly otpFileService: FileService<OtpRecord>;
  private readonly emailService: EmailService;

  constructor() {
    this.otpFileService = new FileService<OtpRecord>(path.join(process.cwd(), 'data', 'otps.json'));
    this.emailService = new EmailService();
  }

  async requestOtp(email: string): Promise<void> {
    if (!ValidationService.validateEmail(email)) {
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

  async verifyOtp(email: string, otpCode: string): Promise<boolean> {
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
