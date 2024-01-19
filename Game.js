//rozlozeni mapy - ■ = stena, H = stena spawnu duchu, D = dvere do spawnu, . = bod, o = silokoule, * = volny prostor ve spawnu (misto nej je mozne dat mezeru)
//pozadi hry je generovane na zaklade rozlozeni, tekze je mozne v poli provest zmeny, ktere povedou k jinemu rozlozeni sten
//zaroven rozlozeni slouzi k navadeni duchu a pacmana po mape
let layout = [
    //0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27
    ["■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■"],//0
    ["■", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "■", "■", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "■"],//1
    ["■", ".", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", ".", "■"],//2
    ["■", "o", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", "o", "■"],//3
    ["■", ".", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", ".", "■"],//4
    ["■", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "■"],//5
    ["■", ".", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", ".", "■"],//6
    ["■", ".", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", ".", "■"],//7
    ["■", ".", ".", ".", ".", ".", ".", "■", "■", ".", ".", ".", ".", "■", "■", ".", ".", ".", ".", "■", "■", ".", ".", ".", ".", ".", ".", "■"],//8
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", " ", "■", "■", " ", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//9
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", " ", "■", "■", " ", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//10
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//11
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", " ", "H", "H", "H", "D", "D", "H", "H", "H", " ", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//12
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", " ", "H", "*", "H", "*", "H", "*", "H", "H", " ", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//13
    [".", ".", ".", ".", ".", ".", ".", " ", " ", " ", "H", "*", "*", "*", "*", "*", "H", "H", " ", " ", " ", ".", ".", ".", ".", ".", ".", "."],//14
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", " ", "H", "*", "H", "*", "H", "*", "H", "H", " ", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//15
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", " ", "H", "H", "H", "H", "H", "H", "H", "H", " ", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//16
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//17
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", " ", "■", "■", "■", "■", "■", "■", "■", "■", " ", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//18
    ["■", "■", "■", "■", "■", "■", ".", "■", "■", " ", "■", "■", "■", "■", "■", "■", "■", "■", " ", "■", "■", ".", "■", "■", "■", "■", "■", "■"],//19
    ["■", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "■", "■", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "■"],//20
    ["■", ".", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", ".", "■"],//21
    ["■", ".", "■", "■", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", ".", "■", "■", "■", "■", ".", "■"],//22 
    ["■", "o", ".", ".", "■", "■", ".", ".", ".", ".", ".", ".", ".", ".", " ", ".", ".", ".", ".", ".", ".", ".", "■", "■", ".", ".", "o", "■"],//23 
    ["■", "■", "■", ".", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", ".", "■", "■", "■"],//24 
    ["■", "■", "■", ".", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", ".", "■", "■", "■"],//25 
    ["■", ".", ".", ".", ".", ".", ".", "■", "■", ".", ".", ".", ".", "■", "■", ".", ".", ".", ".", "■", "■", ".", ".", ".", ".", ".", ".", "■"],//26 
    ["■", ".", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", ".", "■"],//27 
    ["■", ".", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", ".", "■", "■", ".", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", ".", "■"],//28 
    ["■", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "■"],//29 
    ["■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■"],//30 
];

//promenna ve ktere bude ulozena instance bludiste
let maze;
//promenna ve ktere bude ulozena instance pacmana
let pacman;
//pole ve kterem budou ulozeny jednotlive instance duchu
let ghosts = new Array(3);
//pocatecni hodnota score
let score = 0;
//pocatecni pocet zivotu
let lives = 3;
//velikost jedne bunky v pixelech
let cellSize = 16;
//score, ktere se pricte po snedeni ducha
let ghostScore = 200;
//html element ve kterem bude vypsana hodnota score
let scoreText = document.getElementById("score");
scoreText.innerHTML = score;
//html element ve kterem bude vypsana hodnota zivotu
let livesText = document.getElementById("lives");
livesText.innerHTML = lives;
//platno do ktereho bude kreslena scena hry
let canvas = document.getElementById("canvas");
//nastaveni velikosti platna
canvas.width = layout[0].length * cellSize;
canvas.height = layout.length * cellSize;
//ziskani kontextu platna
let ctx = canvas.getContext("2d");
//nastaveni zarovnani vykreslovaneho textu na stred
ctx.textAlign = "center";
//promenna ve ktere bude ulozeno id intervalu, ktery bude slouzit jako herni smycka - jelikoz neni interval prerusovan je promenna zbytecna
let gameLoop;
//pole do ktereho budou ukladany vsechny timeouty, ktere bude v urcitem okamziku nutne prerusit
let timeouts = [new Timeout(), new Timeout(), new Timeout(), new Timeout(), new Timeout(), new Timeout(), new Timeout(), new Timeout()];
let huntGhostsTimeout = timeouts[0];
let huntEndTimeout = timeouts[1];
//nascteni zvukovych efektu
let eatPointSound = new Audio("pacman_eatpoint.wav");
let eatGhostSound = new Audio("pacman_eatghost.wav");
let eatPowerBallSound = new Audio("pacman_eatpowerball.wav");
let pacmanEndSound = new Audio("pacman_end.wav");

eatGhostSound.onended = () => {
    paused = false;
    lastTime = performance.now();
    timeouts.forEach(timeout => {timeout.resume()});
}

let paused = false;
//promenna do ktere bude nacten spritesheet s jednotlivymi obrazky, ktere budou ve hre pouzity
let spriteSheet = new Image();
//jelikoz obrazky nejsou v javasriptu nacteny ihned, je nutne s jejich pouzivani pockat az do chvile, kdy nacteny jsou a k tomu slouzi funkce onload
spriteSheet.onload = function() {
    //vytvoreni bludiste
    maze = new Maze(layout, spriteSheet, cellSize);
    //vytvoreni "navadecu"
    //navedec je vytvoren na zaklade rozlozeni mapy a funkce, ktera definuje co neni v rozlozeni stena
    //() => {} je zkracena syntaxe pro vytvoreni anonymni funkce
    let pathFinder = new PathFinder(layout, (cell) => {return cell == " " || cell == "." || cell == "o"});
    let startPathFinder = new PathFinder(layout, (cell) => {return cell == " " || cell == "." || cell == "o" || cell == "D" || cell == "*"});
    //vytvoreni instance pacmana
    pacman = new Pacman(spriteSheet, 14, 23, cellSize, pathFinder, pacmanEaten);
    //vytvoreni jednotlivych duchu
    ghosts[0] = new Ghost(spriteSheet, 11, 14, cellSize, pathFinder, startPathFinder, 0, 14, 11, pacman);
    ghosts[1] = new Ghost(spriteSheet, 13, 14, cellSize, pathFinder, startPathFinder, 2, 14, 11, pacman);
    ghosts[2] = new Ghost(spriteSheet, 15, 14, cellSize, pathFinder, startPathFinder, 3, 14, 11, pacman);
    //nastartovani herni smycky
    play();
    //aktivovani duchu
    activateGhosts();
}
//nastaveni souboru ve kterem je spritesheet ulozen
spriteSheet.src = "pac-man_spritesheet.png"

//funkce pro nsateveni smeru ve kterem se pacman pohybuje a pro restartovani hry
document.onkeydown = (e) => {
    if (!e) e = window.event;
    if (e.key == "w") pacman.changeDir(0, -1);
    else if (e.key == "a") pacman.changeDir(-1, 0);
    else if (e.key == "s") pacman.changeDir(0, 1);
    else if (e.key == "d") pacman.changeDir(1, 0);
    else if (lives == 0 && e.key == " ") {
        lives = 3;
        livesText.innerHTML = lives;
        score = 0;
        scoreText.innerHTML = score;
        maze = new Maze(layout, spriteSheet, cellSize);
        pacman.reset();
        resetGhosts();
        activateGhosts();
        resetSpeed();
        lastTime = performance.now();
    }
}

//pacman i duchove se pohybuji na zaklade rozdilu casu mezi soucasnym a predchozim snimkem
let lastTime = performance.now();
let time = 0;

function play() {
    if (!paused) {
        //pokud je pocet zivotu 0 a nebo se v bludisti nenachazi zadny bod je vyhodnocen konec hry
        if (lives > 0 && maze.havePoints()) {
            //vypocet rozdilu casu, ktery je pouzit pro pohyb a animaci pacmana i duchu
            let currentTime = performance.now();
            let dt = currentTime - lastTime;
            lastTime = currentTime;
    
            timeouts.forEach(timeout => timeout.tick(dt));
    
            //posun do novych poloh
            moveObjects(dt);
            //zmena vykreslovaneho obrazku
            updateImages(dt);
            //vykresleni sceny
            drawScene();
    
            let x = pacman.getX();
            let y = pacman.getY();
            //snedeni bodu
            eatPoint(x, y);
            //snedeni silokoule
            eatPowerBall(x, y);
            //snedeni ducha pokud utika, nebo pacmana pokud duch neutika
            eatPacmanOrGhosts();
        } else {
            if (maze.havePoints())drawGameOver();
            else{
                maze = new Maze(layout, spriteSheet, cellSize);
                pacman.reset();
                resetGhosts();
                increaseSpeed();
                activateGhosts();
                lastTime = performance.now();
            }
        }
    }
    requestAnimationFrame(play);
}

//vykresleni hlasky pokud je konec hry
function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "47px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.font = "21px Arial";
    ctx.fillText("PRESS SPACE TO RESTART", canvas.width / 2, canvas.height / 2 + 70);
}
//zmena obrazku duchu a pacmana
function updateImages(dt) {
    time += dt;
    //obrazek je zmenen kazdych 50 milisekund => 20x za sekundu
    if (time > 110){
        pacman.changeImage();
        ghosts.forEach(ghost => { ghost.changeImage() });
        time = 0;
    }
}
//vykreleni sceny
function drawScene() {
    maze.draw(ctx);
    pacman.draw(ctx);
    if (pacman.eaten) return;
    ghosts.forEach(ghost => { ghost.draw(ctx) });
}
//funkce pro pohyb duchu a pacmana
function moveObjects(dt) {
    //prevod z milisekund na sekundy
    dt /= 1000;
    pacman.move(dt);
    ghosts.forEach(ghost => { ghost.move(dt) });
    
}
//snedeni bodu, pokud se pacman nachazi na pozici, kde se bod nachazi
function eatPoint(x, y) {
    if (maze.isPoint(x, y)) {
        maze.eraseCell(x, y);
        score += 10;
        scoreText.innerHTML = score;
        playSound(eatPointSound);
    }
}
//snedeni silokoule, pokud se pacman nachazi na pozici, kde se silokoule nachazi
function eatPowerBall(x, y) {
    if (maze.isPowerBall(x, y)) {
        maze.eraseCell(x, y);
        playSound(eatPowerBallSound);
        //odstartovani loveni duchu
        huntGhosts();
    }
}
//funkce pro snedeni duchu a nebo pacmana
function eatPacmanOrGhosts() {
    //pokud je pacman jiz sneden neni nutne nic vyhodnocovat a je mozne z funkce vyskocit
    if (pacman.eaten) return;
    for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        //pokud jsou duch a pacman dostatecne blizko
        if (ghost.getPacmanDistance() < 1) {
            //pokud je mozne ducha snist
            if (ghost.canBeEaten()) {
                ghost.eatGhost();
                score += ghostScore;
                scoreText.innerHTML = score;
                timeouts[i + 5].setTimeout(activateGhost, 10000, ghost);
                playSound(eatGhostSound);
                drawEatenGhostScore(ghost);
                ghostScore *= 2;
                paused = true;
                return;
            //pokud muze duch snist pacmana
            } else if (ghost.canEatPacman()) {
                pacman.end();
                playSound(pacmanEndSound);
                return;
            }
        }  
    }
}
//funkce pro odstartovani lovu na duchy
function huntGhosts() {
    //pokud predchozi lov jeste neskoncil je vycisten timeout, ktery jej mel prerusit
    huntGhostsTimeout.clearTimeout();
    huntEndTimeout.clearTimeout();
    ghosts.forEach(ghost => { ghost.hunt() });
    //nasaveni ukonceni lovu za 10000 milisekund = 10 sekund
    huntGhostsTimeout.setTimeout(() => {
        ghosts.forEach(ghost => { ghost.huntEnd()});
        huntEndTimeout.setTimeout(() => {
            ghostScore = 200;
            ghosts.forEach(ghost => { ghost.run = false });
        }, 2000);
    }, 8000);
}
//aktivace ducha
function activateGhost(ghost) {
    ghost.prepare = true;
}
//aktivace vsech dochu s definovanym casovym rozestupem
function activateGhosts() {
    let t = 3000;
    for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        let timeout = timeouts[i + 2];
        timeout.setTimeout(activateGhost, t, ghost);
        t += 3000;
    }
}
//resetovani vsech dochu
function resetGhosts() {
    ghosts.forEach(ghost => { ghost.reset() });
}
//vycisteni vsech timeoutu
//nektere timeouty, jejichz id se v poli nachazi, jiz mohou byt dokonceny
//funkce clearTimeout ukonci timeout, ktery ukoncen nebyl, jinak neudela nic
function clearTimeouts() {
    timeouts.forEach(timeout => {timeout.clearTimeout()});
}

//funkce ktera definuje co se stane po animaci snedeni pacmana
function pacmanEaten() {
    lives--;
    livesText.innerHTML = lives;
    clearTimeouts();
    resetGhosts();
    if (lives > 0) activateGhosts();
}

//vyresetovani a prehrani zvuku
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

//funkce pro vykresleni skore snedeneho ducha
function drawEatenGhostScore(eatenGhost) {
    maze.draw(ctx);
    pacman.draw(ctx);
    ghosts.forEach(ghost => { if (ghost != eatenGhost) ghost.draw(ctx); });
    ctx.fillStyle = "white";
    ctx.font = "bold 11px Arial";
    ctx.strokeText(ghostScore, pacman.targetX * cellSize, pacman.targetY * cellSize + cellSize / 2);
    ctx.fillText(ghostScore, pacman.targetX * cellSize, pacman.targetY * cellSize + cellSize / 2);
}

function increaseSpeed() {
    pacman.speedMultiplier *= 1.1;
    ghosts.forEach(ghost => {ghost.speedMultiplier *= 1.1});
}

function resetSpeed() {
    pacman.speedMultiplier = 1;
    ghosts.forEach(ghost => {ghost.speedMultiplier = 1});
}