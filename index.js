window.onload=function () {
     class Personaje{
        constructor(nombre,nivel) {
            this.nombre=nombre;
            this.nivel=nivel;
            this.maxVida=this.nivel*100;
            this.vida=this.maxVida;
            this.maxMana=this.nivel*60;
            this.mana=this.maxMana
            this.ataque=this.nivel*3;
            this.experiencia=0;
            this.siguienteNivel=100;
            this.magias=[
                {
                    nombre:"Bola de fuego",
                    tipo:"fuego",
                    mana:15,
                    daño:30
                },
                {
                    nombre:"Rayo",
                    tipo:"Rayo",
                    mana:10,
                    daño:20
                }
            ]
        }
    }

    document.getElementById("empiezaAventura").addEventListener("click", function() {
        let nombrePersonaje=document.getElementById("inputNombre").value;
        window.localStorage.setItem("personaje",JSON.stringify(new Personaje(nombrePersonaje,1)));
    })
}
