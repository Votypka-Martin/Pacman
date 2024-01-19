//trida pro datovou strukturu zasobnik
//se zasobniky se v programovani setkate pomerne casto
//i kdyz je nebudete sami vytvaret vsechny programovaci jazyky zasobniky pouzivaji napriklad pri ukladani vstupnich parametru funkci
//zasobnik je pamet typu LIFO (last in first out)
//jeho opakem je fronta - pamet typu FIFO (first in first out)
//princip zasobniku v programovani je stejny jako u normalnich zasobniku
//posledni prvek, ktery do zasobniku vlozite, bude prvni, ktery z nej vytahnete
class Stack {
    constructor(maxSize) {
        this.items = new Array(maxSize);
        this.index = 0;
    }
    //vlozeni prvku do zasobniku
    push(item) {
        this.items[this.index++] = item;
    }
    //vyjmuti prvku ze zasobniku
    pop() {
        return this.items[--this.index];
    }
    //ziskani poctu prvku v zasobniku
    get length() {
        return this.index;
    }
}
//trida definujici vlastnosti bunky bludiste
class Cell {
    constructor(x, y) {
        this.index = -1;
        this.closed = false;
        this.startDistance = 0;
        this.targetDistance = 0;
        this.x = x;
        this.y = y;
    }

    get value() {
        return this.startDistance + this.targetDistance;
    }
    
    get copy() {
        return new Cell(this.x, this.y);
    }
}
//datova struktura "binarni halda"
//tato datova struktura je pouzita pri hledani nejvyhodnejsi bunky v algoritmu A*
//data jsou ukladana do pole, ale takovym zpusobem, aby hledani maxima ci minima bylo vyhodnejsi
//data jsou v teto strukture usporadana do stromu, kde kazda bunka ma maximalne dva potomky
//index prvniho potomka je (i * 2 + 1) a druheho (i * 2 + 2), kde i je index rodice
//vsechny prvky v teto datove strukture museji splnovat, ze hodnota rodice je mensi nez hodnota jeho potomku (minheap - nejmensi hodnota v poli je na vrcholu stromu), nebo vetsi nez jeho potomku (maxheap - nejvetsi hodnota v poli je na vrcholu stromu)
//pri pouziti teto datove struktury je nejvyhodnejsi bunka nalezena daleko rychleji (casova narocnost nalezeni a odstraneni prvku na vrcholu stromu je O(log n) = logaritmicka oproti O(n) = linearni v pripade prochazeni celeho pole {n je pocet prvku v poli})
class BinaryHeap {
    constructor(size, compareFunc) {
        this.items = new Array(size);
        this.size = 0;
        this.compareFunc = compareFunc;
    }

    notEmpty() {
        return this.size > 0;
    }

    clear() {
        this.size = 0;
    }
    //metoda pro pridani prvku do struktury
    //prvek je pridan na konec struktury a nasledne je vynesen do spravneho mista
    //casova narocnost teto operace je O(log n)
    add(item) {
        if (this.size == this.items.length) return;
        this.items[this.size] = item;
        item.index = this.size;
        this.sortUp(this.size);
        this.size++;
    }
    //pri zmene hodnoty prvku ve strukture je prvek vynesen nahoru (pokud splnuje podminku ze jeho rodic ma mensi hodnotu (minheap) potom zustava na miste) a dolu (pokud splnuje podminku, ze jeho deti maji vetsi hodnoty (minheap), potom zustava na miste), na poradi operaci nezalezi
    updateItem(item) {
        this.sortUp(item.index);
        this.sortDown(item.index);
    }
    //metoda pro vyneseni prvku nahoru
    sortUp(index) {
        let parentIndex = (index - 1) >> 1;
        while(index > 0 && this.compareFunc(this.items[index], this.items[parentIndex])) {
            this.swap(index, parentIndex);
            index = parentIndex;
            parentIndex = (index - 1) >> 1;
        }
    }
    //metoda pro sneseni prvku dolu
    sortDown(index) {
        let fisrtChildIndex = index * 2 + 1;
        let secondChildIndex = index * 2 + 2;
        while(true) {
            if (fisrtChildIndex > this.size - 1) break;
            let childIndex = fisrtChildIndex;
            if (!(secondChildIndex > this.size - 1)) {
                if (this.compareFunc(this.items[secondChildIndex], this.items[fisrtChildIndex])) {
                    childIndex = secondChildIndex;
                }
            }
            if (this.compareFunc(this.items[childIndex], this.items[index])) {
                this.swap(childIndex, index);
                index = childIndex;
                fisrtChildIndex = index * 2 + 1;
                secondChildIndex = index * 2 + 2;
                continue;
            }
            break;
        }      
    }
    //vrati provek na vrcholu struktury
    getFisrt() {
        return this.items[0];
    }
    //vrati provek na vrcholu struktury a odstrani jej ze struktury
    pop() {
        if (this.size == 0) return;
        let item = this.items[0];
        item.index = -1;
        this.size--;
        this.items[0] = this.items[this.size];
        item.index = 0;
        this.sortDown(0);
        return item;
    }
    //prohodi prvky na danych indexech
    swap(index1, index2) {
        let item1 = this.items[index1];
        let item2 = this.items[index2];
        this.items[index1] = item2;
        this.items[index2] = item1;
        item1.index = index2;
        item2.index = index1;
    }
}
//trida pro hledani cesty v grafu (grafem je myslena jakakoliv struktura, kde jsou mezi sebou jednotlive bunky propojeny a ne graf funkce)
//pro hledani je pouzit algoritmus A*
//ten je zalozen na ohodnocovani bunek v zavislosti na vzdalenosti od cile a od pocatecni pozice
class PathFinder {
    //map je rozozeni grafu ve kterem bude cesta hledana a notWall je funkce, ktera definuje jake bunky jsou zdi a jake ne
    constructor(map, notWall) {
        this.xSize = map[0].length;
        this.ySize = map.length;
        this.size = this.xSize * this.ySize;
        this.notWall = notWall;
        //vytvoreni binarni haldy pro hledani nejkratsi cesty z pocatecni pozice do cilove
        this.minHeap = new BinaryHeap(this.size, (a, b) => {
            if (a.value == b.value) return a.startDistance < b.startDistance;
            return a.value < b.value;
        });
        //vytvoreni binarni haldy pro hledani dlouhe cesty z pocatecni pozice do cilove (cesta, ktera bude nalezena nebude nejdelsi existujici, ale pro ucel hry pacman to vadit nebude)
        this.maxHeap = new BinaryHeap(this.size, (a, b) => {
            if (a.value == b.value) return a.targetDistance > b.targetDistance;
            return a.value > b.value;
        });
        //vytvoreni pole ve kterem budou ochovany vsechny bunky ktere nejsou zdi
        this.freeCells = [];
        this.map = this.#createMap(map);
        this.wallStack = new Stack(this.freeCells.length);
    }
    //funkce pro pridani zdi do mapy
    //aby bylo mozne zdi odstranit jsou bunky, ktere byly predtim volne ulozeny do zasobniku
    //teoreticky by nebylo nutne bunky ukladat do zasobniku protoze je vzdy vkladana pouze jedna zed, ale pro pripad, ze by bylo treba vkladat zdi vic jsem metodu realizoval timto zpusobem
    placeWall(x, y) {
        this.wallStack.push(this.map[y][x]);
        this.map[y][x] = undefined;
    }
    //ostraneni vsech vlozenych zdi
    removeAddedWalls() {
        while(this.wallStack.length > 0) {
            let cell = this.wallStack.pop();
            this.map[cell.y][cell.x] = cell;
        }
    }
    //vrati zda je bunka na dane pozice zed
    isCellWall(x, y) {
        return this.map[y][x] == undefined;
    }
    //vytvori mapu z bunek
    #createMap(map) {
        let res = new Array(this.ySize);
        for (let i = 0; i < this.ySize; i++) {
            res[i] = new Array(this.xSize);
            for (let j = 0; j < this.xSize; j++) {
                if (this.notWall(map[i][j])) {
                    res[i][j] = new Cell(j, i);
                    this.freeCells.push(res[i][j]);
                }
            }
        }
        return res;
    }
    //vrati vsechny bunky, ktere s bunkou na dane pozici sousedi
    //pokud by bylo dovoleno pohybovat se po diagonale bylo by vyhodnejsi pouzit pro ziskani bunek cyklus
    //akorat by byla ignorovana bunka se souradnicemi rovnymi x a y
    getNeighbours(x, y) { 
        let neighbours = new Array(4);
        let index = 0;
        if (x - 1 >= 0) neighbours[index++] = this.map[y][x - 1];
        if (x + 1 < this.xSize) neighbours[index++] = this.map[y][x + 1];
        if (y - 1 >= 0) neighbours[index++] = this.map[y - 1][x];
        if (y + 1 < this.ySize) neighbours[index++] = this.map[y + 1][x];
        neighbours.length = index;
        return neighbours;
    }
    //metoda ktera vrati kratkou cestu
    findShortPath(startX, startY, targetX, targetY) {
        this.openCells();
        let path = this.#findPath(startX, startY, targetX, targetY, this.minHeap, (a, b) => a < b);
        this.minHeap.clear();
        return path;
    }
    //metoda ktera vrati dlouhou cestu
    findLongPath(startX, startY, targetX, targetY) {
        this.openCells();
        let path = this.#findPath(startX, startY, targetX, targetY, this.maxHeap, (a, b) => a > b);
        this.maxHeap.clear();
        return path;
    }
    //resetuje vsechny bunky, ktere nejsou zdi
    openCells() {
        for (let i = 0; i < this.freeCells.length; i++) {
            const cell = this.freeCells[i];
            cell.closed = false;
            cell.index = -1;
            cell.child = undefined;
        }
    }
    //algoritmus A*
    #findPath(startX, startY, targetX, targetY, heap, compareFunc) {
        let startCell = this.map[startY][startX];
        let targetCell = this.map[targetY][targetX];
        //pokud pocatecni nebo konecna pozice nejsou definovane, dojde k navratu
        if (!startCell || !targetCell) return;
        //vlozeni prvni bunky do datove struktury
        heap.add(startCell);
        //dokud neni datova struktura prazdna
        while(heap.notEmpty()) {
            //je ziskana bunka na vrcholu struktury
            let cell = heap.pop();
            //bunka je uzavrena => nebude mozne menit jeji hodnotu
            cell.closed = true;
            //pokud je bunka cil dojde k vraceni cesty
            if (cell === targetCell) {
                return this.createPath(startCell, targetCell);
            }
            //ziskani vsech sousedu bunky
            let neighbours = this.getNeighbours(cell.x, cell.y)
            for (let i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i];
                //pokud neni soused definovany(je zed) nebo je uzavreny, cyklus pokracuje dal
                if (!neighbour || neighbour.closed) continue;
                //jelikoz neni mozne pohybovat se po diagonale je vzdalenost vsech sousedu od soucasne bunky 1 a proto je vzdalenost sousada od zacatku rovna vzdalenosti soucasne bunky od zacatku + 1
                let neighbourCost = cell.startDistance + 1;
                //pokud je nova hodnota souseda vyhodnejsi nez predchozi a nebo pokud se soused nenachazi v datove strukture
                if (compareFunc(neighbourCost, neighbour.startDistance) || neighbour.index == -1) {
                    neighbour.startDistance = neighbourCost;
                    neighbour.targetDistance = this.getDistance(neighbour, targetCell);
                    neighbour.parent = cell;
                    if (neighbour.index == -1) heap.add(neighbour);
                    else heap.updateItem(neighbour);
                }
            }
        }
    }
    //vrati vzdalenost bunek v mape
    getDistance(cell1, cell2) {
        let x = Math.abs(cell1.x - cell2.x);
        let y = Math.abs(cell1.y - cell2.y);
        return x + y;
    }
    //vytvori cestu po ktere je mozne se dostat ze zacatku do cile
    //vsechny cesty jsou realizovany jako linkedlist
    //funkce akorat priradi potomky rodicum
    createPath(startCell, endCell) {
        let cell = endCell;
        //jelikoz je jedna instance pathfinderu pouzita pro vice objektu(vsechny duchy), je nutne vytvaret kopie jednotlivych bunek
        //pokud by kopie vytvoreny nebyly, doslo by k prepisovani potomku u jiz nalezenych cest
        //to vychazi z toho, ze pokazde kdyz je prirazovana hodnota objektu nove promene je zkopirovana akorat reference na dany objekt
        let copy = cell.copy;
        while (cell != startCell) {
            copy.parent = cell.parent.copy;
            cell.parent.child = cell;
            copy.parent.child = copy;
            cell = cell.parent;
            copy = copy.parent;
        }
        return copy.child;
    }
}