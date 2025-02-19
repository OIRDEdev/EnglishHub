import { Router} from 'express'; 
import { AuthenticationSignUp, AuthenticationLogin, MiddleJWTverify } from '../Controllers/Authentication'; 
import { GetHistoria, GetHistoriaData } from '../Controllers/Gethistoria';

const router = Router();


router.post('/auth/login', AuthenticationLogin);
router.post('/auth/signUp', AuthenticationSignUp);
router.get('/auth/historia', MiddleJWTverify, GetHistoria);
router.get('/auth/historia/data', MiddleJWTverify, GetHistoriaData);

router.get('/auth/check', MiddleJWTverify, (req, res) => {
   if(req.user){
    res.json( {authenticated: true, user: req.user} )
   }else{
    res.json({authenticated: false});
   }
});

export default router;
