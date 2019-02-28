const canvasHeight = 600;
const canvasWidth = 1000;
let ctx;
let keyPresses = [];
let playerName = "player";
let player;
let level;

window.onload = () => {
  const socket = io({ transports: ["websocket"], upgrade: false });
  const canvas = document.getElementById("canvas");
  canvas.tabIndex = 1000;
  canvas.style.outline = "none";
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  ctx = canvas.getContext("2d");

  document.getElementById("cookieButton").addEventListener("click", () => {
    socket.emit("cookies");
  });
  document.getElementById("setLobby").addEventListener("click", () => {
    let lobbyName = document.getElementById("lobbyNameInput").value;
    socket.emit(
      "join",
      (data = { lobbyName: lobbyName, playerName: playerName })
    );
  });
  document.getElementById("setName").addEventListener("click", () => {
    playerName = document.getElementById("playerNameInput").value;
    document.getElementById("playerName").innerHTML = "Name: " + playerName;
  });
  document.getElementById("canvas").addEventListener("keydown", event => {
    if (!keyPresses.includes(event.keyCode)) {
      keyPresses.push(event.keyCode);
    }
  });
  document.getElementById("canvas").addEventListener("keyup", event => {
    let index;
    for (let i = 0; i < keyPresses.length; i++) {
      if (keyPresses[i] == event.keyCode) {
        index = i;
      }
    }
    keyPresses.splice(index, 1);
  });

  socket.connect("http://" + document.location.host);
  socket.on("cookies", cookies => {
    let output = cookies + " cookies!";
    document.getElementById("cookieCounter").innerHTML = output;
  });
  socket.on("upd_playerData", data => {
    console.log(data);
    player = data;
  });
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
  socket.on("upd_level", data => {
    level = data;
    console.log("received levelData:", level);
  });
  gameLoop();
};

function gameLoop() {
  setInterval(() => {
    setTimeout(() => {
      //console.log(keyPresses);
      ctx.fillStyle = "#393e46";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      level.blocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(
          block.position.x,
          block.position.y,
          block.width,
          block.height
        );
      });

      keyPresses.forEach(key => {
        if (key == 87) {
          player.position.y -= 5;
        } else if (key == 65) {
          player.position.x -= 5;
        } else if (key == 83) {
          player.position.y += 5;
        } else if (key == 68) {
          player.position.x += 5;
        }
      });

      if (player.position.x < 0) {
        player.position.x = canvasWidth;
      } else if (player.position.x > canvasWidth) {
        player.position.x = 0;
      }
      if (player.position.y < 0) {
        player.position.y = canvasHeight;
      } else if (player.position.y > canvasHeight) {
        player.position.y = 0;
      }

      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, 10, 0, 2 * Math.PI, false);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    }, 1000 / 60);
  }, 1000 / 60);
}
