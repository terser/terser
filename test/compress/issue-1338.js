comment_1562957781: {
    options = {
        unused: true,
        evaluate: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        'use strict';

        const DEBUG = false;

        function initPlayer() { // eslint-disable-line
            const player = new createPlayer();

            return player;
        }

        function createPlayer() {
            if (DEBUG) {
                console.log('-> new player');
            }

            this.destroy = () => {
                if (DEBUG) {
                    console.log('-> destroyed player');
                }
            };
        }

        initPlayer();
    }
    expect: {
        'use strict';

        function createPlayer() {
            if (false)
                console.log('-> new player');

            this.destroy = () => {
                if (false)
                    console.log('-> destroyed player');
            };
        }

        (function () { // eslint-disable-line
            const player = new createPlayer();

            return player;
        })()
    }
}
