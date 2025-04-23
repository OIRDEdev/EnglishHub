import axios from "axios";

async function gettranslation(Word){

    try{
        const response = await axios.get(`/api/translation?id=${Word}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao Traduzir:', error);
        throw new Error('Erro ao Traduzir');
    }
}

export default gettranslation;