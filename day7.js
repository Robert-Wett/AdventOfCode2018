let input = require('fs').readFileSync('./input/day7.txt', {
	encoding: 'utf8'
});

class Node {
	constructor(label, children = [], parents = []) {
		this.label = label;
		this.children = children;
		this.parents = parents;
		this.blown = false;
	}

	// This node is only reachable if all of it's parent fuses have
	// been blown.
	isLive() {
		return this.parents.filter((p) => !p.blown).length === 0;
	}
}

// board... as in circuit board?
let board = {};

// Build it
input.split('\n').forEach((line) => {
	const [, parent, child] = /Step (.) [a-z ]+(.)/gm.exec(line);
	// Lookup node from board or create a new one and return that
	const node = board[parent] || (board[parent] = new Node(parent));
	// Push the child label value for lookups
	node.children.push(child);
	// Add the child to the board with this as it's parent
	if (!board[child]) {
		board[child] = new Node(child, [], [node]);
	} else {
		board[child].parents.push(node);
	}
});

// Figure out where to start
const getStartingCircuits = (board) =>
	Object.keys(board)
		.map((k) => (board[k].parents.length ? null : k))
		.filter(Boolean);

// Figure out where it ends so we know to prioritize it last
const getEndingCircuits = (board) =>
	Object.keys(board)
		.map((k) => (board[k].children.length ? null : k))
		.filter(Boolean);

const partOne = (board) => {
	let openCircuits = getStartingCircuits(board);
	let endingCircuits = getEndingCircuits(board);
	const path = [];
	while (openCircuits.length) {
		let nextKey = openCircuits.sort().shift();
		board[nextKey].blown = true;
		path.push(nextKey);
		openCircuits = openCircuits.concat(
			board[nextKey].children.filter(
				(child) =>
					!board[child].blown &&
					endingCircuits.indexOf(child) === -1 &&
					openCircuits.indexOf(child) === -1 &&
					board[child].isLive()
			)
		);
	}

	return path.concat(endingCircuits.sort()).join('');
};

console.log(partOne(board));
