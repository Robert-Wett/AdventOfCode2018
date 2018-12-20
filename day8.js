let input = require('fs')
	.readFileSync('./input/day8.txt', {
		encoding: 'utf8'
	})
	.split(' ')
	.map(Number);

class Node {
	constructor(numChildren, meta = []) {
		this.numChildren = numChildren;
		this.meta = meta;
	}
	sumMeta() {
		return this.meta.reduce((acc, meta) => {
			return acc + meta;
		}, 0);
	}
}

// Part 1
{
	const nodes = [];
	const partOne = input => {
		let [numChildren, numMeta] = [input.shift(), input.shift()];

		for (let i = numChildren; i > 0; i--) {
			partOne(input);
		}

		let meta = input.splice(0, numMeta);
		nodes.push(new Node(numChildren, meta));
	};
	partOne(input);
	console.log(
		nodes.reduce((acc, node) => {
			return acc + node.sumMeta();
		}, 0)
	);
}
