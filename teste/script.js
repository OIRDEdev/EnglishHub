function TranformInFarenheit(){
    let celsius = parseFloat(document.getElementById("convert-farenheit-input").value);
    let farenheit = parseFloat(1.8 * celsius + 32);

    document.getElementById('resposta-farenheit').innerHTML = farenheit;
}

function AreaQuadrado(){
    let lado = parseFloat(document.getElementById("area-perimetro-Q-input").value);
    let area = Math.pow(lado, 2);

    let perimetro = lado * 4;

    document.getElementById("resposta-Q").innerHTML = area;
    document.getElementById('resposta-Q-P').innerHTML = perimetro;

}


function AreaRetangulo() {
    let lado1 = parseFloat(document.getElementById("area-perimetro-R-input1").value);
    let lado2 = parseFloat(document.getElementById("area-perimetro-R-input2").value);
    
    let area = lado1 * lado2;
    let perimetro = 2 * (lado1 + lado2);
    
    document.querySelector('.resposta-R').innerHTML = area;
    document.querySelector('.resposta-R-P').innerHTML = perimetro;
}


function HorasParaMinutos() {
    let horas = parseFloat(document.getElementById("horas-minuto-input").value);
    let minutos = horas * 60;
    
    document.querySelector('.resposta-horas').innerHTML = minutos;
}


function CalcularMedia() {
    let idade1 = parseFloat(document.getElementById("media-input1").value);
    let idade2 = parseFloat(document.getElementById("media-input2").value);
    let idade3 = parseFloat(document.getElementById("media-input3").value);
    let idade4 = parseFloat(document.getElementById("media-input4").value);
    
    let media = (idade1 + idade2 + idade3 + idade4) / 4;
    
    document.querySelector('.resposta-media').innerHTML = media;
}