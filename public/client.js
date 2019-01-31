window.onload = () => {
  const socket = io({ transports: ["websocket"], upgrade: false });
  //const socket = io.connect("http://192.168.1.107:6868");
  //socket.connect("http://" + document.location.host);
  socket.connect("http://192.168.1.107:6868");
  console.log("client Started", socket);

  socket.emit("join", "mainHub");

  document.getElementById("cookieButton").addEventListener("click", () => {
    console.log("adding 1 cookie");
    socket.emit("cookies");
  });

  socket.on("cookies", cookies => {
    console.log(cookies, " cookies!");
  });
};
