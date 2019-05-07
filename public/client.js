let playerName = "player";

const socket = io({ transports: ["websocket"], upgrade: false });

/**
 * lobbyElements
 */
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
  socket.emit("update_name", playerName);
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
  //receive player positions
});

/**
 * game loop
 */
gameLoop();

function gameLoop() {
  setInterval(() => {
    setTimeout(() => {

      //send new position to server to server
      socket.emit("update_position", {});

      //draw


    }, 1000 / 60);
  }, 1000 / 60);
}
