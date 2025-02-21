import axios from "axios";

async function getHistoria(title, id){
    try{
        const response = await axios.get(`/api/historia`, {
            params: { title, id }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar a história:', error);
        throw new Error('Erro ao buscar a história');
    }
}

async function gethistoriaData(level){
    try{
        const response = await axios.get('/api/historia/data', {
            params: {level}               
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados  história:', error);
        throw new Error('Erro ao buscar Dados história');
    }
}

export { getHistoria, gethistoriaData };