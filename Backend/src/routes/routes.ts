import { Router} from 'express'; 
import { AuthenticationSignUp, AuthenticationLogin, MiddleJWTverify, VerifyEmail, ReSendVerification } from '../Controllers/Authentication'; 
import { GoogleCallback } from '../Controllers/GoogleAuthecationController';
import { GetHistoria, GetHistoriaData } from '../Controllers/Gethistoria';
import { GetAnkiSentences, updateCard, addsentencescontroller } from '../Controllers/AnkiController';
const router = Router();


router.post('/api/auth/login', AuthenticationLogin);
router.post('/api/auth/signUp', AuthenticationSignUp);
router.get('/api/auth/verify', VerifyEmail);
router.get('/api/auth/ReSendVerication', ReSendVerification)
router.get('/api/historia', MiddleJWTverify, GetHistoria);
router.get('/api/historia/data', MiddleJWTverify, GetHistoriaData);
router.get('/api/anki/sentences', MiddleJWTverify, GetAnkiSentences);
router.post('/api/anki/updateReview', MiddleJWTverify,updateCard);
router.post('/api/anki/add', MiddleJWTverify, addsentencescontroller)

router.post('/api/auth/google/callback', GoogleCallback);






router.post('/api/auth/logout', MiddleJWTverify, (req, res) => {
   res.clearCookie('session_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
  });
  res.status(200).json({ message: 'Logout realizado com sucesso.' });
});
router.get('/api/auth/check', MiddleJWTverify, (req, res) => {
   if(req.user){
    res.json( {authenticated: true, user: req.user} )
   }else{
    res.json({authenticated: false});
   }
});

export default router;
