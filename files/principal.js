window.onload = function () {

    var player = JSON.parse(localStorage.getItem("player"));
    var actionIsHappening = false;
    var enemyNum = 0;
    var enemies = [
        {
            img: "enemy1.png",
            name: "Zombie podrido",
            maxLife: 5,
            life: 5,
            exp: 110,
            text: "Mis pedacos son nauseabundos",
            attacks: [
                {name: "Aliento podrido", damage: 3321},
                {name: "Hachazo ponzoñoso", damage: 3338},
                {name: "Pedo de zombie", damage: 3345},

            ]
        },
        {
            img: "enemy2.png",
            name: "Caballero raruno",
            maxLife: 12,
            life: 12,
            exp: 200,
            text: "Seré tu amante bandido",
            attacks: [
                {name: "Ataque normal", damage: 25},
                {name: "Golpe de cresta", damage: 48},
                {name: "Ataque de ojillos", damage: 55},
            ]
        },
        {
            img: "enemy3.png",
            name: "Pez disgustado",
            maxLife: 18,
            life: 18,
            exp: 320,
            text: "Huelo a bacalao",
            attacks: [
                {name: "Aletazo de aleta", damage: 37},
                {name: "Lanzamiento de escamas", damage: 20},
                {name: "Bocado mortifero", damage: 59},
            ]
        }
    ];

    var backgrounds = ["fondo-combate.png", "fondo-combate2.jpg", "fondo-combate3.png"]


    const playMusic = (theme) => {
        if (typeof theme !== "string") {
            theme = theme.data.song;
        }
        $("#audio").attr("src", `../sounds/${theme}.mp3`).get(0).play();
    };

    const playFX = (sound) => {

        $("#soundFX").attr("src", `../sounds/${sound}.mp3`).get(0).play();
    };

    const escapar = () => {
        showCombatInfo(`${player.name} intenta escapar...`, `Consigue escapar!`)
            .then(function () {
                showGameOver()
            })
    };


    const checkEnemyWinCondition = () => {
        let enemy = enemies[enemyNum];
        if (enemy.life <= 0) {
            playMusic("fanfare");
            $("#player-img").fadeOut({
                duration: 100, complete() {
                    $("#player-img").attr("src", "../img/player-fanfare.png")
                        .fadeIn("slow")
                }
            })
            $("#enemyDiv").animate({opacity: "0"}, 2000);
            let expMessage = checkLevelUp(enemy);
            updateCharacterData();
            showCombatInfo(`${player.name} se alza con la victoria!`, expMessage)
                .then(function () {
                    setTimeout(() => {
                        hideCombatWindow();
                        $("#evento" + enemyNum).removeClass("current");
                        enemyNum++;
                        $("#evento" + enemyNum).addClass("current");
                        $("#enemyDiv").css("opacity", "1");
                        playMusic("main");
                        actionIsHappening = false;
                    }, 2500);

                })
        } else {
            updateCharacterData();
            setTimeout(function () {
                enemyAttack(enemy);
            }, 1000)
            ;
        }
    };

    const checkPlayerWinCondition = () => {
        if (player.life <= 0) {
            showGameOver();
        }
    }

    const showCombatWindow = () => {
        console.log(backgrounds[Math.floor(Math.random() * backgrounds.length)])
        playMusic("combat")
        $("#combate").css("background-image", `url(../img/${backgrounds[Math.floor(Math.random() * backgrounds.length)]})`);
        updateCharacterData();
        let combatWindow = $("#combate");
        $("#enemy-img").attr("src", "../img/" + enemies[enemyNum].img);
        $("#contenedor").css("opacity", 0.2);
        combatWindow.toggle("explode");
        showEnemyText();
    };


    const physicAttack = () => {

        let enemy = enemies[enemyNum];
        if (!actionIsHappening) {
            actionIsHappening = true;
            showCombatInfo(`${player.name} ataca...`, `Causa ${player.attack} puntos de daño!`, "enemy")
                .then(() => {
                    updateCharacterData(player);

                })
                .then(() => {
                    enemy.life -= player.attack;
                    checkEnemyWinCondition();

                })
        }

    };

    const showMagicButtons = () => {
        let enemy = enemies[enemyNum];
        let closeButton = `<div class="botonDefault" id="cerrarMagias">X</div>`;

        $("#navbarCombate").hide(300);
        $("#navbarMagias").show(400).empty().append(closeButton);
        $("#cerrarMagias").on("click", closeMagicBar);
        player.magic.forEach(function (elem, index) {
            let boton = `
                <div class="botonDefault botonMagia" id="magia${index}">
                    <h2>${elem.name}</h2>
                    <p>Mana: ${elem.mana}</p>
                </div>
            `;
            $("#navbarMagias").append(boton);

            $("#magia" + index).on("click", function () {
                if (!actionIsHappening) {
                    actionIsHappening = true;

                    magicAttack(elem)
                        .then(() => {

                            player.mana -= elem.mana;
                            updateCharacterData(player);
                            actionIsHappening = false;
                            enemy.life -= elem.damage;
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
        showCombatInfo(`${enemy.name} lanza ${randomSelectedAttack.name}`, `Causa ${randomSelectedAttack.damage} puntos de daño`, "player")
            .then(() => {
                player.life -= randomSelectedAttack.damage;
                updateCharacterData();
                checkPlayerWinCondition();
                actionIsHappening = false;
            });
    };


    const hideCombatWindow = () => {
        let ventanaCombate = $("#combate");
        $("#contenedor").css("opacity", 1);
        ventanaCombate.toggle("explode", 400);
        $("#player-img").attr("src", "../img/player.png")

    };


    const showEnemyText = () => {
        let enemyText = enemies[enemyNum].text;

        return new Promise(function (resolve) {
            $("#bocadillo").animate({height: "180px", width: "300px"},
                {
                    duration: 1500, easing: 'easeOutBounce', complete() {
                        resolve();
                    }
                });
        }).then(() => {
            return new Promise(function (resolve) {
                $("#enemyText").html(enemyText).animate({opacity: 1}, {
                    duration: 1500, complete() {
                        resolve();
                    }
                })

            })
        }).then(() => {
            $("#enemyText").animate({opacity: 0}, {
                duration: 1000, complete() {
                    $("#bocadillo").animate({height: "0px"}, 1000)

                }
            })
        })

    };


    const showCombatInfo = (string, damageString, character = " ") => {
        return new Promise(function (resolve) {

            $("#infoCombate").html(string).show().animate({fontSize: 40}, {
                duration: 2000,
                complete() {
                    $("#infoCombate").css({
                        "display": "none"
                    }).show(500).html(damageString).css("fontSize", 40);
                    if (character !== " ") {
                        showAttackEffect(`#${character}-img`);
                        playFX("attack");
                        console.log(character)
                    }

                }

            });
            setTimeout(function () {
                $("#infoCombate").hide().css("fontSize", 20);
                resolve();
            }, 3500)
        });
    };


    const showAttackEffect = (enemySelector) => {
        let enemy = $(enemySelector);
        for (let i = 0; i < 7; i++) {
            enemy.animate({opacity: 0.5}, 50);
            enemy.animate({opacity: 1}, 50);

        }
    };

    const showGameOver = () => {
        $("#playerDiv").animate({opacity: "0"}, 2000);

        setTimeout(() => {
            let gameOver = `<div id="gameOver">GAME OVER</div>`;
            $("body").append(gameOver);
            $("#gameOver").animate({height: "20%"}, 1000)
            $("#combate,#contenedor,nav").hide("explode", {pieces: 14}, 1200).remove();
            playMusic("game-over")
        }, 2500)


    }

    const magicAttack = (magic) => {
        if (player.mana < magic.mana) {
            alert("No te queda mana")
        } else {
            return showCombatInfo(`${player.name} usa ${magic.name}`, `${magic.name} causa ${magic.damage} puntos de daño!`, "enemy");
        }
    };

    const closeMagicBar = () => {
        $("#navbarMagias").hide(300).empty();
        $("#navbarCombate").show(400);
    };

    const checkLevelUp = (enemy) => {
        player.exp += enemy.exp;

        if (player.exp > player.nextLevel) {
            player.level++;
            player.maxLife = player.level * 100;
            player.life = player.maxLife;
            player.maxMana = player.level * 60;
            player.mana = player.maxMana;
            player.attack = player.level * 3;
            player.nextLevel = player.level * 300;


            return `${player.name} sube de nivel!!!`
        } else {
            return `${player.name} gana ${enemy.exp} puntos de experiencia`
        }
    };

    const updateCharacterData = () => {
        let enemy = enemies[enemyNum];
        let datosPersonaje = document.getElementById("datosPersonaje")
        datosPersonaje.childNodes[1].innerHTML = "<span>Nombre </span>" + player.name;
        datosPersonaje.childNodes[3].innerHTML = `<span>Vida </span> <progress class="progresoVida" value="${player.life}" max=${player.maxLife}>`;
        datosPersonaje.childNodes[5].innerHTML = `<span>Mana </span> <progress class="progresoMana" value="${player.mana}" max=${player.maxMana}>`;
        datosPersonaje.childNodes[7].innerHTML = "<span>Exp </span>" + player.exp;
        datosPersonaje.childNodes[9].innerHTML = "<span>LvL </span>" + player.level;

        $("#enemyLifeBar").attr("value", `${enemy.life}`).attr("max", `${enemy.maxLife}`);

    };


    updateCharacterData(player);

    $("#botonEscapar").on("click", escapar);
    $("#botonAtaque").on("click", physicAttack);
    $("#botonMagia").on("click", showMagicButtons);
    $("#playMusic").on("click", {song: "main"}, playMusic);


    $("#evento0").on("click", showCombatWindow);
    $("#evento1").on("click", showCombatWindow);
    $("#evento2").on("click", showCombatWindow);

}
