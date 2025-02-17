import { Router} from 'express'; 
import { AuthenticationSignUp, AuthenticationLogin, MiddleJWTverify } from '../Controllers/Authentication'; 


const router = Router();


router.post('/auth/login', MiddleJWTverify, AuthenticationLogin);
router.post('/auth/signUp', MiddleJWTverify, AuthenticationSignUp);
router.get('/auth/check', MiddleJWTverify, (req, res) => {
   if(req.user){
    res.json( {authenticated: true, user: req.user} )
   }else{
    res.json({authenticated: false});
   }
});

export default router;
