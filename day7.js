let input = require('fs').readFileSync('./input/day7.txt', {
	encoding: 'utf8'
});

class Node {
	constructor(label, children = [], parents = [], timer) {
		this.label = label;
		this.children = children;
		this.parents = parents;
		this.blown = false;
		this.timer = timer;
	}

	// This node is only reachable if all of it's parent fuses have
	// been blown.
	isLive() {
		return this.parents.filter(p => !p.blown).length === 0;
	}
}

// Function for part 2; We're adding this to the graph building step to make
// things easier.
const getWaitTime = letter => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(letter) + 61;

const buildBoard = (input) => {
	// board... as in circuit board?
	let board = {};

	// Build it
	input.split('\n').forEach(line => {
		const [, parent, child] = /Step (.) [a-z ]+(.)/gm.exec(line);
		// Lookup node from board or create a new one and return that
		const node = board[parent] || (board[parent] = new Node(parent, [], [], getWaitTime(parent)));
		// Push the child label value for lookups
		node.children.push(child);
		// Add the child to the board with this as it's parent
		if (!board[child]) {
			board[child] = new Node(child, [], [node], getWaitTime(child));
		} else {
			board[child].parents.push(node);
		}
	});

	return board;
};


// Figure out where to start
const getStartingCircuits = board =>
	Object.keys(board)
		.map(k => (board[k].parents.length ? null : k))
		.filter(Boolean);

// Figure out where it ends so we know to prioritize it last
const getEndingCircuit = board =>
	Object.keys(board)
		.map(k => (board[k].children.length ? null : k))
		.filter(Boolean)[0];


/*
########     ###    ########  ########                    ##   
##     ##   ## ##   ##     ##    ##                     ####   
##     ##  ##   ##  ##     ##    ##                       ##   
########  ##     ## ########     ##                       ##   
##        ######### ##   ##      ##                       ##   
##        ##     ## ##    ##     ##                       ##   
##        ##     ## ##     ##    ##    ####### #######  ###### 
*/
const partOne = board => {
	const path = [];
	const endingCircuit = getEndingCircuit(board);
	let openCircuits = getStartingCircuits(board);

	while (openCircuits.length) {
		let nextKey = openCircuits.sort().shift();
		board[nextKey].blown = true;
		path.push(nextKey);
		openCircuits = openCircuits.concat(
			board[nextKey].children.filter(
				child =>
					!board[child].blown &&
					endingCircuit !== child &&
					openCircuits.indexOf(child) === -1 &&
					board[child].isLive()
			)
		);
	}

	return path.concat([endingCircuit]).join('');
};

console.log('Part one: ');
console.log(partOne(buildBoard(input)));




/*
d8888b.  .d8b.  d8888b. d888888b                 .d888b. 
88  `8D d8' `8b 88  `8D `~~88~~'                 VP  `8D 
88oodD' 88ooo88 88oobY'    88                       odD' 
88~~~   88~~~88 88`8b      88                     .88'   
88      88   88 88 `88.    88                    j88.    
88      YP   YP 88   YD    YP    C88888D C88888D 888888D 
*/

/**
 * Worker elf that is capable of taking the fuse and working on it
 * or w/e it's doing to it and blow the fuse. It then returns the
 * fuse.
 */
class Worker {
	constructor(id) {
		this.id = id;
		this.busy = false;
		this.jobTime = 0;
		this.fuse;
	}

	setFuse(fuse) {
		this.fuse = fuse;
		this.jobTime = fuse.timer;
		this.busy = true;
	}

	advancefuse(amount) {
		if (!this.busy) return;
		if (this.jobTime <= amount) {
			return this._releasefuse();
		}
		this.jobTime -= amount;
	}

	_releasefuse() {
		this.busy = false;
		this.jobTime = 0;
		this.fuse.blown = true;
		const fuse = this.fuse;
		this.fuse = null;
		return fuse;
	}
}
class WorkerPool {
	constructor(size = 5) {
		this.workTime = 0;
		this.pool = [];
		for (let i = 0; i < size; i++) {
			this.pool.push(new Worker(`${i}`));
		}
	}

	getMinTime() {
		return this.pool.reduce(
			(lowest, nextWorker) =>
				nextWorker.busy && nextWorker.jobTime < lowest ? nextWorker.jobTime : lowest,
			Number.MAX_SAFE_INTEGER
		);
	}

	assignWorkers(nodeArr, board) {
		if (nodeArr.length === 0) return [];
		const freeWorkers = this.pool.filter(w => w.jobTime === 0);
		const nodesToAssign = nodeArr.splice(0, freeWorkers.length);
		for (let i = 0; i < nodesToAssign.length; i++) {
			freeWorkers[i].setFuse(board[nodesToAssign[i]]);
		}

		return nodeArr;
	}

	work() {
		const tickAmt = this.getMinTime();
		this.workTime += tickAmt;
		const blownFuses = this.pool.map(w => w.advancefuse(tickAmt)).filter(Boolean);
		return blownFuses.sort((a, b) => a.label - b.label);
	}

	isWorking() {
		return this.pool.filter(w => w.jobTime !== 0).length > 0;
	}
}

const partTwo = board => {
	const NUM_WORKERS = 5;

	const pool = new WorkerPool(NUM_WORKERS);
	const path = [];
	const endingCircuit = getEndingCircuit(board);
	let openCircuits = getStartingCircuits(board);

	while (openCircuits.length || pool.isWorking()) {
		openCircuits = pool.assignWorkers(openCircuits.sort(), board);
		const blownFuses = pool.work();
		blownFuses.map(f => path.push(f.label));
		blownFuses.forEach(({ children }) => {
			openCircuits = openCircuits.concat(
				children.filter(
					child =>
						!board[child].blown &&
						endingCircuit !== child &&
						openCircuits.indexOf(child) === -1 &&
						board[child].isLive()
				)
			);
		});
	}

	return pool.workTime + getWaitTime(endingCircuit[0]);
};

console.log('Part two: ');
console.log(partTwo(buildBoard(input)));
