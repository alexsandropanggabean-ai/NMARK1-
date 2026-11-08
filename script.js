const startButton = document.getElementById("startButton");
const message = document.getElementById("message");
const statusText = document.getElementById("status");
const actionsDiv = document.getElementById("actions");

let day = 1;
let phase = "pagi";
let gameStarted = false;
let gameOver = false;
let ap = 3;
let darah = 100;
let log = "";

let inv = { kayu: 0, batu: 0 };
let tools = { kapak: false, pedang: false };
let turret = 0;
let baseBuilt = false;
let baseLoc = "";

function updateScreen() {
    if (!baseBuilt) {
        message.textContent = "Pasang api unggun dulu buat mulai waktu." + (log ? " | " + log : "");
    } else {
        message.textContent = "Hari " + day + " - " + phase.toUpperCase() + (log ? " | " + log : "");
    }
    statusText.textContent =
        "Darah: " + darah +
        (baseBuilt ? " | Tenaga: " + ap : "") +
        " | Kayu: " + inv.kayu + " | Batu: " + inv.batu +
        " | Kapak: " + (tools.kapak ? "✅" : "❌") +
        " | Pedang: " + (tools.pedang ? "✅" : "❌") +
        " | Turret: " + turret +
        " | Base: " + (baseBuilt ? "✅ (" + baseLoc + ")" : "❌");
    renderActions();
}

function makeButton(label, fn) {
    const b = document.createElement("button");
    b.textContent = label;
    b.onclick = function () {
        if (gameOver) return;
        if (baseBuilt && ap <= 0) { log = "Tenaga habis, klik LANJUT"; updateScreen(); return; }
        const wasBase = baseBuilt;
        if (fn() && wasBase) ap--;
        updateScreen();
    };
    actionsDiv.appendChild(b);
}

function renderActions() {
    actionsDiv.innerHTML = "";
    if (!gameStarted || gameOver) return;
    if (baseBuilt && phase !== "pagi") return;

    makeButton("🪓 Tebang pohon", chop);
    makeButton("⛏️ Menambang", mine);
    makeButton("🔨 Craft kapak (3 kayu, 2 batu)", craftAxe);
    makeButton("🗡️ Craft pedang (2 kayu, 3 batu)", craftSword);

    if (!baseBuilt) {
        makeButton("🔥 Pasang api unggun di HUTAN (+kayu)", function () { return placeBase("hutan"); });
        makeButton("🔥 Pasang api unggun di TAMBANG (+batu)", function () { return placeBase("tambang"); });
        makeButton("🔥 Pasang api unggun di DATARAN (seimbang)", function () { return placeBase("dataran"); });
    } else {
        makeButton("🔫 Craft turret (6 kayu, 4 batu)", craftTurret);
    }
}

function chop() {
    let hasil = tools.kapak ? 4 : 2;
    if (baseLoc === "hutan") hasil += 1;
    inv.kayu += hasil;
    log = "Dapat " + hasil + " kayu";
    return true;
}
function mine() {
    let hasil = 2;
    if (baseLoc === "tambang") hasil += 1;
    inv.batu += hasil;
    log = "Dapat " + hasil + " batu";
    return true;
}
function craftAxe() {
    if (tools.kapak) { log = "Kapak sudah punya"; return false; }
    if (inv.kayu < 3 || inv.batu < 2) { log = "Bahan kurang"; return false; }
    inv.kayu -= 3; inv.batu -= 2; tools.kapak = true;
    log = "Kapak jadi!";
    return true;
}
function craftSword() {
    if (tools.pedang) { log = "Pedang sudah punya"; return false; }
    if (inv.kayu < 2 || inv.batu < 3) { log = "Bahan kurang"; return false; }
    inv.kayu -= 2; inv.batu -= 3; tools.pedang = true;
    log = "Pedang jadi!";
    return true;
}
function craftTurret() {
    if (inv.kayu < 6 || inv.batu < 4) { log = "Bahan kurang"; return false; }
    inv.kayu -= 6; inv.batu -= 4; turret++;
    log = "Turret dipasang! Total: " + turret;
    return true;
}
function placeBase(lokasi) {
    baseBuilt = true;
    baseLoc = lokasi;
    ap = 3;
    startButton.disabled = false;
    startButton.textContent = "LANJUT";
    log = "Api unggun menyala di " + lokasi + "! Waktu mulai berjalan";
    return true;
}

function zombieAttack() {
    let zombie = 1 + Math.floor(day / 2);
    let dibunuh = turret * 2 + (tools.pedang ? 2 : 0);
    let sisa = Math.max(0, zombie - dibunuh);
    let damage = sisa * 10;
    darah -= damage;
    log = "🧟 " + zombie + " zombie nyerang. Dibunuh " + Math.min(zombie, dibunuh) + ", sisa " + sisa + " (darah -" + damage + ")";
}

function endGame(text) {
    gameOver = true;
    message.textContent = text;
    statusText.textContent = "";
    actionsDiv.innerHTML = "";
    startButton.disabled = true;
}

startButton.addEventListener("click", function () {
    if (!gameStarted) {
        gameStarted = true;
        startButton.textContent = "PERMAINAN DIMULAI";
        startButton.disabled = true; // aktif lagi setelah api unggun dipasang
        log = "Kumpulin bahan, terus pasang api unggun";
        updateScreen();
        return;
    }

    log = "";
    if (phase === "pagi") {
        phase = "malam";
        zombieAttack();
        if (darah <= 0) { endGame("💀 Lu mati diserang zombie di Hari " + day); return; }
    } else {
        phase = "pagi";
        day++;
        ap = 3;
        darah = Math.min(100, darah + 15);
    }

    if (day > 30) {
        endGame("Bantuan datang! Lu selamat 🎉");
        return;
    }
    updateScreen();
});
