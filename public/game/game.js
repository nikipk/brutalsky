const socket = io({ transports: ["websocket"], upgrade: false });

/**
 * event listeners
 */
window.addEventListener("load", function () {
    window.game = new Game();
    window.game.resize(
        window.innerWidth,
        window.innerHeight
    );

    document.getElementById("setLobby").addEventListener("click", () => {
        let lobbyName = document.getElementById("lobbyNameInput").value;
        socket.emit("join", { lobbyName: lobbyName, playerName: playerName });
    });
    document.getElementById("setName").addEventListener("click", () => {
        window.game.player.name = document.getElementById("playerNameInput").value;
        document.getElementById("playerName").innerHTML = "Name: " + window.game.player.name;
        socket.emit("update_name", window.game.player.name);
    });

    loop();
});
window.addEventListener("resize", function () {
    window.game.resize(
        window.innerWidth,
        window.innerHeight
    );
});

//socket io
socket.connect("http://" + document.location.host);
socket.on("alert", data => {
    window.alert(data);
});
socket.on("upd_lobbyList", data => {
    let table = document.getElementById("lobbyTable");
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    data.forEach(lobby => {
        let newRow = table.insertRow(table.rows.length);
        let name = newRow.insertCell(0);
        let players = newRow.insertCell(1);
        let nameText = document.createTextNode(lobby.name);
        let playersText = document.createTextNode(lobby.players);
        name.appendChild(nameText);
        players.appendChild(playersText);
    });
});
socket.on("upd_lobby", data => {
    document.getElementById("playerLobby").innerHTML = "Lobby: " + data;
});

socket.on("updatePlayers", data => {
    console.log("--\nupd_players");
    window.game.changeEntities(data);
});

















let lastFrameTimeMs = new Date().getTime();
let maxFPS = 60;

let keys = [];

document.addEventListener('keydown', function (event) {
    keys[event.code] = true;
});

document.addEventListener('keyup', function (event) {
    keys[event.code] = false;
});

function loop() {
    if (new Date().getTime() > lastFrameTimeMs + (1000 / maxFPS)) {
        game.logic();
        lastFrameTimeMs = lastFrameTimeMs + (1000 / maxFPS);
    }

    game.update();
    requestAnimationFrame(loop);
}

class Game {
    constructor() {
        this.player = {
            index: -1,
            name: "player",
            model: Game.ENTITY_KING,
            animation: Game.ANIMATION_WALK,
            animationFrame: 0,
            x: 240 / 11 * 6,
            y: 240 / 11 * 3
        };
        this.entities = [];

        this.canvasElm = document.createElement("canvas");

        this.worldSpaceMatrix = new mat3();

        this.gl = this.canvasElm.getContext("webgl2");
        this.gl.clearColor(93 / 255, 152 / 255, 141 / 255, 1.0);
        this.gl.enable(this.gl.BLEND);

        document.getElementById("gameElements").appendChild(this.canvasElm);

        let vs = document.getElementById("vs_01").innerHTML;
        let fs = document.getElementById("fs_01").innerHTML;

        this.finalBuffer = new BackBuffer(this.gl, { width: 512, height: 240 });
        this.backBuffer = new BackBuffer(this.gl, { width: 512, height: 240 });

        this.sprites = {
            "explosion": new Sprite(this.gl, "resources/images/sprites/explosion.png", vs, fs, { width: 96, height: 96 }),
            "walker": new Sprite(this.gl, "resources/images/sprites/walker.png", vs, fs, { width: 64, height: 64 }),
            "tiles": new Sprite(this.gl, "resources/images/tiles.png", vs, fs, { width: 16, height: 16 }),
            "vine": new Sprite(this.gl, "resources/images/vine.png", vs, fs, { width: 30, height: 30 }),
            "tree": new Sprite(this.gl, "resources/images/tree.png", vs, fs, { width: 74, height: 128 }),
            "characters": new Sprite(this.gl, "resources/images/characters.png", vs, fs, { width: 32, height: 32 }),
            "attack": new Sprite(this.gl, "resources/images/swoosh.png", vs, fs, { width: 32, height: 32 }),
        };

        this.gatherRenderables("resources/map/testMap");
    }

    async gatherRenderables(path) {
        let map;
        try {
            this.renderables = {
                layers: [
                    {
                        blendmode: Game.BLENDMODE_ALPHA, objs: [
                            {
                                sprite: "tree",
                                position: { x: 125, y: 0 },
                                frame: { x: 0, y: 0 },
                                flip: false,
                                blendmode: Game.BLENDMODE_ALPHA,
                                options: { scalex: 240 / 128, scaley: 240 / 128 }
                            }
                        ]
                    }
                ]
            };

            for (let index = 0; index < 4; index++) {
                map = await fetch(path + "/layer" + index + ".bru").then(response => response.text());
                let line = map.split("\n");
                for (let i = 0; i < line.length; i++) {
                    let point = line[i].split(",");
                    for (let j = 0; j < point.length; j++) {
                        if (point[j] !== "-") {
                            let points = point[j].split("/");
                            this.renderables.layers[0].objs.push(
                                {
                                    sprite: "tiles",
                                    position: { x: i * 240 / 11, y: j * 240 / 11 },
                                    frame: { x: points[0], y: points[1] },
                                    flip: false,
                                    blendmode: Game.BLENDMODE_ALPHA,
                                    options: { scalex: 15 / 11, scaley: 15 / 11 }
                                }
                            );
                        }
                    }
                }
            }
        } catch (e) {
            alert("The map was unable to load!");
            console.log(e);
        }
    }

    resize(x, y) {
        let res = 240;
        this.canvasElm.width = x;
        this.canvasElm.height = y;

        let wRatio = x / y * res;
        this.worldSpaceMatrix = new mat3().transition(-1, 1).scale(2 / wRatio, -2 / res);
    }

    setBuffer(buffer) {
        let gl = this.gl;
        if (buffer instanceof BackBuffer) {
            this.gl.viewport(0, 0, buffer.size.x, buffer.size.y);
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer.fbuffer);
        } else {
            this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }

    setBlendmode(bm) {
        switch (bm) {
            case Game.BLENDMODE_ALPHA:
                this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
                break;
            case Game.BLENDMODE_ADDITIVE:
                this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
                break;
            case Game.BLENDMODE_MULTIPLY:
                this.gl.blendFunc(this.gl.DST_COLOR, this.gl.ZERO);
                break;
        }
    }

    changeEntities(data) {
        console.log("remove old entities");
        for (let i = 0; i < this.entities.length; i++) {
            this.renderables.layers[0].objs.splice(this.entities[i]);
        }
        this.entities = [];

        console.log("add to render");
        for (let i = 0; i < data.length; i++) {
                this.renderables.layers[0].objs.push(
                    {
                        sprite: "characters",
                        position: { x: data[i].position.x, y: data[i].position.y },
                        frame: { x: 0, y: i % 3 },
                        flip: false,
                        blendmode: Game.BLENDMODE_ALPHA,
                        options: {}
                    }
                );
                this.entities.push(this.renderables.layers[0].objs.length - 1);
        }
        console.log("reading render list");
        //console.log(this.renderables.layers);
        for (let i = 0; i < this.entities.length; i++) {
            console.log(this.renderables.layers[0].objs[this.entities[i]]);
        }
    }

    update() {
        if (this.renderables != null) {
            for (let i = 0; i < this.renderables.layers.length; i++) {
                let layer = this.renderables.layers[i];
                this.setBuffer(this.backBuffer);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);

                for (let l = 0; l < layer.objs.length; l++) {
                    let obj = layer.objs[l];
                    let sprite = this.sprites[obj.sprite];

                    this.setBlendmode(obj.blendmode);
                    sprite.render(obj.position, obj.frame, obj.options);
                }

                this.setBlendmode(layer.blendmode);
                this.setBuffer(this.finalBuffer);
                this.backBuffer.render();
            }
            this.setBuffer();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.setBlendmode(Game.BLENDMODE_ALPHA);
            this.finalBuffer.render();

            this.gl.flush();
        }
    }

    logic() {
        let inc = 240 / 11 / 30;
        if (keys['KeyW']) {
            this.player.y = this.player.y - inc;
        }
        if (keys['KeyS']) {
            this.player.y = this.player.y + inc;
        }
        if (keys['KeyA']) {
            this.worldSpaceMatrix = this.worldSpaceMatrix.transition(inc, 0);
            this.player.x = this.player.x - inc;
        }
        if (keys['KeyD']) {
            this.worldSpaceMatrix = this.worldSpaceMatrix.transition(-inc, 0);
            this.player.x = this.player.x + inc;
        }

        socket.emit("update_position", {
            x: this.player.x,
            y: this.player.y
        });

    }
}

Game.ANIMATION_WALK = [0, 1, 2, 3];
Game.ANIMATION_JUMPPREP = [4];
Game.ANIMATION_JUMPUP = [5];
Game.ANIMATION_JUMPDOWN = [6];
Game.ANIMATION_JUMPLAND = [7];
Game.ANIMATION_HIT = [8, 9, 8];
Game.ANIMATION_SLASH = [10, 11, 12];
Game.ANIMATION_PUNCH = [13, 11];
Game.ANIMATION_RUN = [14, 15, 16, 17];
Game.ANIMATION_CLIMB = [18, 19, 20, 21];
Game.ANIMATION_BACK = [22];

Game.BLENDMODE_ALPHA = 0;
Game.BLENDMODE_ADDITIVE = 1;
Game.BLENDMODE_MULTIPLY = 2;

Game.ENTITY_BUDDHA = 0;
Game.ENTITY_KING = 1;
Game.ENTITY_ELF = 2;
Game.ENTITY_SNAIL = 3;