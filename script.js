const player = document.getElementById("player");

let playerX = 50;
let playerY = 50;
let speed = 2;

function movePlayer(direction) {
    if (!gameStarted) return;

    if (direction === "up") playerY -= speed;
    if (direction === "down") playerY += speed;
    if (direction === "left") playerX -= speed;
    if (direction === "right") playerX += speed;

    playerX = Math.max(3, Math.min(97, playerX));
    playerY = Math.max(5, Math.min(95, playerY));

    player.style.left = playerX + "%";
    player.style.top = playerY + "%";
}

document.getElementById("up").onclick = () => movePlayer("up");
document.getElementById("down").onclick = () => movePlayer("down");
document.getElementById("left").onclick = () => movePlayer("left");
document.getElementById("right").onclick = () => movePlayer("right");
