let input = require('fs')
	.readFileSync('./input/day8.txt', {
		encoding: 'utf8'
	})
	.split(' ')
	.map(Number);

class Node {
	constructor(numChildren, meta = [], isParent = false, id) {
		this.numChildren = numChildren;
		this.meta = meta;
		this.isParent = isParent;
		this.id = id;
		this.children = [];
	}

	sumMeta() {
		return this.meta.reduce((acc, meta) => {
			return acc + meta;
		}, 0);
	}

	getNodeValue(sum = 0) {
		if (this.numChildren) {
			this.meta.map(m => m - 1).forEach(m => {
				if (m >= 0 && this.children[m]) {
					sum += this.children[m].getNodeValue();
				}
			});

			return sum;
		} else {
			return this.sumMeta();
		}
	}
}

// Part 1
{
	const buildNodes = (input, nodes = [], first = false) => {
		let [numChildren, numMeta] = [input.shift(), input.shift()];

		for (let i = numChildren; i > 0; i--) {
			buildNodes(input, nodes);
		}

		let meta = input.splice(0, numMeta);
		nodes.push(new Node(numChildren, meta, first));
		return nodes;
	};

	const nodes = buildNodes(input.slice(), [], true);
	console.log(
		nodes.reduce((acc, node) => {
			return acc + node.sumMeta();
		}, 0)
	);
}

// Part 2
{
	function idGen() {
		let id = 0;
		return () => id++;
	}

	const getId = new idGen();

	const buildNodesOnGraph = (input, graph, first = false, parent) => {
		let [numChildren, numMeta] = [input.shift(), input.shift()];
		const newNode = new Node(numChildren, [], first, getId());
		graph[newNode.id] = newNode;

		if (parent) {
			parent.children.push(newNode);
		}

		for (let i = numChildren; i > 0; i--) {
			buildNodesOnGraph(input, graph, false, newNode);
		}

		let meta = input.splice(0, numMeta);
		graph[newNode.id].meta = meta;
	};

	const graph = {};
	buildNodesOnGraph(input.slice(), graph, true);

	const parent = Object.keys(graph)
		.map(k => graph[k].isParent && graph[k])
		.filter(Boolean)[0];

	console.log(parent.getNodeValue(0));
}
