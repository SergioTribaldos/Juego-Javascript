window.onload = function () {

    var personaje = JSON.parse(localStorage.getItem("personaje"))
    actualizaDatosPersonaje(personaje);


    $("#evento1").click(function (event) {
        muestraVentanaCombate();

    })

    ////////EVENTO BOTON DE MAGIA/////////
    $("#botonMagia").click(function () {
        $("#navbarCombate").hide(300);
        $("#navbarMagias").show(400)

        personaje.magias.forEach(function (elem, index) {
            let boton = `<div class="botonDefault botonMagia" id="magia${index}"><h2>${elem.nombre}</h2>
                                                            <p>Mana: ${elem.mana}</p></div>`;

            $("#navbarMagias").append(boton);
            $("#magia" + index).on("click", function () {
                ataqueMagico(elem)
            })


        })
    });

    ////////EVENTO BOTON ATAQUE FISICO///////
    $("#botonAtaque").click(function () {
        ataqueFisico();
        actualizaDatosPersonaje(personaje);

    });

    ////////EVENTO BOTON ESCAPAR///////
    $("#botonEscapar").click(function () {
        muestraInfoCombate(`${personaje.nombre} intenta escapar...`,`Consigue escapar!`);
        setTimeout(ocultaVentanaCombate,4700);
        actualizaDatosPersonaje(personaje);

    });


    function muestraVentanaCombate() {
        let ventanaCombate = $("#combate");
        $("#contenedor").css("opacity", 0.2)
        ventanaCombate.toggle("explode",400)
    }

    function ocultaVentanaCombate(){
        let ventanaCombate = $("#combate");
        $("#contenedor").css("opacity", 1)
        ventanaCombate.toggle("explode",400)
    }

    function muestraInfoCombate(string, stringDaño) {
        $("#infoCombate").html(string).show().animate({fontSize: 40}, {
            duration: 2000,
            complete() {

                $("#infoCombate").css({
                    "display": "none"
                }).show(1000).html(stringDaño).css("fontSize",40)
            }
        })
        setTimeout(function () {
            $("#infoCombate").hide().css("fontSize",20)
        }, 4500)

    }

    function ataqueMagico(magia) {
        if (personaje.mana < magia.mana) {
            alert("No te queda mana")
        } else {
            muestraInfoCombate(`${personaje.nombre} usa ${magia.nombre}`, `${magia.nombre} causa ${magia.daño} puntos de daño!`)
            personaje.mana -= magia.mana;
            actualizaDatosPersonaje(personaje)
        }


    }

    function ataqueFisico(){
        muestraInfoCombate(`${personaje.nombre} ataca...`,`Causa ${personaje.ataque} puntos de daño!`)
    }

    function actualizaDatosPersonaje(personaje) {
        let datosPersonaje = document.getElementById("datosPersonaje")
        datosPersonaje.childNodes[1].innerHTML = "<span>Nombre </span>" + personaje.nombre;
        datosPersonaje.childNodes[3].innerHTML =`<span>Vida </span> <progress class="progresoVida" value="${personaje.vida}" max=${personaje.maxVida}>`;
        datosPersonaje.childNodes[5].innerHTML = `<span>Mana </span> <progress class="progresoMana" value="${personaje.mana}" max=${personaje.maxMana}>`;
        datosPersonaje.childNodes[7].innerHTML = "<span>Exp </span>" + personaje.experiencia;

    }
}
