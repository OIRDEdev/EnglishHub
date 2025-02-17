import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AddINbase, getDatadforlogin }from '../Models/Tables/usuario'; 
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


        const isPasswordValid = await bcrypt.compare(password, pass);
        if (!isPasswordValid) {
            res.status(400).send('Usuário ou senha inválidos');
            return 
        }


        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure:nodeEnv === 'production',
            sameSite:'strict',
            maxAge:3600000,
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
    const { username, password, Email } = req.body;

    if (!username || !password) {
        res.status(400).send('Usuário e senha são obrigatórios');
        return 
    }

    try {
       
        const hashPass = await bcrypt.hash(password, 10);
        await AddINbase(username, hashPass, Email);
        res.status(200).json({ message: 'Usuário criado com sucesso' });
        return 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
        return 
    }
};

interface MyJwtPayload extends JwtPayload {
    username: string;
}

const MiddleJWTverify: RequestHandler = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies.token;

    if(!token){
        res.status(403).json({message: "Token não fornecido"});
        return 
    }

    try{
        const decoded = jwt.verify(token, SECRET) as MyJwtPayload;
        req.user ={ username: decoded.username }
        next();
    }catch (err) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

export { AuthenticationLogin, AuthenticationSignUp, MiddleJWTverify};
