import { Emailwoker } from '../service/workerEmail';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { getValue, setValue } from '../redis/redis-controllers';

dotenv.config();

let emailworkerinstance: Emailwoker | null = null;

function getEmailWorker(): Emailwoker {
    if(!emailworkerinstance){
        emailworkerinstance =  new Emailwoker();
    }
    return emailworkerinstance;
}

async function SendEmailverification(useremail: string, username: string, userId:number): Promise<{success: string} | undefined>{
    const email_worker = getEmailWorker();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    const key = `verificationdata_` + String(userId);
    await storeVereficationcode(userId, verificationToken, expires, key);
    const verificationurl = `http://Englishhub.com/verify?token=${verificationToken}`
    await email_worker.queueemail({
        to: useremail,
        subject: 'welcome to our platform!',
        html: `<h1>Welcome, ${username}!</h1> <br> 
        <p>thanks to join with us.</p>
        <a href="${verificationurl}">Verificar Email</a>
        <p>este link expira em 1h.</p>
        `
    });

    return {success: ' email enviado'}
}

async function storeVereficationcode(userId: number, verificationToken: string, expires: Date, key: string){
    const VerificationDataEmail = {
        userId: userId,
        verificationcode: verificationToken,
        expiresTime: expires,
    };
    await setValue(key , JSON.stringify(VerificationDataEmail));
} 

async function getVerificationToken(key: string) {
    const dataToken = await getValue(key);
    if (!dataToken) {
        return { valid: false, message: 'invalid token or expires token' };
    }

    const data = JSON.parse(dataToken);
    const now = new Date();

    if (now > data.expiresTime) {
        return { valid: false, message: 'token expired' };
    }

    return { valid: true, message: 'Token válido', userId: data.userId};
}



export { getVerificationToken, SendEmailverification }
