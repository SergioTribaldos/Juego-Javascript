window.onload = function () {

    var personaje = JSON.parse(localStorage.getItem("personaje"));
    var actionIsHappening = false;
    var enemies = [
        {
            img: "enemy1.png",
            name: "Zombie podrido",
            maxLife: 5,
            life: 5,
            exp: 110,
            text:"Mis pedacos son nauseabundos",
            attacks: [
                {name: "Aliento podrido", damage: 5},
                {name: "Hachazo ponzoñoso", damage: 8},
                {name: "Pedo de zombie", damage: 15},

            ]
        },
        {
            img: "enemy2.png",
            name: "Caballero raruno",
            maxLife: 12,
            life: 12,
            exp: 200,
            text:"Me gusta vestirme de mujer",
            attacks: [
                {name: "Ataque normal", damage: 5},
                {name: "Golpe de cresta", damage: 8},
                {name: "Ataque de ojillos", damage: 15},
            ]
        },
        {
            img: "enemy3.png",
            name: "Pez disgustado",
            maxLife: 18,
            life: 18,
            exp: 320,
            attacks: [
                {name: "Aletazo de aleta", damage: 7},
                {name: "Lanzamiento de escamas", damage: 10},
                {name: "Bocado mortifero", damage: 19},
            ]
        }
    ];
    var enemyNum = 0;

    actualizaDatosPersonaje(personaje);


    const escapar = () => {
        muestraInfoCombate(`${personaje.nombre} intenta escapar...`, `Consigue escapar!`);
        setTimeout(ocultaVentanaCombate, 4700);
        actualizaDatosPersonaje(personaje);
    };

    const checkEnemyWinCondition = () => {
        let player = personaje;
        let enemy = enemies[enemyNum];
        if (enemy.life <= 0) {
            $("#enemyDiv").animate({opacity: "0"}, 2000);
            let expMessage = checkLevelUp(enemy);

            actualizaDatosPersonaje();
            muestraInfoCombate(`${player.nombre} se alza con la victoria!`, expMessage)
                .then(function () {
                    ocultaVentanaCombate();
                    $("#evento" + enemyNum).removeClass("current");
                    enemyNum++;
                    $("#evento" + enemyNum).addClass("current");
                    $("#enemyDiv").css("opacity", "1");
                    actionIsHappening = false;
                })
        } else {
            actualizaDatosPersonaje();
            setTimeout(function () {
                enemyAttack(enemy);
            }, 1000)
            ;
        }
    };

    const checkPlayerWinCondition = () =>{
        let player = personaje;
        if (player.vida <= 0) {

            $("#combate,#contenedor,nav").hide("explode",{pieces:14}, 1200);

            setTimeout(function () {
                let gameOver = `<div id="gameOver">GAME OVER</div>`;
                $("body").append(gameOver);
                $("#gameOver").animate({height:"20%"},1000)
            }, 1300);


        }
    }

    const muestraVentanaCombate = () => {
        actualizaDatosPersonaje();
        let ventanaCombate = $("#combate");
        $("#enemy-img").attr("src", "img/" + enemies[enemyNum].img);
        $("#contenedor").css("opacity", 0.2);
        ventanaCombate.toggle("explode");
        showEnemyText();
    };


    const ataqueFisico = () => {
        let player = personaje;
        let enemy = enemies[enemyNum];
        if (!actionIsHappening) {
            actionIsHappening = true;
            muestraInfoCombate(`${personaje.nombre} ataca...`, `Causa ${personaje.ataque} puntos de daño!`)
                .then(() => {
                    actualizaDatosPersonaje(personaje);
                    showAttackEffect("#enemy-img");

                })
                .then(() => {
                    enemy.life -= player.ataque;
                    checkEnemyWinCondition();

                })
        }

    };

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
                            actualizaDatosPersonaje(personaje);
                            actionIsHappening = false;
                            enemy.life -= elem.daño;
                            checkEnemyWinCondition()
                        })
                        .then(() => {
                            $("#navbarMagias").hide(300).empty();
                            $("#navbarCombate").show(400);
                        })
                }
            })
        })
    };

    const enemyAttack = () => {
        let enemy = enemies[enemyNum];
        let randomSelectedAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];
        console.log(Math.floor(Math.random() * enemy.attacks.length))
        muestraInfoCombate(`${enemy.name} lanza ${randomSelectedAttack.name}`, `Causa ${randomSelectedAttack.damage} puntos de daño`)
            .then(() => {
                showAttackEffect("#player-img");
                personaje.vida -= randomSelectedAttack.damage;
                actualizaDatosPersonaje();
                checkPlayerWinCondition();
                actionIsHappening = false;
            });
    };

    $("#botonEscapar").on("click", escapar);
    $("#botonAtaque").on("click", ataqueFisico);
    $("#botonMagia").on("click", magicAttack);


    $("#evento0").on("click", muestraVentanaCombate);
    $("#evento1").on("click", muestraVentanaCombate);
    $("#evento2").on("click", muestraVentanaCombate);


    function ocultaVentanaCombate() {
        let ventanaCombate = $("#combate");
        $("#contenedor").css("opacity", 1);
        ventanaCombate.toggle("explode", 400);
    }

    function showEnemyText(){
        let enemyText = enemies[enemyNum].text;
        $("#bocadillo").animate({height:"180px",width:"300px"},
            {duration:1500,easing:'easeOutBounce',complete() {
                    $("#enemyText").html(enemyText).animate({opacity:1},2000)
                }});

    }


    function muestraInfoCombate(string, damageString) {
        return new Promise(function (resolve) {

            $("#infoCombate").html(string).show().animate({fontSize: 40}, {
                duration: 2000,
                complete() {
                    $("#infoCombate").css({
                        "display": "none"
                    }).show(1000).html(damageString).css("fontSize", 40)
                }
            });
            setTimeout(function () {
                $("#infoCombate").hide().css("fontSize", 20);
                resolve();
            }, 4500)
        });

    }


    function showAttackEffect(enemySelector) {
        let enemy = $(enemySelector);
        for (let i = 0; i < 7; i++) {
            enemy.animate({opacity: 0.5}, 50);
            enemy.animate({opacity: 1}, 50);

        }
    }

    function ataqueMagico(magia) {
        if (personaje.mana < magia.mana) {
            alert("No te queda mana")
        } else {
            return muestraInfoCombate(`${personaje.nombre} usa ${magia.nombre}`, `${magia.nombre} causa ${magia.daño} puntos de daño!`);
        }
    };

    function checkLevelUp(enemy) {
        personaje.experiencia += enemy.exp;
        console.log(personaje)
        if (personaje.experiencia > personaje.siguienteNivel) {
            personaje.nivel++;
            personaje.maxVida = personaje.nivel * 100;
            personaje.maxMana = personaje.nivel * 60;
            personaje.ataque = personaje.nivel * 3;
            personaje.siguienteNivel = personaje.nivel * 300;

            console.log(personaje)
            return `${personaje.nombre} sube de nivel!!!`
        } else {
            return `${personaje.nombre} gana ${enemy.exp} puntos de experiencia`
        }
    }


    function actualizaDatosPersonaje() {
        let enemy = enemies[enemyNum];
        let datosPersonaje = document.getElementById("datosPersonaje")
        datosPersonaje.childNodes[1].innerHTML = "<span>Nombre </span>" + personaje.nombre;
        datosPersonaje.childNodes[3].innerHTML = `<span>Vida </span> <progress class="progresoVida" value="${personaje.vida}" max=${personaje.maxVida}>`;
        datosPersonaje.childNodes[5].innerHTML = `<span>Mana </span> <progress class="progresoMana" value="${personaje.mana}" max=${personaje.maxMana}>`;
        datosPersonaje.childNodes[7].innerHTML = "<span>Exp </span>" + personaje.experiencia;
        datosPersonaje.childNodes[9].innerHTML = "<span>LvL </span>" + personaje.nivel;

        $("#enemyLifeBar").attr("value", `${enemy.life}`).attr("max", `${enemy.maxLife}`);

    }
}
