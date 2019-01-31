const socket = io({ transports: ["websocket"], upgrade: false });
socket.connect("http://192.168.107.196:6969");
console.log("client Started", socket);
