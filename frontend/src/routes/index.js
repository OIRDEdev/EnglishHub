import { createRouter, createWebHistory } from "vue-router"; 
import api from "@/utils/axios";
import LoginPage from "@/components/LoginPage/LoginPage.vue";
import MainPage from "@/components/MainPage/MainPage.vue";
import SignupPage from "@/components/RgisterPage/SignupPage.vue";
import HistoriaPage from "@/components/HistoriaPage/HistoriaPage.vue";
import InicialPage from "@/components/InicialPage/InicialPage.vue";
import VerifyEmail from "@/components/verifyemail/VerifyEmail.vue";
// Função de autenticação
const isAuthenticated = async function() {
    try {
        const response = await api.get('/api/auth/check');
        console.log(response.data.authenticated);
        return response.data.authenticated; 
    } catch (error) {
        return false;
    }
};

const routes = [
    { path: '/', name: "Home", component: InicialPage },
    { path: '/auth/login', name: "Login", component: LoginPage },
    { path: '/auth/verify', name: "VerifyEmail", component: VerifyEmail},
    { path: '/main/:username', name: "MainAccount", component: MainPage }, 
    { path: '/auth/signUp', name:'Signup', component: SignupPage},
    { path: '/historia/:level/:title/:id', name: 'Historia', component: HistoriaPage, props: true, /*meta: { requiresAuth: true }*/},
];

const router = createRouter({
    history: createWebHistory(), 
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        const isAuthenticatedUser = await isAuthenticated();
        if (isAuthenticatedUser) {
            next();
        } else {
            next({ name: 'Signup' });
        }
    } else {
       // if(to.path == '/'){
           // next({name: 'MainAccount'}); 
         //  next({name: '/'});
       // }
        next();
    }
});

export default router;
