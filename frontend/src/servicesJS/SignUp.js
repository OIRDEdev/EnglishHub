import axios from "axios";

async function signupfunction(email, username, password){
    try{
        const response = await axios.post('/api/auth/signUp',  {
            email, username, password
        });
        return response;

    } catch (error) {
        console.error('Erro ao tentar Cadastrar os dados:', error);
        throw new Error('Não foi possível fazer fazar o cadastro, tente novamente');
    }
}

export default signupfunction;