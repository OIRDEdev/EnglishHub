import axios from "axios";


async function loginUser(username, password) {
    try{
        const response = await axios.post('/api/auth/login', {
            username, password
        },{withCredentials: true});

        return response;
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        throw new Error('Não foi possível fazer login. Tente novamente mais tarde.');
    }
}

export default loginUser;