import { EmailService } from './emailService';
import { EmailServiceAPI } from './emailserviceapi';
import dotenv from 'dotenv';
dotenv.config();

async function testEmailService() {
    try {
        console.log('Testing email service...');
        console.log('Email configuration:');
        console.log(`- SERVICE/HOST: ${process.env.EMAIL_SERVICE || process.env.EMAIL_HOST}`);
        console.log(`- PORT: ${process.env.EMAIL_PORT}`);
        console.log(`- USER: ${process.env.EMAIL_USER}`);
        console.log(`- SECURE: ${process.env.EMAIL_SECURE}`);
        
        // Test email content
        const emailOptions = {
            to: 'samuellucassouza5@gmail.com',  
            subject: 'Test Email',
            text: 'This is a test email from your application.',
            html: '<p>This is a <b>test email</b> from your application.</p>'
        };
        
        // First try SMTP
        try {
            const emailService = new EmailService();
            
            // Verify connection
            const isConnected = await emailService.verifyConnection();
            console.log('SMTP Connection verified:', isConnected);
            
            if (isConnected) {
                // Send a test email
                const result = await emailService.sendEmail(emailOptions);
                console.log('Test email sent successfully via SMTP:', result);
                return;
            }
        } catch (smtpError) {
            console.error('SMTP email service failed:', smtpError);
            console.log('Falling back to API email service...');
        }
        
        // If SMTP failed, try the API
        try {
            const apiEmailService = new EmailServiceAPI();
            const result = await apiEmailService.sendEmail(emailOptions);
            console.log('Test email sent successfully via API:', result);
        } catch (apiError) {
            console.error('API email service also failed:', apiError);
            throw new Error('All email sending methods failed');
        }
    } catch (error) {
        console.error('Error testing email service:', error);
    }
}

testEmailService();