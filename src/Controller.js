export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;

        this.GG()
    }

    GG() {
        setTimeout(() => { // таймер движения машинки
            this.game.moveBedCarDown();
            this.view.render(this.game.getState());
            this.GG()
        }, this.game.getSpeed())
    }

}