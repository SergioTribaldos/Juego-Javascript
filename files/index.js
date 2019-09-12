window.onload=function () {
     class Player{
        constructor(name,level) {
            this.name=name;
            this.level=level;
            this.maxLife=this.level*100;
            this.life=this.maxLife;
            this.maxMana=this.level*60;
            this.mana=this.maxMana
            this.attack=this.level*3;
            this.exp=0;
            this.nextLevel=100;
            this.magic=[
                {
                    name:"Bola de fuego",
                    type:"fuego",
                    mana:15,
                    damage:30
                },
                {
                    name:"Rayo",
                    type:"Rayo",
                    mana:10,
                    damage:20
                },
                {
                    name:"Hielo",
                    type:"Hielo",
                    mana:20,
                    damage:40
                }
            ]
        }
    }

    document.getElementById("empiezaAventura").addEventListener("click", function() {

        let characterName=document.getElementById("inputNombre").value;
        window.localStorage.setItem("player",JSON.stringify(new Player(characterName,1)));
    })
}
