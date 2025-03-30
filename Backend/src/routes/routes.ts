import { Router} from 'express'; 
import { AuthenticationSignUp, AuthenticationLogin, MiddleJWTverify, VerifyEmail, ReSendVerification } from '../Controllers/Authentication'; 
import { GetHistoria, GetHistoriaData } from '../Controllers/Gethistoria';
import { GetAnkiSentences, updateCard } from '../Controllers/AnkiController';
const router = Router();


router.post('/api/auth/login', AuthenticationLogin);
router.post('/api/auth/signUp', AuthenticationSignUp);
router.get('/api/auth/verify', VerifyEmail);
router.get('/api/auth/ReSendVerication', ReSendVerification)
router.get('/api/historia', MiddleJWTverify, GetHistoria);
router.get('/api/historia/data', MiddleJWTverify, GetHistoriaData);
router.get('/api/anki/sentences', MiddleJWTverify, GetAnkiSentences);
router.post('/api/anki/updateReview', MiddleJWTverify,updateCard);
router.get('/api/auth/check', MiddleJWTverify, (req, res) => {
   if(req.user){
    res.json( {authenticated: true, user: req.user} )
   }else{
    res.json({authenticated: false});
   }
});

export default router;
