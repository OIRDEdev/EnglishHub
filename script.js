function mudando_texto(a){
    const p_id = document.getElementById('texto');
    if(a === 1){
        p_id.innerHTML = 'Bom Dia';
    }else if(a == 2){
        p_id.innerHTML = 'Boa Tarde';
    } else if(a === 3){
        p_id.innerHTML = 'Boa noite'
    }

};