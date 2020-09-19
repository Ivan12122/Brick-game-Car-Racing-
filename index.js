import Game from './src/game.js'
import View from './src/view.js'
import Controller from './src/Controller.js'

const root = document.querySelector('#root');

const game = new Game();
const view = new View(root, 600, 800, 20, 15);
const controller = new Controller(game,view)

document.addEventListener('keydown', event => {//управление
    switch (event.keyCode) {
        case 37:
            game.movePieceLeft();
            view.render(game.getState());
            break;
        case 39:
            game.movePieceRigth();
            view.render(game.getState());
            break;
        case 13:
            game.newGame();
            break;
        case 38:
            game.upSpeed();
            break
    }
});

document.addEventListener('keyup', event => {//управление
    switch (event.keyCode) {
        case 38:
            game.downSpeed();
            break
    }
});