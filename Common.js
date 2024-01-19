class Mathf {
    //motoda pro postupny prevod jedne hodnoty na druhou v zavislosti na rychlosti zmeny
    static lerp(current, target, speed) {
        if (current > target) {
            current -= speed;
            if (current < target) return target;
        } else {
            current += speed;
            if (current > target) return target;
        }
        return current;
    }
}

class Processing {
    //motoda pro vyriznuti casti z obrazku a jeji preskalovani
    static getImage(sprites, x, y, originalSize, newSize) {
        let image = document.createElement("canvas");
        image.width = newSize;
        image.height = newSize;
        let ctx = image.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(sprites, x, y, originalSize, originalSize, 0, 0, newSize, newSize);
        return image;
    }
}

//trida pro jednodussi praci s funkcemi, ktere maji byt provedeny po urcitem case (vetsina metod teto tridy nebude v pacmanovi vyuzita a jsou zde pouze pro pripad vyuziti teto tridy v jinem projektu)
class Timeout {
    //vytvoreni ve tride pouzivanych promennych a nastaveni jejich pocatecnich hodnot
    constructor() {
        this.active = false;
        this.paused = false;
        this.currentTime = 0;
        this.endTime = 0;
    }
    //metoda pro nastaveni funkce, ktera ma byt po urcitem case provedena (args jsou argumenty funkce)
    setTimeout(func, time, ...args) {
        this.active = true;
        this.paused = false;
        this.currentTime = 0;
        this.endTime = time;
        this.func = () => {
            func(...args);
            this.active = false;
        };
    }
    //pricteni casu k soucasnemu a v pripade, kdy je soucasny cas vetsi nebo roven konecnemu, vyvolani funkce, ktera mela byt po uplinuti nastaveneho casu provedena
    tick(dt) {
        if (this.active && !this.paused) {
            this.currentTime += dt;
            if (this.currentTime >= this.endTime) this.func(); 
        }
    }
    //metoda pro prodlouzeni casu vyvolani nastavene metody
    increaseDuration(time) {
        this.endTime += time;
    }
    //metoda pro preruseni timeoutu
    clearTimeout() {
        this.active = false;
        this.paused = false;
    }
    //metoda pro pozastaveni timeoutu
    pause() {
        this.paused = true;
    }
    //metoda pro zruseni pozastaveni
    resume() {
        this.paused = false;
    }
    //metoda pro ziskani zbyvajiciho casu do vyvolani nastavene metody
    remainingTime() {
        return this.endTime - this.currentTime;
    }

 }