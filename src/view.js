export default class View {
    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;
        this.picer = true;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.blockWidth = this.width / columns;
        this.blockHeight = this.height / rows;

        this.element.appendChild(this.canvas);

    }

    render({
        playField,
        score,
        hiScote,
        speedGame,
        goal,
        lives,
        losing
    }) {
        this.clearScreen();
        this.renderPlayField(playField);
        this.menuRender(score, hiScote, speedGame, goal, lives);

        this.picer = !this.picer
        this.losingGame(losing, lives)
    };

    //отрисовать закрашеный блок
    createActivBlock(x, y) {
        this.context.lineWidth = 4;
        this.context.strokeStyle = 'rgba(0, 0, 0, 1)'
        this.context.strokeRect(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight)

        this.context.fillStyle = 'rgb(153, 168, 130)';
        this.context.fillRect(x * this.blockWidth + 2, y * this.blockHeight + 2, this.blockWidth - 4, this.blockHeight - 4);

        this.context.fillStyle = 'rgb(0, 0, 0)';
        this.context.fillRect((x * this.blockWidth) + 7, (y * this.blockHeight) + 7, this.blockWidth - 15, this.blockHeight - 15);
    }

    //отрисовать не закрашеный блок
    createInactiveBlock(x, y) {
        this.context.strokeStyle = 'rgba(0, 0, 0, 0.2)'
        this.context.strokeRect(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight)

        this.context.fillStyle = 'rgba(125, 155, 143, 0.2)';
        this.context.fillRect(x * this.blockWidth + 2, y * this.blockHeight + 2, this.blockWidth - 4, this.blockHeight - 4);

        this.context.fillStyle = 'rgba(0, 0, 0,0.2)';
        this.context.fillRect((x * this.blockWidth) + 7, (y * this.blockHeight) + 7, this.blockWidth - 15, this.blockHeight - 15);
    }

    //заполнение холста
    renderPlayField(playField) {
        this.clearScreen();
        for (let y = 0; y < playField.length - 3; y++) {
            for (let x = 0; x < playField[y].length; x++) {
                const block = playField[y][x];

                if (block) {
                    this.createActivBlock(x, y)
                } else {
                    this.createInactiveBlock(x, y)
                }

            }
        }
    }

    // отрисовать меню
    menuRender(score, hiScote, speedGame, goal, lives) {
        this.context.font = "28px Verdana"
        //Score
        this.context.fillText('Score', 460, 50)
        this.context.fillText(score, 490 - score.toString().length * 7, 85)
        //Hi-Score
        this.context.fillText('Hi-Score', 440, 130)
        this.context.fillText(hiScote, 490 - hiScote.toString().length * 7, 170);
        //speedGame
        this.context.fillText('Speed', 460, 450)
        this.context.fillText(speedGame, 490, 485);
        //goal
        this.context.fillText('Goal', 470, 560)
        this.context.fillText(goal + '/50', 480 - goal.toString().length * 7, 600);
        //lives
        for (let x = 10; x < 15; x++) {
            for (let y = 5; y < 9; y++) {
                if (y == 8) {
                    if (lives != 0) {
                        lives -= 1;
                        this.createActivBlock(x, y)
                    } else {
                        this.createInactiveBlock(x, y)
                    }
                } else {
                    this.createInactiveBlock(x, y)
                }
            }

        }
    }

    // текст возобновить игру клавишей Enter 
    losingGame(losing, lives) {
        if (lives == 0 && losing && this.picer) {
            this.context.font = "bold 40px Verdana"
            this.context.fillStyle = 'rgb(0, 0, 0)';
            this.context.fillText('GAME OVER', 65, 390)
            this.context.font = "bold 21px Verdana"
            this.context.fillStyle = 'rgb(0, 0, 0)';
            this.context.fillText('click the Enter to continue', 45, 420)
            return
        }
        if (losing && this.picer) {
            this.context.font = "bold 21px Verdana"
            this.context.fillStyle = 'rgb(0, 0, 0)';
            this.context.fillText('click the Enter to continue', 45, 390)
        }

    }

    // отчистить поле
    clearScreen() { //отчистка холста от всего
        this.context.clearRect(0, 0, this.width, this.height);
    }


}