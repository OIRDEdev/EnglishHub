import dotenv from 'dotenv';
import { Request, Response, RequestHandler } from 'express';
import jwt, { JwtPayload} from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { addGoogleUser, getUserByEmail } from '../Models/Tables/usuario';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.SECRET || 'nier';
const nodeEnv = process.env.NODE_ENV
const googleclient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

async function verifyGoogleToken(token: string) {
    try {
      const ticket = await googleclient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID, 
      });
      const payload = ticket.getPayload();

      console.log("Google Token Payload:", payload);
      return payload;
    } catch (error) {
      console.error("Erro ao verificar token do Google:", error);
      return null;
    }
  }
const GoogleCallback: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { credential } = req.body;

    if (!credential) {
        res.status(400).json({ message: 'Credential (ID Token) não fornecido.' });
        return
    }
    
    const googleUserPayload = await verifyGoogleToken(credential);
    
    if (!googleUserPayload) {
        res.status(401).json({ message: 'Token do Google inválido ou expirado.' });
        return 
    }
    const email = googleUserPayload.email as string;
    const name =  googleUserPayload.name as string;
    const picture = googleUserPayload.picture as string;
    let isverified = 1;

    const verify = await getUserByEmail(email);
    const userId = verify.userId
    if(verify.success){
      const token = jwt.sign({ 
        username: name, 
        userid:  userId
      }, JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
          httpOnly: true,
          secure: nodeEnv === 'production',
          sameSite: 'strict',
          maxAge: 3600000,
      });
    }else {
      const response = await addGoogleUser(email, name, picture, isverified);
      const username = googleUserPayload.name;
      const userid = response.userId;
      const token = jwt.sign({ 
          username: username, 
          userid: userid 
      }, JWT_SECRET, { expiresIn: '1h' });
  
      res.cookie('token', token, {
          httpOnly: true,
          secure: nodeEnv === 'production',
          sameSite: 'strict',
          maxAge: 3600000,
      });
    }


    console.log("JWT criado e cookie 'session_token' definido.");

    res.status(200).json({
        message: 'Login bem-sucedido!',
        user: {
           username: googleUserPayload.name, 
           email: googleUserPayload.email,
           name: googleUserPayload.name,
           picture: googleUserPayload.picture,
        }
    });
}


export { verifyGoogleToken, GoogleCallback }