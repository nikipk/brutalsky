const socket = io({ transports: ["websocket"], upgrade: false });
socket.connect("http://" + document.location.host);
console.log("client Started", socket);
