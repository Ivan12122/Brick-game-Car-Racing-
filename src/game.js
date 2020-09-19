export default class Game {
    score = 0;
    hiScore = localStorage.getItem('hiScore') || 0;
    speedGame = 0;
    goal = 0;
    lives = 4;

    audioTurn = new Audio('./audio/turn.mp3')
    audioCrash = new Audio('./audio/crash.mp3')
    audioLevelUp = new Audio('./audio/levelUp.mp3')
    audioHiScore = new Audio('./audio/hiScore.mp3')

    speed = 200;
    losing = false;
    isSpeedUp = false;
    playField = this.createPlayField();
    gameCar = {
        x: 2,
        y: 16,
        blocks: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
            [1, 0, 1]
        ]
    };

    bedCar = {
        x: this.randomInt(),
        y: -4,
        bedBlocks: [
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]
    };

    bedCar1 = {
        x: this.randomInt(),
        y: this.bedCar.y - this.positionBedCarOnY(),
        bedBlocks: [
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]
    };

    bedCar2 = {
        x: this.randomInt(),
        y: this.bedCar1.y - this.positionBedCarOnY(),
        bedBlocks: [
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]
    };

    //рандомное число для позиции машинки по x
    randomInt() {
        const random = Math.floor(Math.random() * Math.floor(2));
        if (random) {
            return 5
        }
        return 2
    }

    //определение положения плохой машинки по шкале y
    positionBedCarOnY() {
        return Math.floor(8 + Math.random() * (11 - 8));
    }

    //сетер Стейта
    getState() {
        const playField = this.createPlayField()

        //пройгрыш
        if (this.losing) {
            return {
                playField,
                score: this.score,
                hiScote: this.hiScore,
                speedGame: this.speedGame,
                goal: this.goal,
                lives: this.lives,
                losing: this.losing
            }
        }

        //отобразить машинку на поле
        for (let y = 0; y < this.gameCar.blocks.length; y++) {
            for (let x = 0; x < this.gameCar.blocks[y].length; x++) {
                if (this.gameCar.blocks[y][x]) {
                    playField[this.gameCar.y + y][this.gameCar.x + x] = this.gameCar.blocks[y][x];
                }
            }
        }

        //движение плохих машинок
        for (let y = 0; y < this.bedCar.bedBlocks.length; y++) {
            for (let x = 0; x < this.bedCar.bedBlocks[y].length; x++) {
                if (this.bedCar.bedBlocks[y][x]) {
                    playField[this.bedCar.y + y][this.bedCar.x + x] = this.bedCar.bedBlocks[y][x];
                    if (this.bedCar1.y >= -4) {
                        playField[this.bedCar1.y + y][this.bedCar1.x + x] = this.bedCar1.bedBlocks[y][x];
                    }
                    if (this.bedCar2.y >= -4) {
                        playField[this.bedCar2.y + y][this.bedCar2.x + x] = this.bedCar2.bedBlocks[y][x];
                    }
                }
            }
        }
        return {
            playField,
            score: this.score,
            hiScote: this.hiScore,
            speedGame: this.speedGame,
            goal: this.goal,
            lives: this.lives
        };
    }

    // сетeр скорости
    getSpeed() {
        return this.speed
    }

    // создание пустого массива -10 на -22
    createPlayField() {
        const playField = [];

        for (let y = -10; y < 23; y++) {
            playField[y] = [];

            for (let x = 0; x < 10; x++) {
                if (x == 0 || x == 9) {
                    playField[y][x] = 1;
                } else {
                    playField[y][x] = 0;
                }
            }
        }
        return playField;
    }

    // сдвиг игрока в лево
    movePieceLeft() {
        this.gameCar.x -= 3;
        this.audioTurn.load()
        this.audioTurn.play()
        if (this.isPiceceOutOfBounds()) {
            this.gameCar.x += 3;
        }
    }

    //сдвиг игрока в право
    movePieceRigth() {
        this.gameCar.x += 3;
        this.audioTurn.load()
        this.audioTurn.play()
        if (this.isPiceceOutOfBounds()) {
            this.gameCar.x -= 3;
        }
    }

    // Логика плохих машин
    moveBedCarDown() {

        if (this.losing) {
            return
        }

        this.levUp()

        this.crashCar(this.bedCar)
        this.crashCar(this.bedCar1)
        this.crashCar(this.bedCar2)

        this.bedCar.y += 1;
        this.bedCar1.y += 1
        this.bedCar2.y += 1;

        this.crashCar(this.bedCar)
        this.crashCar(this.bedCar1)
        this.crashCar(this.bedCar2)


        if (this.bedCar.y > 19) {
            this.bedCar.y = this.bedCar2.y - this.positionBedCarOnY();
            this.bedCar.x = this.randomInt();
            this.score += 100;
            this.hiScoreUp();
            this.goal += 1;
        }

        if (this.bedCar1.y > 19) {
            this.bedCar1.y = this.bedCar.y - this.positionBedCarOnY();
            this.bedCar1.x = this.randomInt();
            this.score += 100;
            this.hiScoreUp();
            this.goal += 1;
        }

        if (this.bedCar2.y > 19) {
            this.bedCar2.y = -4
            this.score += 100;
            this.hiScoreUp();
            this.goal += 1;
            if (this.bedCar2.y - this.bedCar1.y <= 8) {
                this.bedCar2.x = this.bedCar1.x
            } else {
                this.bedCar2.x = this.randomInt();
            }
        }

    }

    // не даёт машинке уйти за поле
    isPiceceOutOfBounds() {
        const {
            y: pieceY,
            x: pieceX,
            blocks
        } = this.gameCar;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (pieceX < 2 || pieceX > 7) {
                    return true;
                }
            }
        }

        return false;
    }

    //проверка на аварию
    crashCar(car) {
        const {
            x: x0,
            y: y0,
        } = this.gameCar

        const {
            x: x1,
            y: y1
        } = car

        for (let i = 0; i < 4; i++) {
            for (let x = 0; x < 4; x++) {
                if ((y0 + i == y1 + x) && (x0 == x1)) {
                    this.losing = true;
                    this.bedCar.y = -4;
                    this.bedCar1.y = this.bedCar.y - this.positionBedCarOnY();
                    this.bedCar2.y = this.bedCar1.y - this.positionBedCarOnY();
                    this.audioCrash.play();
                    this.lives -= 1;
                    return
                }
            }
        }
    }

    // начать уровень снова
    newGame() {
        if (this.losing) {
            this.losing = false;
            if (this.lives == 0) {
                this.lives = 4;
                this.score = 0;
                this.goal = 0;
                this.speedGame = 0;
                this.speed = 200;
            }
        }
    }

    // удерживание клавиши вверх для увеличения скорости
    upSpeed() {
        if (this.isSpeedUp == false) {
            this.speed -= 100;
            this.isSpeedUp = true
        }
    }

    // отмена увелечения скорости
    downSpeed() {
        this.speed += 100;
        this.isSpeedUp = false
    }

    // поднятие уровня
    levUp() {
        if (this.goal == 50) {
            this.speed -= 25;
            this.goal = 0;
            this.speedGame += 1;
            this.audioLevelUp.play();
        }
    }

    //запись в localstorage 
    hiScoreUp() {
        const hiScore = localStorage.getItem('hiScore')
        if (+hiScore < this.score) {
            this.audioHiScore.play();
            this.hiScore += 100;
            localStorage.setItem('hiScore', this.score.toString())
        }
    }

}