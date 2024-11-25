import { createRouter, createWebHistory } from "vue-router"; // Mudança para createWebHistory
import api from "@/utils/axios";
import LoginPage from "@/components/LoginPage/LoginPage.vue";
import MainPage from "@/components/MainPage/MainPage.vue";
import SignupPage from "@/components/RgisterPage/SignupPage.vue";
// Função de autenticação
const isAuthenticated = async function() {
    try {
        const response = await api.get('/auth/check');
        console.log(response.data.authenticated);
        return response.data.authenticated; 
    } catch (error) {
        return false;
    }
};

const routes = [
    { path: '/', name: "/",component: LoginPage },
    { path: '/main/account', name: "MainAccount", component: MainPage }, 
    { path: '/register/signUp', name:'Signup', component: SignupPage},
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
