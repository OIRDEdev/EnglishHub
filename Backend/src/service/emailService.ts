import nodemailer, { Transporter } from 'nodemailer';
import { EmailServiceAPI } from './emailserviceapi';
import Mail from 'nodemailer/lib/mailer';
import dotenv from 'dotenv';  
dotenv.config();

export class EmailService {
    private transporter: Transporter;
    private apiEmailService: EmailServiceAPI;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.mailersend.net',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            secure: false,
            requireTLS: true,
            tls: {
                rejectUnauthorized: true,
                minVersion: 'TLSv1.2'
            },
            
            connectionTimeout: 20000, // 20 seconds
            greetingTimeout: 20000,   // 20 seconds
            socketTimeout: 25000     // 25 seconds
        });
        
        this.apiEmailService = new EmailServiceAPI();
    }

    public async sendEmail(mailoptions: Mail.Options): Promise<{ messageid: string }> {
        try {
            if (!mailoptions.from) {
                mailoptions.from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
            }
            
            console.log(`Attempting to send email to: ${mailoptions.to}`);
            console.log(`From address: ${mailoptions.from}`);
            
            try {
                // Try SMTP first
                const result = await this.transporter.sendMail(mailoptions);
                console.log('Email sent successfully via SMTP:', result.messageId);
                return { messageid: result.messageId };
            } catch (smtpError) {
                console.error('SMTP email failed, falling back to API:', smtpError);
                
                // Fall back to API
                const apiResult = await this.apiEmailService.sendEmail(mailoptions);
                console.log('Email sent successfully via API fallback');
                return apiResult;
            }
        } catch (error) {
            console.error('All email sending methods failed:', error);
            throw error;
        }
    }
    
    public async verifyConnection(): Promise<boolean> {
        try {
            console.log('Verifying email service connection...');
            await this.transporter.verify();
            console.log('Email service connection verified successfully');
            return true;
        } catch (error) {
            console.error('Email service connection failed:', error);
            return false;
        }
    }
}
