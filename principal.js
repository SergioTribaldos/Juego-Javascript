window.onload = function () {

    var personaje = JSON.parse(localStorage.getItem("personaje"));
    var actionIsHappening = false;
    var enemies = [
        {
            img: "enemy1.png",
            name: "Zombie podrido",
            maxLife:5,
            life: 5,
            attacks: [
                {name:"Aliento podrido",damage:5},
                {name:"Hachazo ponzoñoso",damage:8},
                {name:"Pedo de zombie",damage:15},

            ]
        },
        {
            img: "enemy2.png",
            name: "Caballero raruno",
            maxLife:12,
            life: 12,
            attacks: [
                {name:"Ataque normal",damage:5},
                {name:"Golpe de cresta",damage:8},
                {name:"Ataque de ojillos",damage:15},

            ]

        }
    ]
    var enemyNum = 0;

    actualizaDatosPersonaje(personaje);




    const escapar = () => {
        muestraInfoCombate(`${personaje.nombre} intenta escapar...`, `Consigue escapar!`);
        setTimeout(ocultaVentanaCombate, 4700);
        actualizaDatosPersonaje(personaje);
    };

    const checkWinCondition = (player, enemy) => {
        if (player.vida <= 0) {
            alert("Game Over")
        } else if (enemy.life <= 0) {
            actualizaDatosPersonaje();
            $("#enemyDiv").animate({opacity: "0"}, 2000);
            muestraInfoCombate(`${player.nombre} se alza con la victoria!`, "")
                .then(function () {
                    ocultaVentanaCombate();
                    console.log($("#evento"+enemyNum))
                    $("#evento"+enemyNum).removeClass("current")
                    enemyNum++;
                    $("#evento"+enemyNum).addClass("current")
                    $("#enemyDiv").css("opacity","1")
                })
        }else{
            actualizaDatosPersonaje();
            setTimeout(function () {
                enemyAttack(enemy);
            },1000)
            ;
        }
    }

    const muestraVentanaCombate = () => {
        actualizaDatosPersonaje();
        let ventanaCombate = $("#combate");
        $("#enemy-img").attr("src", "img/" + enemies[enemyNum].img);
        $("#contenedor").css("opacity", 0.2)
        ventanaCombate.toggle("explode")
    }


    const ataqueFisico = () => {
        let player = personaje;
        let enemy = enemies[enemyNum];
        console.log(enemy.data)
        if (!actionIsHappening) {
            actionIsHappening = true;
            muestraInfoCombate(`${personaje.nombre} ataca...`, `Causa ${personaje.ataque} puntos de daño!`)
                .then(() => {
                    actualizaDatosPersonaje(personaje);
                    showAttackEffect("#enemy-img");

                })
                .then(() => {
                    enemy.life -= player.ataque;
                    console.log(enemyNum)
                    checkWinCondition(player, enemy);

                })
        }

    }

    const magicAttack = () => {
        let player = personaje;
        let enemy = enemies[enemyNum];

        $("#navbarCombate").hide(300);
        $("#navbarMagias").show(400).empty();

        personaje.magias.forEach(function (elem, index) {
            let boton = `
                <div class="botonDefault botonMagia" id="magia${index}">
                    <h2>${elem.nombre}</h2>
                    <p>Mana: ${elem.mana}</p>
                </div>
            `;
            $("#navbarMagias").append(boton);
            $("#magia" + index).on("click", function () {
                if (!actionIsHappening) {
                    actionIsHappening = true;

                    ataqueMagico(elem)
                        .then(() => {
                            showAttackEffect("#enemy-img");
                            player.mana -= elem.mana;
                            actualizaDatosPersonaje(personaje)
                            actionIsHappening = false;
                            enemy.life -= elem.daño;
                            checkWinCondition(player, enemy)
                        })
                        .then(() => {
                            $("#navbarMagias").hide(300).empty();
                            $("#navbarCombate").show(400);
                        })
                }
            })
        })
    };

    const enemyAttack = () =>{
        let enemy =enemies[enemyNum];
        let randomSelectedAttack =enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];
        console.log(randomSelectedAttack)
        muestraInfoCombate(`${enemy.name} lanza ${randomSelectedAttack.name}`,`Causa ${randomSelectedAttack.damage} puntos de daño`)
            .then(()=>{
                showAttackEffect("#player-img");
                personaje.vida-=randomSelectedAttack.damage;
                actualizaDatosPersonaje();
                actionIsHappening = false;
            });
    };

    $("#botonEscapar").on("click", escapar);
    $("#botonAtaque").on("click", ataqueFisico);
    $("#botonMagia").on("click", magicAttack);



    $("#evento0").on("click" , muestraVentanaCombate);
    $("#evento1").on("click", muestraVentanaCombate);


    function ocultaVentanaCombate() {
        let ventanaCombate = $("#combate");
        $("#contenedor").css("opacity", 1)
        ventanaCombate.toggle("explode", 400)
    }


    function muestraInfoCombate(string, stringDaño) {
        return new Promise(function (resolve, reject) {

            $("#infoCombate").html(string).show().animate({fontSize: 40}, {
                duration: 2000,
                complete() {
                    $("#infoCombate").css({
                        "display": "none"
                    }).show(1000).html(stringDaño).css("fontSize", 40)
                }
            });
            setTimeout(function () {
                $("#infoCombate").hide().css("fontSize", 20);
                resolve();
            }, 4500)
        });

    }

    function showAttackEffect(enemySelector) {
        let enemy = $(enemySelector)
        for (let i = 0; i < 7; i++) {
            enemy.animate({opacity:0.5},50);
            enemy.animate({opacity:1},50);

        }
    }

    function ataqueMagico(magia) {
        if (personaje.mana < magia.mana) {
            alert("No te queda mana")
        } else {
            return muestraInfoCombate(`${personaje.nombre} usa ${magia.nombre}`, `${magia.nombre} causa ${magia.daño} puntos de daño!`);
        }


    }


    function actualizaDatosPersonaje() {
        let enemy=enemies[enemyNum];
        let datosPersonaje = document.getElementById("datosPersonaje")
        datosPersonaje.childNodes[1].innerHTML = "<span>Nombre </span>" + personaje.nombre;
        datosPersonaje.childNodes[3].innerHTML = `<span>Vida </span> <progress class="progresoVida" value="${personaje.vida}" max=${personaje.maxVida}>`;
        datosPersonaje.childNodes[5].innerHTML = `<span>Mana </span> <progress class="progresoMana" value="${personaje.mana}" max=${personaje.maxMana}>`;
        datosPersonaje.childNodes[7].innerHTML = "<span>Exp </span>" + personaje.experiencia;
        console.log(enemy.life);

        $("#enemyLifeBar").attr("value",`${enemy.life}`);
        $("#enemyLifeBar").attr("max",`${enemy.maxLife}`);


    }
}
