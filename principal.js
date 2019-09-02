window.onload = function () {

    var personaje = JSON.parse(localStorage.getItem("personaje"));
    var actionIsHappening = false;

    actualizaDatosPersonaje(personaje);

    ////////EVENTO BOTON DE MAGIA/////////
    $("#botonMagia").click(function() {
        $("#navbarCombate").hide(300);
        $("#navbarMagias").show(400);

        personaje.magias.forEach(function (elem, index) {
            let boton = `
                <div class="botonDefault botonMagia" id="magia${index}">
                    <h2>${elem.nombre}</h2>
                    <p>Mana: ${elem.mana}</p>
                </div>
            `;
            $("#navbarMagias").append(boton);
            $("#magia" + index).on("click", function() {
                if (!actionIsHappening) {
                    actionIsHappening = true;
                    ataqueMagico(elem).then( () => {
                        personaje.mana -= elem.mana;
                        actualizaDatosPersonaje(personaje)
                        actionIsHappening = false;
                    })
                }
            })
        })
    });

    var actionButtons = $('.buttonDefault');

    ////////EVENTO BOTON ATAQUE FISICO///////
    $("#botonAtaque").click(function () {
        if (!actionIsHappening) {
            actionIsHappening = true;
                ataqueFisico().then( () => {
                    actualizaDatosPersonaje(personaje);
                    actionIsHappening = false;
                });
            }
        }
    );
    
    /////// TODO separar funciones ///////
    const escapar = () => {
        muestraInfoCombate(`${personaje.nombre} intenta escapar...`,`Consigue escapar!`);
        setTimeout(ocultaVentanaCombate, 4700);
        actualizaDatosPersonaje(personaje);
    }

    const muestraVentanaCombate = () => {
        let ventanaCombate = $("#combate");
        $("#contenedor").css("opacity", 0.2)
        ventanaCombate.toggle("explode",400)
    }

    ////////EVENTO BOTON ESCAPAR///////
    $("#botonEscapar").click(escapar);
    $("#evento1").click(muestraVentanaCombate);

    function ocultaVentanaCombate(){
        let ventanaCombate = $("#combate");
        $("#contenedor").css("opacity", 1)
        ventanaCombate.toggle("explode",400)
    }

    function muestraInfoCombate(string, stringDaño) {
        return new Promise( function(resolve, reject){
            $("#infoCombate").html(string).show().animate({fontSize: 40}, {
                duration: 2000,
                complete() {
                    $("#infoCombate").css({
                        "display": "none"
                    }).show(1000).html(stringDaño).css("fontSize",40)
                }
            });
            setTimeout(function () {
                $("#infoCombate").hide().css("fontSize",20);
                resolve();
            }, 4500)
        });

    }

    function ataqueMagico(magia) {
        if (personaje.mana < magia.mana) {
            alert("No te queda mana")
        } else {
            return muestraInfoCombate(`${personaje.nombre} usa ${magia.nombre}`, `${magia.nombre} causa ${magia.daño} puntos de daño!`);
        }


    }

    function ataqueFisico(){
        return muestraInfoCombate(`${personaje.nombre} ataca...`,`Causa ${personaje.ataque} puntos de daño!`); 
    }

    function actualizaDatosPersonaje(personaje) {
        let datosPersonaje = document.getElementById("datosPersonaje")
        datosPersonaje.childNodes[1].innerHTML = "<span>Nombre </span>" + personaje.nombre;
        datosPersonaje.childNodes[3].innerHTML =`<span>Vida </span> <progress class="progresoVida" value="${personaje.vida}" max=${personaje.maxVida}>`;
        datosPersonaje.childNodes[5].innerHTML = `<span>Mana </span> <progress class="progresoMana" value="${personaje.mana}" max=${personaje.maxMana}>`;
        datosPersonaje.childNodes[7].innerHTML = "<span>Exp </span>" + personaje.experiencia;

    }
}
