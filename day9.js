class Player {
	constructor(id) {
		this.id = id;
		this.score = 0;
	}
}

const simulateGame = (numPlayers, lastMarble) => {
	const players = [];
	for (let i = 0; i < numPlayers; i++) {
		players.push(new Player(i));
	}

	let turn = 1;
	let board = [0];

	for (turn; turn <= lastMarble; turn++) {
		let player = players[turn % (numPlayers - 1)];
		if (turn === 1) {
			board.push(turn);
		} else {
			board = takeTurn(board, player, turn);
		}
	}

	return players;
};

const takeTurn = (board, player, marble) => {
	const prevMarbleIdx = board.indexOf(marble - 1);
	if (marble % 23 === 0) {
		player.score += marble;
		let offset =
			prevMarbleIdx - 7 > 0 ? prevMarbleIdx - 7 : board.length - Math.abs(prevMarbleIdx - 7);

		player.score += board.splice(offset, offset + 1)[0];
		return board;
	}
	// Regular marble
	let newMarbleIdx = (prevMarbleIdx + 2) % board.length;
	return board
		.slice(0, newMarbleIdx)
		.concat([marble])
		.concat(board.slice(newMarbleIdx, board.length));
};

let output = '';
const tests = () => {
	let passed = true;
	[
		{
			input: {
				numPlayers: 7,
				highMarble: 25
			},
			expected: 32
		},
		{
			input: {
				numPlayers: 10,
				highMarble: 1618
			},
			expected: 8317
		},
		{
			input: {
				numPlayers: 13,
				highMarble: 7999
			},
			expected: 146373
		},
		{
			input: {
				numPlayers: 17,
				highMarble: 1104
			},
			expected: 2764
		},
		{
			input: {
				numPlayers: 21,
				highMarble: 6111
			},
			expected: 54718
		},
		{
			input: {
				numPlayers: 30,
				highMarble: 5807
			},
			expected: 37305
		}
	].forEach(({ input, expected }, index) => {
		try {
			const players = simulateGame(input.numPlayers, input.highMarble);
			const actual = players.reduce((acc, p) => {
				if (acc > p.score) return acc;
				return p.score;
			}, 0);
			if (actual !== expected) {
				output += `\n Failed test #${index + 1}: Expected ${expected}, got ${actual}.`;
				passed = false;
			}
		} catch (e) {
			console.log(e);
			passed = false;
		}
	});

	console.log(output);
	if (!passed) {
		process.exit(1);
	}
};

tests();
