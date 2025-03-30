import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AddINbase, getDatadforlogin, getUserByEmail }from '../Models/Tables/usuario'; 
import { SendEmailverification, getVerificationToken } from './emaillogincontrollers';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.configDotenv();

const SECRET = process.env.SECRET || 'defaultsecret'; 
const nodeEnv = process.env.NODE_ENV

const AuthenticationLogin: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);
    const { username, password } = req.body;
    

    if (!username || !password) {
        res.status(400).send('Usuário e senha são obrigatórios');
        return 
    }

    try {

        const pass = await getDatadforlogin(username);

        if (!pass) {
            res.status(400).send('Usuário não encontrado');
            return 
        }

        console.log("User data from DB:", pass);

        const isPasswordValid = await bcrypt.compare(password, pass.password_hash);
        if (!isPasswordValid) {
            res.status(400).send('Usuário ou senha inválidos');
            return 
        }

        const userId = pass.id_user;
        
        if (!userId) {
            console.error("User ID is undefined in database result:", pass);
            res.status(500).send('Erro interno ao processar login');
            return;
        }

        const token = jwt.sign({ 
            username, 
            userid: userId 
        }, SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });

        res.json({message: "Login bem Sucedido!"});
        return 
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao realizar login');
        return 
    }
};


const AuthenticationSignUp: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body)
    const { username, password, email } = req.body;

    if (!username || !password) {
        res.status(400).send('Usuário e senha são obrigatórios');
        return 
    }

    try {
       
        const hashPass = await bcrypt.hash(password, 10);
        const db_response = await AddINbase(username, hashPass, email);
        await SendEmailverification(email, username, db_response.userId);
        res.status(200).json({ message: 'Usuário criado com sucesso' });
        return 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
        return 
    }
};

const VerifyEmail: RequestHandler = async (req: Request, res: Response): Promise<void> =>{
    const { Token, userId }  = req.query;
    if(!Token && !userId){
        res.status(200).json({message: 'token not provided'});
    }
    const key = `verificationdata_` + String(userId);
    const response = await getVerificationToken(key);

    if(!response.valid === true){
        res.status(200).json({message: 'this token is not valid'});
    }

    res.status(200).json({message: 'Email valido'});
}

interface MyJwtPayload extends JwtPayload {
    userid: number;
    username: string;
}

const ReSendVerification: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ message: 'Email é obrigatório' });
        return;
    }

    try {

        const userInfo = await getUserByEmail(email);
        
        if (!userInfo) {
            res.status(404).json({ message: 'Email não encontrado' });
            return;
        }
        if (userInfo.userId === null) {
            res.status(400).json({ message: 'ID do usuário inválido' });
            return;
        }
        
        await SendEmailverification(email, userInfo.name, userInfo.userId);
        
        res.status(200).json({ message: 'Email de verificação reenviado com sucesso' });
        return;

    } catch (error) {
        console.error('Erro ao reenviar verificação:', error);
        res.status(500).json({ message: 'Erro ao reenviar email de verificação' });
        return;
    }
}

const MiddleJWTverify: RequestHandler = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies.token;

    if(!token){
        res.status(403).json({message: "Token não fornecido"});
        return 
    }

    try{
        const decoded = jwt.verify(token, SECRET) as MyJwtPayload;
        req.user = { username: decoded.username, userid: decoded.userid };
        next();
    }catch (err) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

export { AuthenticationLogin, AuthenticationSignUp, MiddleJWTverify, VerifyEmail, ReSendVerification};
