let input = require('fs').readFileSync('./input/day3.txt', { encoding: 'utf8' });

const parseInputLine = (line, grid = {}) => {
	const [_, id, x, y, width, height] = /(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/.exec(line);
	grid[Number(id)] = { x: Number(x), y: Number(y), width: Number(width), height: Number(height) };
};

const buildGridLookup = input => {
	const gridLookup = {};
	input.split('\n').forEach(line => parseInputLine(line, gridLookup));
	return gridLookup;
};

const grid = [];
let [gridNumber, inputGraph] = [1000, buildGridLookup(input)];

for (let i = 0; i < gridNumber; i++) {
	grid.push(Array.from({ length: gridNumber }, () => []));
}

Object.keys(inputGraph).forEach(id => {
	let { x, y, width, height } = inputGraph[id];
	for (let i = 0; i < height; i++) {
		for (let ii = 0; ii < width; ii++) {
			grid[y + i][x + ii].push(id);
		}
	}
});

// Part 1
let sharedCells = 0;
grid.map(row => row.map(rowEntry => rowEntry.length > 1 && sharedCells++));
console.log(`Part 1, Number of shared cells:`);
console.log(sharedCells);

// Part 2
let ids = new Set([]);
grid.map(row =>
	row.map(rowEntry => {
		if (rowEntry.length > 1) {
			rowEntry.forEach(val => ids.add(val));
		}
	})
);

let keys = Object.keys(inputGraph);
for (let i = 0; i < keys.length; i++) {
	if (!ids.has(keys[i])) {
		console.log(keys[i]);
		break;
	}
}
