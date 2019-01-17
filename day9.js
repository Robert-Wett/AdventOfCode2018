class Player {
	constructor(id) {
		this.id = id;
		this.score = 0;
	}
}

class Node {
	constructor(val, next, prev) {
		this.value = val;
		this.prev = prev || this;
		this.next = next || this;
	}

	append(node) {
		node.prev = this;
		node.next = this.next;
		this.next.prev = node;
		this.next = node;
		return this.next;
	}

	remove() {
		this.prev.next = this.next;
		this.next.prev = this.prev;
		let replacementNode = this.next;
		this.prev = this.next = this.value = null;
		return replacementNode;
	}
}

const runGame = (numPlayers, lastMarble) => {
	const players = [];
	for (let i = 0; i < numPlayers; i++) {
		players.push(new Player(i));
	}

	let curNode = new Node(0);
	curNode = curNode.append(new Node(1));
	for (let turn = 2; turn <= lastMarble + 1; turn++) {
		let player = players[turn % numPlayers];
		if (turn % 23 === 0) {
			player.score += turn;
			curNode = curNode.prev.prev.prev.prev.prev.prev.prev;
			player.score += curNode.value;
			curNode = curNode.remove();
		} else {
			curNode = curNode.next.append(new Node(turn));
		}
	}

	return players.reduce((acc, p) => {
		if (acc > p.score) return acc;
		return p.score;
	}, 0);
}



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
				numPlayers: 9,
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
		},
		{
			input: {
				numPlayers: 441,
				highMarble: 71032
			},
			expected: 393229
		},
		{
			input: {
				numPlayers: 441,
				highMarble: 71032 * 100
			},
			expected: 3273405195
		}
	].forEach(({ input, expected }, index) => {
		try {
			let actual = runGame(input.numPlayers, input.highMarble);
			if (actual !== expected) {
				output += `\n Failed test #${index + 1}: Expected ${expected}, got ${actual}.`;
				passed = false;
			} else {
				output += `\n Passed test #${index + 1}: The high score with ${input.numPlayers} ` + 
							`players and a high marble of ${input.highMarble} is ${actual}`;
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

/**
 Passed test #1: The high score with 7 players and a high marble of 25 is 32
 Passed test #2: The high score with 9 players and a high marble of 25 is 32
 Passed test #3: The high score with 10 players and a high marble of 1618 is 8317
 Passed test #4: The high score with 13 players and a high marble of 7999 is 146373
 Passed test #5: The high score with 17 players and a high marble of 1104 is 2764
 Passed test #6: The high score with 21 players and a high marble of 6111 is 54718
 Passed test #7: The high score with 30 players and a high marble of 5807 is 37305
 Passed test #8: The high score with 441 players and a high marble of 71032 is 393229
 Passed test #9: The high score with 441 players and a high marble of 7103200 is 3273405195
 */