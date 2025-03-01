import { Router} from 'express'; 
import { AuthenticationSignUp, AuthenticationLogin, MiddleJWTverify } from '../Controllers/Authentication'; 
import { GetHistoria, GetHistoriaData } from '../Controllers/Gethistoria';

const router = Router();


router.post('/api/auth/login', AuthenticationLogin);
router.post('/api/auth/signUp', AuthenticationSignUp);
router.get('/api/historia', /*MiddleJWTverify*/ GetHistoria);
router.get('/api/historia/data', /*MiddleJWTverify,*/ GetHistoriaData);

router.get('/api/auth/check', MiddleJWTverify, (req, res) => {
   if(req.user){
    res.json( {authenticated: true, user: req.user} )
   }else{
    res.json({authenticated: false});
   }
});

export default router;
