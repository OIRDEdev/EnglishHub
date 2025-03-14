import axios from "axios";

async function Getsentences(){
    try{
        const response = await axios.get("/api/anki/sentences");
        return response.data;
    }catch(error){
        console.error("error em axios function ankiHandle: ", error);
        throw new Error("Error ao buscar as frases");
    }
}

async function updateReviewCards(sentence, isgood){
    const data = {
        sentence: sentence,
        isGood: isgood
    }

    try{
        const response = await axios.post('/api/anki/updateReview', data, {
            hearders: {
                'Content-type': 'application/json',
            },
        });
        return response.data
    }catch(error){
        console.error("error em update cards function", error);
    }
}

async function addsentencesFrontfunction(sentence, bookid){
    const data = {
        sentence: sentence,
        bookid: bookid
    }

    try{
        const response = await axios.post("/api/anki/add", data, {
            headers: {
                'Content-type': 'application/json',
            },
        });
        return response.data;
    }catch(error){
        console.error("error na função do frontend addsentence, ", error);
    }
}




export { Getsentences, updateReviewCards, addsentencesFrontfunction};