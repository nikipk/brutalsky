window.onload = async function() {
    let vertexShaderText;
    let fragmentShaderText;
    try {
        vertexShaderText = await fetch("./shader/shader.vert");
        fragmentShaderText = await fetch("shader/shader.frag");
    } catch (e) {
        alert("The shaders were unable to load!");
        console.log(e);
    }
}

//
// Main render loop
//
let running = true;
let loop = function() {
    if (running) {
        requestAnimationFrame(loop);
    }
}
requestAnimationFrame(loop);