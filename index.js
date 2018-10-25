const implementjs = require('implement-js');
const robin = require('roundrobin');
const { performance } = require('perf_hooks');
const implement = implementjs.default;
const { Interface, type } = implementjs;

const NUMBER_OF_REPETITIONS = 5000;

// The player interface
const IPlayer = Interface('IPlayer')({
    reset: type('function'), // Reset the player's memory before next match and set the player's color
    getDecision: type('function'), // Should return 0, 1 or 2
    updateWithResult: type('function') // Receives the result that is an array consisting the opponent's decision and the points from the last round
},{
    error: true,
    strict: true
});

// The game matrix
const game = [
    [ [3,3], [0,6], [6,0] ],
    [ [6,0], [3,3], [0,6] ],
    [ [0,6], [6,0], [3,3] ]
];

// The players list
const players = [
    ['rnd1', require('./players/RandomPlayer')],
    ['rnd2', require('./players/RandomPlayer')]
];
players.forEach((player) => {
    implement(IPlayer)(player[1]); // checks if all players implement the player interface
});
// The scoreboard
const scoreboard = [...Array(players.length).keys()].map(_ => [...Array(players.length)].fill(0));

// The competitions
const schedule = robin(players.length);
for (let i = 0; i < schedule.length; ++i) {
    for (let j = 0; j < schedule[i].length; ++j) {
        // A single match
        let match = schedule[i][j].map(x => x - 1);
        // Reset before the repetitions
        players[match[0]][1].reset('W');
        players[match[1]][1].reset('K');
        for (let g = 0; g < NUMBER_OF_REPETITIONS; ++g) {
            // Get decisions
            let start = performance.now();
            let a = players[match[0]][1].getDecision();
            if (performance.now() - start > 1000) {
                throw `The player ${players[match[0]][0]} exceeded the timeout.`;
            }
            start = performance.now();
            let b = players[match[1]][1].getDecision();
            if (performance.now() - start > 1000) {
                throw `The player ${players[match[1]][0]} exceeded the timeout.`;
            }
            // Result
            let result = game[a][b];
            players[match[0]][1].updateWithResult([b, result[0]]);
            players[match[1]][1].updateWithResult([a, result[1]]);
            // Update scoreboard
            scoreboard[match[0]][match[1]] += result[0];
            scoreboard[match[1]][match[0]] += result[1];
            // Display the last repetition info
            console.log(`[${g+1}] ${players[match[0]][0]} ${scoreboard[match[0]][match[1]]}`
                + `:${scoreboard[match[1]][match[0]]} ${players[match[1]][0]}`);
        }
        console.log('');
        console.log('The current scoreboard:');
        console.log(' '.repeat(8) + players.reduce((carry, player) => carry + '|' + player[0].padStart(8, ' '), ''));
        scoreboard.forEach((a,b) => {
            console.log(players[b][0].padStart(8, ' ') + a.reduce((carry, score) => carry + '|' + (''+score).padStart(8, ' '), ''));
        });
    }
}

