import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import Mail from 'nodemailer/lib/mailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailServiceAPI {
    private mailerSend: MailerSend;

    constructor() {
        this.mailerSend = new MailerSend({
            apiKey: process.env.EMAIL_SEND_API_KEY || '',
        });
    }

    public async sendEmail(mailOptions: Mail.Options): Promise<{ messageid: string }> {
        try {
            console.log(`Attempting to send email via API to: ${mailOptions.to}`);
            
            // Create sender
            const from = mailOptions.from?.toString() || process.env.EMAIL_USER || '';
            const fromName = 'TESTE_API_EMAIL_SEND'; 
            const sentFrom = new Sender(from, fromName);
            
            // Create recipients
            let recipients: Recipient[] = [];
            if (typeof mailOptions.to === 'string') {
                recipients = [new Recipient(mailOptions.to, '')];
            } else if (Array.isArray(mailOptions.to)) {
                recipients = mailOptions.to.map(to => new Recipient(to.toString(), ''));
            }
            
            // Create email params
            const emailParams = new EmailParams()
                .setFrom(sentFrom)
                .setTo(recipients)
                .setSubject(mailOptions.subject?.toString() || '')
                .setHtml(mailOptions.html?.toString() || '')
                .setText(mailOptions.text?.toString() || '');
            
            // Handle CC if present
            if (mailOptions.cc) {
                const cc = Array.isArray(mailOptions.cc) 
                    ? mailOptions.cc.map(c => new Recipient(c.toString(), ''))
                    : [new Recipient(mailOptions.cc.toString(), '')];
                emailParams.setCc(cc);
            }
            
            // Handle BCC if present
            if (mailOptions.bcc) {
                const bcc = Array.isArray(mailOptions.bcc)
                    ? mailOptions.bcc.map(b => new Recipient(b.toString(), ''))
                    : [new Recipient(mailOptions.bcc.toString(), '')];
                emailParams.setBcc(bcc);
            }
            
            // Send email
            const response = await this.mailerSend.email.send(emailParams);
            console.log('Email sent successfully via API:', response);
            
            return { messageid: response.headers['x-message-id'] || 'api-sent' };
        } catch (error) {
            console.error('Error sending email via API:', error);
            throw error;
        }
    }
}
