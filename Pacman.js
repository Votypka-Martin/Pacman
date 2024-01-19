//trida definujici vlastnisti objektu pacmana
class Pacman {
    //konstruktor tridy pacman
    //sprites je spritesheet ze ktereho jsou vyriznuty jednotlive obrazky pacmana
    //x a y je pocatecni poloha pacmana
    //cellsize je velikost jedne bunky bludiste
    //pathfinder je objekt pomoci ktereho bude probihat zjistovani, zda je dana bunka pro pacmana pristupna
    //afterEndAnimation je funkce, ktera ma byt provedena po tom co skonci animace snedeni pacmana
    //javascript podporuje funkcionalni programovani, takze funkce muze byt vstupni parametr do funkce jine
    constructor(sprites, x, y, cellSize, pathFinder, afterEndAnimation) {
        this.afterEndAnimation = afterEndAnimation;
        this.startX = x;
        this.startY = y;
        this.pathFinder = pathFinder;
        this.cellSize = cellSize;
        this.size = cellSize * 2;
        //vytvoreni poli definovane veliosti do kterych budou ulozeny obrazky, ktere se budou pri hre neustale stridat
        //pole jsou vytvorena pro kazdy smer pohybu
        //to neni nutne (je mozne vsechny ulozit do jednoho pole), ale ulehci to zmenu obrazku v zavislosti na smeru pohybu pacmana
        this.imagesLeft = new Array(3);
        this.imagesRight = new Array(3);
        this.imagesUp = new Array(3);
        this.imagesDown = new Array(3);
        //vyriznuti obrazku, ktery je pro vsechny smery stejny (zluta koule)
        let firstImage = Processing.getImage(sprites, 256, 16, 32, this.size);

        this.imagesRight[0] = firstImage;
        this.imagesRight[1] = Processing.getImage(sprites, 0, 16, 32, this.size);
        this.imagesRight[2] = Processing.getImage(sprites, 32, 16, 32, this.size);

        this.imagesLeft[0] = firstImage;
        this.imagesLeft[1] = Processing.getImage(sprites, 64, 16, 32, this.size);
        this.imagesLeft[2] = Processing.getImage(sprites, 96, 16, 32, this.size);

        this.imagesUp[0] = firstImage;
        this.imagesUp[1] = Processing.getImage(sprites, 128, 16, 32, this.size);
        this.imagesUp[2] = Processing.getImage(sprites, 160, 16, 32, this.size);

        this.imagesDown[0] = firstImage;
        this.imagesDown[1] = Processing.getImage(sprites, 192, 16, 32, this.size);
        this.imagesDown[2] = Processing.getImage(sprites, 224, 16, 32, this.size);
        //vyriznuti abrazku pro animaci po snedeni pacmana
        this.endImages = new Array(11);
        for (let i = 0; i < this.endImages.length; i++) {
            this.endImages[i] = Processing.getImage(sprites, (9 + i) * 32, 16, 32, this.size);
        }
        //reset je metoda, ktera nastavi pocatecni parametry
        //tato metoda je pouzivana rovnez pri snedeni pacmana a restartu hry
        //z tohoto duvodu jsou nektere parametry (ty, ktere se behem hry meni) nastavovany v samostatne funkci a ne rovnou v konstruktoru
        this.reset();
        this.speedMultiplier = 1;
        //nastaveni rychlosti pohybu
        this.speed = 7;
    }
    //metoda pro vykresleni pacmana do platna
    draw(ctx) {
        ctx.drawImage(this.currentImages[this.imageIndex], this.x * this.cellSize - this.cellSize / 2, this.y * this.cellSize - this.cellSize / 2);
        //plynuly prechod pruchodem uprostred bludiste z jedne strany na druhou
        if (this.x < 0) {
            ctx.drawImage(this.currentImages[this.imageIndex], (this.x + this.pathFinder.xSize) * this.cellSize - this.cellSize / 2, this.y * this.cellSize - this.cellSize / 2);
        } else if (this.x > this.pathFinder.xSize - 1) {
            ctx.drawImage(this.currentImages[this.imageIndex], (this.x - this.pathFinder.xSize) * this.cellSize - this.cellSize / 2, this.y * this.cellSize - this.cellSize / 2);
        }
    }
    //metoda pro odstartovani animace snedeni
    end() {
        this.imageIndex = 0;
        this.eaten = true;
        this.moving = false;
        this.currentImages = this.endImages;
    }
    //animace pacmana
    changeImage() {
        if (this.eaten) {
            this.imageIndex++;
            if (this.imageIndex == 11) {
                this.reset();
                this.afterEndAnimation();
            }
        } else if (this.moving) {
            this.imageIndex++;
            this.imageIndex %= 3;
        }
    }
    //nastaveni pocatecnich hodnot parametru, ktere se budou behom hry menit
    reset() {
        this.moving = false;
        this.eaten = false;
        this.x = this.startX;
        this.y = this.startY;
        this.targetX = this.startX;
        this.targetY = this.startY;
        this.imageIndex = 0;
        this.dirX = 0;
        this.dirY = 0;
        this.nextDirX = 0;
        this.nextDirY = 0;
        this.currentImages = this.imagesUp;
    }
    //metoda pro pohyb pacmana
    move(dt) {
        //pokud je pacaman sneden nehybej s nim
        if (this.eaten) return;
        //pokud se pacaman ma pohybovat posun soucasnou pozici smerem k cili v zavislosti na rychlosti
        if (this.moving) {
            this.x = Mathf.lerp(this.x, this.targetX, dt * this.speed * this.speedMultiplier);
            this.y = Mathf.lerp(this.y, this.targetY, dt * this.speed * this.speedMultiplier);
        }
        //pokud je soucasna pozice rovna cili
        if (this.x == this.targetX && this.y == this.targetY) {
            //pozice noveho cile
            let X = this.x + this.nextDirX;
            let Y = this.y + this.nextDirY;
            //pokud se novy cil nachazi na povolene bunce
            if (!(X <= -1 || X >= this.pathFinder.xSize) && !this.pathFinder.isCellWall(X, Y)) {
                this.targetX = X;
                this.targetY = Y;
                this.dirX = this.nextDirX;
                this.dirY = this.nextDirY;
                this.moving = true;
                this.changeImageDir();
            //pokud cil v nove nastavenem smeru neni na povolene bunce
            } else {
                //novy cil bude ve smeru soucasneho pohybu
                X = this.x + this.dirX;
                Y = this.y + this.dirY;
                //pokud je novy cil v miste pruchodu z jedne strany bludiste na druhou
                if (X <= -1 || X >= this.pathFinder.xSize) {
                    this.targetX = X;
                    //pokud jiz pacman zalezl za hranici platna je mu nastavena poloha na misto na druhe strane
                    if (X == -2) {
                        this.x = this.pathFinder.xSize - 1;
                        this.targetX = this.pathFinder.xSize - 2;
                    } else if (X == this.pathFinder.xSize + 1){
                        this.x = 0;
                        this.targetX = 1;
                    }
                //pokud novy cil neni za pruchodem a soucesne neni bunka noveho cile zed
                } else if (!this.pathFinder.isCellWall(X, Y)) {
                    this.targetX = X;
                    this.targetY = Y;
                    this.moving = true;
                //jinak je pohyb zastaven
                } else this.moving = false;
            }
        }     
    }
    //vrati zaokrouhlenou polohu x-ove souradnice pacmana 
    getX() {
        return Math.round(this.x);
    }
    //vrati zaokrouhlenou polohu y-ove souradnice pacmana
    getY() {
        return Math.round(this.y);
    }
    //zmena obrazku v zavislosti na smeru pohybu
    changeImageDir() {
        if (this.dirX == 1) {
            this.currentImages = this.imagesRight;
        } else if (this.dirX == -1) {
            this.currentImages = this.imagesLeft;
        } else if (this.dirY == 1) {
            this.currentImages = this.imagesDown;
        } else {
            this.currentImages = this.imagesUp;
        }

    }
    //zmena dalsiho smeru pohybu
    changeDir(x, y) {
        this.nextDirX = x;
        this.nextDirY = y;
    }
}
//trida definujici vlastnisti objektu ducha
class Ghost {
    //jednotlive stavy ve kterych se duch muze nachazet
    static state = {
        home : 0,
        prepare : 1,
        active : 2,
        run : 3,
        runEnd: 4,
        return : 5
    };
    //konstruktor tridy pacman
    //sprites je spritesheet ze ktereho jsou vyriznuty jednotlive obrazky ducha
    //x a y je pocatecni poloha ducha
    //cellsize je velikost jedne bunky bludiste
    //pathfinder je objekt pomoci ktereho bude mozne ziskat cestu bludistem
    //startPathFinder je to same jako pathfinder, akorat ma jinou definici toho co je zed a bude slouzit pro vyvedeni ducha ze spawnu
    //color bude urcovat polohu vyrizlych obrazku ze spritesheetu
    //initialTargetX a initialTargetY jsou parametry urcujici misto kam budou duchove navydeni ze spawnu
    //pacman je objekt pacmana ktereho budou duchove lovit
    constructor(sprites, x, y, cellSize, pathFinder, startPathFinder, color, initialTargetX, initialTargetY, pacman) {
        this.startX = x;
        this.startY = y;
        this.pacman = pacman;
        this.cellSize = cellSize;
        this.initialTargetX = initialTargetX;
        this.initialTargetY = initialTargetY;
        //vytvoreni cesty po ktere se budou duchove pohybovet ve spawnu
        //pocatecni cesta je vytvorena jako zacykleny linkedlist
        //pocatecni poloha je potomek konecne polohy, taze se duch bude ve spawnu neustale pohybovat sem a tam
        this.initialPath = new Cell(x, y);
        this.initialPath.child = new Cell(x, y + 1);
        this.initialPath.child.child = new Cell(x, y);
        this.initialPath.child.child.child = new Cell(x, y - 1);
        this.initialPath.child.child.child.child = this.initialPath;

        this.size = cellSize * 2;
        this.pathFinder = pathFinder;
        this.startPathFinder = startPathFinder;
        //vytvoreni poli pro obrazky stejne jako u pacmana
        this.imagesLeft = new Array(2);
        this.imagesRight = new Array(2);
        this.imagesUp = new Array(2);
        this.imagesDown = new Array(2);
        this.imagesRun = new Array(2);
        this.imagesRunEnd = new Array(4);
        //vytvoreni jednoprvkoveho pole je vetsinou uplna hloupost
        //zde jednoprvkove pole vytvarim z duvodu jednodussi zmeny mezi jednotlivymi obrazky
        //pouze se zmeni reference v promene currentImages na dane pole a nebude jiz nutne testovat, zda je reference nastavena na pole ci samostatny obrazek
        this.imagesEatenLeft = new Array(1);
        this.imagesEatenRight = new Array(1);
        this.imagesEatenUp = new Array(1);
        this.imagesEatenDown = new Array(1);

        this.imagesRight[0] = Processing.getImage(sprites, 0, 48 + color * 32, 32, this.size);
        this.imagesRight[1] = Processing.getImage(sprites, 32, 48 + color * 32, 32, this.size);

        this.imagesLeft[0] = Processing.getImage(sprites, 64, 48 + color * 32, 32, this.size);
        this.imagesLeft[1] = Processing.getImage(sprites, 96, 48 + color * 32, 32, this.size);

        this.imagesUp[0] = Processing.getImage(sprites, 128, 48 + color * 32, 32, this.size);
        this.imagesUp[1] = Processing.getImage(sprites, 160, 48 + color * 32, 32, this.size);

        this.imagesDown[0] = Processing.getImage(sprites, 192, 48 + color * 32, 32, this.size);
        this.imagesDown[1] = Processing.getImage(sprites, 224, 48 + color * 32, 32, this.size);

        this.imagesRun[0] = Processing.getImage(sprites, 0, 176, 32, this.size);
        this.imagesRun[1] = Processing.getImage(sprites, 32, 176, 32, this.size);

        this.imagesRunEnd[0] = this.imagesRun[0];
        this.imagesRunEnd[1] = this.imagesRun[1];
        this.imagesRunEnd[2] = Processing.getImage(sprites, 64, 176, 32, this.size);
        this.imagesRunEnd[3] = Processing.getImage(sprites, 96, 176, 32, this.size);

        this.imagesEatenRight[0] = Processing.getImage(sprites, 128, 176, 32, this.size);
        this.imagesEatenLeft[0] = Processing.getImage(sprites, 160, 176, 32, this.size);
        this.imagesEatenUp[0] = Processing.getImage(sprites, 192, 176, 32, this.size);
        this.imagesEatenDown[0] = Processing.getImage(sprites, 224, 176, 32, this.size);
        this.speedMultiplier = 1;
        this.speed = 7;
        //vzdalenost ve ktere se musi pacman nachazet, aby ho duchove zacali stihat
        //z optimalizacnich duvodu se jedna o kvadrat skutecne vzdalenosti
        //neni nutne pocitat odmocninu, ktera je na vypocet narocna => pomala
        this.distance = 100;

        this.reset();
    }
    //zjisteni, zda jiz bylo dosazeno cile cesty
    //vsechny cesty jsou realizovany jako linkedlist
    //staci tedy pouze zjistit zda soucasna bunka ma nejakeho potomka
    get targetReached() {
        return this.currentPath.child == undefined;
    }
    //nastaveni pocatecnich hodnot parametru, ktere se budou behom hry menit
    reset() {
        this.currentImages = this.imagesUp;
        this.imageIndex = 0;
        this.prepare = false;
        this.run = false;
        this.runEnd = false;
        this.return = false;
        this.currentState = Ghost.state.home;
        this.currentPath = this.initialPath; 
        this.speed = 7;
        this.x = this.startX;
        this.y = this.startY;
        this.lastX = this.x;
        this.lastY = this.y;
    }
    //vykresleni ducha stejnym zpusobem jako pacmana
    draw(ctx) {
        ctx.drawImage(this.currentImages[this.imageIndex], this.x * this.cellSize - this.cellSize / 2, this.y * this.cellSize - this.cellSize / 2);
        if (this.x < 0) {
            ctx.drawImage(this.currentImages[this.imageIndex], (this.x + this.pathFinder.xSize) * this.cellSize - this.cellSize / 2, this.y * this.cellSize - this.cellSize / 2);
        } else if (this.x > this.pathFinder.xSize - 1) {
            ctx.drawImage(this.currentImages[this.imageIndex], (this.x - this.pathFinder.xSize) * this.cellSize - this.cellSize / 2, this.y * this.cellSize - this.cellSize / 2);
        }
    }
    //animace ducha
    changeImage() {
        this.imageIndex++;
        this.imageIndex %= this.currentImages.length;
    }
    //stavovy automat urcujici chovani ducha
    //se stavovymi automaty se ve hrach setkate pomerne casto (v pripade ze budou ve hre nejaci nepretale prakticky vzdy bude jejich chovani realizovano jako stavovy automat)
    //existuji dva zakladni typy stavovych automatu
    //prvni je mealyho a druhy mooruv automat
    //vystup z mealyho automatu zavisi na soucasnem stavu a hodnote vstupnich promennych
    //vystup z moorova automatu zavisi pouze na aktualni stavu
    //oba automaty jsou si ekvivalentni => je mozne prevest mealyho automat na mooruv a naopak
    //pokud byste prevadeli mealyho automat na mooruv pridali byste akorat dalsi stavy do kterych by automat skocil po zmenene dane promenne a vystup by se menil az v techto stavech => spozdeni zpusobene nutnosti prejit do noveho stavu
    //tento automat je mealyho, nebot jeho vystup je zavisly jednak na stavech a jednak na vstupnich promennych
    changeState() {
        switch (this.currentState) {
            //stav ve kterem se duch nachazi kdyz je ve spawnu
            case Ghost.state.home:
                if (this.prepare) {
                    this.currentState = Ghost.state.prepare;
                    this.currentPath = this.startPathFinder.findShortPath(this.x, this.y, this.initialTargetX, this.initialTargetY);
                }
                else this.currentPath = this.currentPath.child;
                break;
            //stav ve kterem se duch nachazi kdyz jde ze spawnu do pocatecni pozice
            case Ghost.state.prepare:
                if (this.targetReached) {
                    this.currentState = Ghost.state.active;
                    this.currentPath = this.pathFinder.findShortPath(this.x, this.y, this.pacman.getX(), this.pacman.getY());
                    this.lastX = this.x;
                    this.lastY = this.y;
                    this.prepare = false;
                }
                else this.currentPath = this.currentPath.child;
                break;
            //stav ve kterem se duch nachazi kdyz lovi pacmana
            case Ghost.state.active:
                if (this.run) {
                    this.speed = 4;
                    this.currentState = Ghost.state.run;
                    this.currentPath = this.pathFinder.findLongPath(this.x, this.y, this.pacman.getX(), this.pacman.getY());
                }
                else if (this.pacmanInRange()) {
                    //aby bylo zabraneno duchovi menit smer na smer opacny k predeslemu je na predchozi pozici vlozena zed
                    if (this.lastX != this.x || this.lastY != this.y)this.pathFinder.placeWall(this.lastX, this.lastY);
                    this.currentPath = this.pathFinder.findShortPath(this.x, this.y, this.pacman.getX(), this.pacman.getY());
                    //vlozene zdi jsou po ziskani cesty odstraneny
                    this.pathFinder.removeAddedWalls();
                }
                else {
                    this.currentPath = this.getRandomCell();
                }
                if (!this.currentPath) this.currentPath = this.getRandomCell();
                this.lastX = this.x;
                this.lastY = this.y;
                break;
            //stav ve kterem se duch nachazi kdyz utika pred pacmanem
            case Ghost.state.runEnd:
                if (!this.runEnd) {
                    this.imageIndex = 0;
                    this.currentState = Ghost.state.run;
                }
            case Ghost.state.run:
                if (this.runEnd) this.currentState = Ghost.state.runEnd;
                if (this.return) {
                    this.speed = 7;
                    this.currentState = Ghost.state.return;
                    this.currentPath = this.startPathFinder.findShortPath(this.x, this.y, this.startX, this.startY);
                    this.run = false;
                    this.imageIndex = 0;
                } else if (!this.run) {
                    this.speed = 7;
                    this.currentState = Ghost.state.active;
                    this.currentPath = this.pathFinder.findShortPath(this.x, this.y, this.pacman.getX(), this.pacman.getY());
                    this.imageIndex = 0;
                } else { 
                    if (this.lastX != this.x || this.lastY != this.y)this.pathFinder.placeWall(this.lastX, this.lastY);
                    this.currentPath = this.pathFinder.findLongPath(this.x, this.y, this.pacman.getX(), this.pacman.getY());
                    this.pathFinder.removeAddedWalls();
                }
                this.lastX = this.x;
                this.lastY = this.y;
                break;
            //stav ve kterem se duch nachazi kdyz se vraci do spawnu potom co byl sneden
            case Ghost.state.return:
                if (this.targetReached) {
                    this.return = false;
                    this.currentState = Ghost.state.home;
                    this.currentPath = this.initialPath;
                } else this.currentPath = this.currentPath.child;
        }
    }
    //metoda pro pohyb ducha
    move(dt) {
        let targetX = this.currentPath.x;
        let targetY = this.currentPath.y;
        this.x = Mathf.lerp(this.x, targetX, dt * this.speed * this.speedMultiplier);
        this.y = Mathf.lerp(this.y, targetY, dt * this.speed * this.speedMultiplier);
        //pokud duch dosahl cile (dalsi bunky) dojde ke zmene stavu ducha
        if (this.x == targetX && this.y == targetY) {
            if (targetX == -1) this.x = this.pathFinder.xSize - 1;
            else if (targetX == this.pathFinder.xSize) this.x = 0;
            this.changeState();
            if (!this.currentPath) this.currentPath = this.getRandomCell();
            let dx = this.currentPath.x - this.x;
            let dy = this.currentPath.y - this.y;
            this.changeImageDir(dx, dy);
        }
    }
    //metoda urcujici zda je pacaman dostatecne blizko
    pacmanInRange() {
        return this.getPacmanDistance() < this.distance;
    }
    //metoda pro ziskani nahodne bunky, která je pro ducha pristupna
    //tato metoda je pouzita, pokud se pacman nachazi prilis daleko
    //tato metoda zaroven dovoluje duchovi prochazet pruchodem uprostred bludiste
    getRandomCell() {
        let index = 0;
        let cells = new Array(4);

        if (this.lastX != this.x || this.lastY != this.y) this.pathFinder.placeWall(this.lastX, this.lastY);
        
        let x = this.x + 1;
        let y = this.y;
        let cx = x;
        if (x >= this.pathFinder.xSize) x = 0;
        if (!this.pathFinder.isCellWall(x, y)) cells[index++] = new Cell(cx, y);

        x = this.x - 1;
        y = this.y;
        cx = x;
        if (x <= -1) x = this.pathFinder.xSize - 1;
        if (!this.pathFinder.isCellWall(x, y)) cells[index++] = new Cell(cx, y);

        x = this.x;
        y = this.y + 1;
        if (!this.pathFinder.isCellWall(x, y)) cells[index++] = new Cell(x, y);

        x = this.x;
        y = this.y - 1;
        if (!this.pathFinder.isCellWall(x, y)) cells[index++] = new Cell(x, y);

        index = Math.floor(Math.random() * index);

        this.pathFinder.removeAddedWalls();

        return cells[index];
    }
    //zmana vykreslovanych obrazku v zavislosti na smeru pohybu a aktualnim stavu
    changeImageDir(dx, dy) {
        if (this.currentState == Ghost.state.runEnd) this.currentImages = this.imagesRunEnd;
        else if (this.currentState == Ghost.state.run) this.currentImages = this.imagesRun;
        else {
            if (dx > 0) {
                if (this.currentState == Ghost.state.return) this.currentImages = this.imagesEatenRight;
                else this.currentImages = this.imagesRight;
            } else if (dx < 0) {
                if (this.currentState == Ghost.state.return) this.currentImages = this.imagesEatenLeft;
                else this.currentImages = this.imagesLeft;
            } else if (dy > 0) {
                if (this.currentState == Ghost.state.return) this.currentImages = this.imagesEatenDown;
                else this.currentImages = this.imagesDown;
            } else {
                if (this.currentState == Ghost.state.return) this.currentImages = this.imagesEatenUp;
                else this.currentImages = this.imagesUp;
            }
        }

    }
    //metoda pro ziskani kvadratu vzdalenosti pacmana od ducha
    getPacmanDistance() {
        let dx = this.x - this.pacman.x;
        let dy = this.y - this.pacman.y;
        return dx * dx + dy * dy;
    }
    //metoda ktera prevede ducha do stavu, kdy muze byt pacmanem uloven
    hunt() {
        if (this.currentState == Ghost.state.active || this.currentState == Ghost.state.runEnd) {
            this.runEnd = false;
            this.run = true;
        }
    }
    //metoda ktera prevede ducha do stavu, kdy duch bude blikat   
    huntEnd() {
        if (this.currentState != Ghost.state.run) return;
        this.runEnd = true;
    }
    //metoda, ktera vrati jestli je mozne ducha snist
    canBeEaten() {
        return (this.currentState == Ghost.state.run || this.currentState == Ghost.state.runEnd) && !this.return;
    }
    //metoda ktera vrati, zda duch muze snist pacmana
    canEatPacman() {
        return this.currentState == Ghost.state.active; 
    }
    eatGhost() {
        this.return = true;
        this.x = this.currentPath.x;
        this.y = this.currentPath.y;
    }
}
//trida definujici vlastnisti objektu blusdiste
class Maze {
    //layout je rozlozeni bludiste
    //sprites je spritesheet, ze ktereho jsou vyriznuty obrazky zdi
    //cellSize je velikost jedne bunky bludiste
    constructor(layout, sprites, cellSize) {
        //jelikoz se jednotlive promenne, ve kterych jsou ulozeny instance objektu chovaji pouze jako refernce, dojde pri prizani hodnoty jedne promenne druhe pouze ke zkopirovani odkazu na dany objekt a proto, aby v puvodnim rozlozeni nedochazelo ke zmenam pri sebrani bodu ci silokoule, je nutne vytvorit kopii puvodniho pole
        this.layout = this.getLayoutCopy(layout);
        this.cellSize = cellSize;
        //pocet bodu, ktere se v bludisti nachazi
        this.pointCount = 0;
        //obrazky normalnich zdi
        //puvodne jsem mel v planu mit jine obrazky pro vnitrni zdi a pro zdi na okraji bludiste
        //udelal jsem ale blbe spritesheet a uz jsem nestal o to ho predelavat, takze jsou zdi stejneho typu
        this.innerWallImages = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.innerWallImages[i] = Processing.getImage(sprites, i * 16, 0, 16, cellSize);
        }
        //obrazky zdi spawnu
        this.homeWallImages = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.homeWallImages[i] = Processing.getImage(sprites, (i + 24) * 16, 0, 16, cellSize);
        }
        //obrazky dveri do spawnu
        this.doorImages = new Array(4);
        for (let i = 0; i < 4; i++) {
            this.doorImages[i] = Processing.getImage(sprites, (i + 32) * 16, 0, 16, cellSize);
        }
        this.powerBallImage = Processing.getImage(sprites, 576, 0, 16, cellSize);
        this.ballImage = Processing.getImage(sprites, 592, 0, 16, cellSize);
        this.backgroundImage = this.createBackgroundImage();
        this.backgroundCtx = this.backgroundImage.getContext("2d");
        this.backgroundCtx.fillStyle = "black";
    }
    //metoda pro vytvoreni obrazku pozadi
    //tento obrazek je vytvoren pouze jednou (pri vytvoreni instance tridy Maze) a v prubehu hry jsou z nej pouze mazany sebrane body
    //to vede k podstatne lepsimu vykonu, nez pokud by byl obrazek pozadi generovan pri kazdem vykreslovani
    createBackgroundImage() {
        let image = document.createElement("canvas");
        image.width = this.layout[0].length * this.cellSize;
        image.height = this.layout.length * this.cellSize;
        let ctx = image.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, image.width, image.height);
        for (let i = 0; i < this.layout.length; i++) {
            for (let j = 0; j < this.layout[0].length; j++) {
                let cellImage;
                if (this.layout[i][j] == "■") {
                    let index = this.getWallCellType(i, j);
                    if (index == undefined) continue;
                    cellImage = this.innerWallImages[index];
                } else if (this.layout[i][j] == "H") {
                    let index = this.getWallCellType(i, j);
                    if (index == undefined) continue;
                    cellImage = this.homeWallImages[index];
                } else if (this.layout[i][j] == "D") {
                    cellImage = this.doorImages[0];
                } else if (this.layout[i][j] == ".") {
                    cellImage = this.ballImage;
                    this.pointCount++;
                } else if (this.layout[i][j] == "o") {
                    cellImage = this.powerBallImage;
                    this.pointCount++;
                } else continue;
                ctx.drawImage(cellImage, j * this.cellSize, i * this.cellSize);
            }
        }
        return image;
    }
    //metoda pro ziskani indexu obrazku, ktery ma byt vykrelen do vyslednoho pozadi
    //obrazek je volen na zakladne danych pravidel
    //je zjisteno, zda je dana bunka hrana, roh, ci vnitrni roh a take v jakem je smeru (pokud je vracena hodnota undefined nebude do pozadi vykresleno nic)
    getWallCellType(i, j) {
        if (i == 0 && j == 0) return 0;
        if (i == 0 && j == this.layout[0].length - 1) return 2;
        if (i == this.layout.length - 1 && j == 0) return 5;
        if (i == this.layout.length - 1 && j == this.layout[0].length - 1) return 7;

        let lE = this.isLeftEdge(i, j);
        let rE = this.isRightEdge(i, j);
        let uE = this.isUpperEdge(i, j);
        let loE = this.isLowerEdge(i, j);

        if (lE && uE) return 0;
        if (lE && loE) return 5;
        if (rE && uE) return 2;
        if (rE && loE) return 7;

        if (lE) return 4;
        if (rE) return 3;
        if (uE) return 1;
        if (loE) return 6;

        if (this.isUpperLeftInnerCorner(i, j)) return 7;
        if (this.isUpperRightInnerCorner(i, j)) return 5;
        if (this.isLowerLeftInnerCorner(i, j)) return 2;
        if (this.isLowerRightInnerCorner(i, j)) return 0;
    }

    isUpperEdge(i, j) {
        if (i == 0) return this.notWall(this.layout[i + 1][j]);
        return this.notWall(this.layout[i - 1][j]) && i != this.layout.length - 1;
    }

    isLowerEdge(i, j) {
        if (i == this.layout.length - 1) return this.notWall(this.layout[i - 1][j]);
        return this.notWall(this.layout[i + 1][j]) && i != 0;
    }

    isLeftEdge(i, j) {
        if (j == 0) return this.notWall(this.layout[i][j + 1]);
        return this.notWall(this.layout[i][j - 1]) && j != this.layout[0].length - 1;
    }

    isRightEdge(i, j) {
        if (j == this.layout[0].length - 1) return this.notWall(this.layout[i][j - 1]);
        return this.notWall(this.layout[i][j + 1]) && j != 0;
    }

    isUpperLeftInnerCorner(i, j) {
        if (i == 0 || j == 0) return false;
        return this.notWall(this.layout[i - 1][j - 1]);
    }

    isUpperRightInnerCorner(i, j) {
        if (i == 0 || j == this.layout[0].length - 1) return false;
        return this.notWall(this.layout[i - 1][j + 1]);
    }

    isLowerLeftInnerCorner(i, j) {
        if (i == this.layout.length - 1 || j == 0) return false;
        return this.notWall(this.layout[i + 1][j - 1]);
    }

    isLowerRightInnerCorner(i, j) {
        if (i == this.layout.length - 1 || j == this.layout[0].length - 1) return false;
        return this.notWall(this.layout[i + 1][j + 1]);
    }
    //funkce pro zjisteni zda dana bunka neni zed
    notWall(char) {
        return char == " " || char == "." || char == "o";
    }
    //vymazani bunky v pripade sebrani bodu ci silokoule
    eraseCell(x, y) {
        this.pointCount--;
        this.layout[y][x] = " ";
        this.backgroundCtx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
    //vykresleni obrazku pozadi
    draw(ctx) {
        ctx.drawImage(this.backgroundImage, 0, 0);
    }
    //zjisteni, zda je dana bunka bod
    isPoint(x, y) {
        return this.layout[y][x] == ".";
    }
    //zjisteni, zda je dana bunka silokoule
    isPowerBall(x, y) {
        return this.layout[y][x] == "o";
    }
    //vytvoreni kopie pole rozlozeni bludiste
    getLayoutCopy(layout) {
        let copy = new Array(layout.length);
        for (let i = 0; i < layout.length; i++) {
            copy[i] = new Array(layout[i].length);
            for (let j = 0; j < layout[i].length; j++) {
                copy[i][j] = layout[i][j];               
            }
        }
        return copy;
    }
    //funkce pro zjisteni, zda jsou v bludisti jeste nejake body nebo silokoule
    havePoints() {
        return this.pointCount > 0;
    }
}