// Mengambil elemen dari HTML
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");

// Status permainan
let gameStarted = false;

// Fungsi tombol mulai
startButton.addEventListener("click", function() {

    if (gameStarted === true) {
        return;
    }

    gameStarted = true;

    message.textContent = "Hari 1 dimulai. Bertahanlah!";
    startButton.textContent = "PERMAINAN DIMULAI";
    startButton.disabled = true;

});
