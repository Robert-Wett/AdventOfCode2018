let input = require('fs').readFileSync('./input/day7.txt', { encoding: 'utf8' })

input =
`Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;

class Node {
	constructor(label, children=[], parent) {
		this.label = label;
		this.children = children;
		this.parent = parent;
	}
}

// board... as in circuit board?
let board = {};

input.split('\n').forEach(line => {
	const [, parent, child] = /Step (.) [a-z ]+(.)/gm.exec(line);
	// Lookup node from board or create a new one and return that
	const node = board[parent] || (board[parent] = new Node(parent));
	// Push the child label value for lookups
	node.children.push(child);
	// Add the child to the board with this as it's parent
	if (!board[child]) {
		board[child] = new Node(child, [], node.label);
	}
});

const getStartingCircuits = (board) => Object.keys(board).map(k => board[k].parent ? null : k).filter(Boolean);

console.log(getStartingCircuits(board));
