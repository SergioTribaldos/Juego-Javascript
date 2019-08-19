
window.onload=function () {

    var personaje=JSON.parse(localStorage.getItem("personaje"))
    actualizaDatosPersonaje(personaje);


    document.getElementById("evento1").addEventListener("click",function (event) {
        console.log(this)
        let ventanaCombate=$("#combate");
        $("#contenedor").css("opacity",0.2)
        ventanaCombate.show(1200,"easeOutCirc");


    })




















    function actualizaDatosPersonaje(personaje){
        let datosPersonaje=document.getElementById("datosPersonaje")
        datosPersonaje.childNodes[1].innerHTML="<span>Nombre </span>"+personaje.nombre;
        datosPersonaje.childNodes[3].innerHTML="<span>Vida </span> <progress value="+personaje.vida+" max=\"100\">";
        datosPersonaje.childNodes[5].innerHTML="<span>Mana </span>"+personaje.mana;
        datosPersonaje.childNodes[7].innerHTML="<span>Exp </span>"+personaje.experiencia;

    }
}
