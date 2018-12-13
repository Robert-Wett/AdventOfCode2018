let realInput =
`194, 200
299, 244
269, 329
292, 55
211, 63
123, 311
212, 90
292, 169
359, 177
354, 95
101, 47
95, 79
95, 287
294, 126
81, 267
330, 78
202, 165
225, 178
266, 272
351, 326
180, 62
102, 178
151, 101
343, 145
205, 312
74, 193
221, 56
89, 89
242, 172
59, 138
83, 179
223, 88
297, 234
147, 351
226, 320
358, 338
321, 172
54, 122
263, 165
126, 341
64, 132
264, 306
72, 202
98, 49
238, 67
310, 303
277, 281
222, 318
357, 169
123, 225`;

let input =
`1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`;

const mDist = (p1, p2) => Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y)

class Point {
	constructor(x, y, on=false) {
		this.x = x;
		this.y = y;
		this.on = on;
		this.dist = Number.MAX_SAFE_INTEGER;
		this.double = false;
	}

	distFrom(point) {
		return mDist(this, point);
	}
}

const buildGraph = (input) => {
	let graph = {
		highX: 0,
		highY: 0,
		setKeys: [],
		areas: {}
	};

	input.split('\n').forEach(line => {
		let [x, y] = [...line.split(', ').map(Number)];
		let key = `${line.replace(' ', '')}`;
		if (x > graph.highX) graph.highX = x;
		if (y > graph.highY) graph.highY = y;
		graph[key] = new Point(x, y, true);
		graph.setKeys.push(key);
	});

	// Bump up the max edges here a little to let the finite numbers have some
	// room to breath and 'terminate'. If you have a point on the edge and don't
	// bump this number up, it'll show up as an infinite key and be removed later.
	graph.highX += 5
	graph.highY += 5

	for (let y = 0; y <= graph.highY; y++) {
		for (let x = 0; x <= graph.highX; x++) {
			if (!graph[`${x},${y}`]) {
				graph[`${x},${y}`] = new Point(x, y);
			}
		}
	}

	return graph;
}

const getBiggestFiniteArea = (graph) => {
	graph.setKeys.forEach(k => {
		for (let y = 0; y <= graph.highY; y++) {
			for (let x = 0; x <= graph.highX; x++) {
				let nextPoint = graph[`${x},${y}`];
				if (!nextPoint.on) {
					const distFromCurPoint = graph[k].distFrom(nextPoint);
					// Always set this value if it's lower
					if (distFromCurPoint < nextPoint.dist) {
						nextPoint.dist = distFromCurPoint;
						nextPoint.closest = k;
						nextPoint.double = false;
					}
					// If it's equal, set the boolean "double" value to true so we
					// know to skip this point. If we find another point is closer
					// later on, we'll set this back to false above.
					else if (distFromCurPoint === nextPoint.dist) {
						nextPoint.double = true;
					}
				}
			}
		}
	});

	for (let y = 0; y <= graph.highY; y++) {
		for (let x = 0; x <= graph.highX; x++) {
			let key = `${x},${y}`;
			if (!graph[key].double) {
				let closest = graph[key].closest;
				graph.areas[closest] = (graph.areas[closest] || (graph.areas[closest] = 0)) + 1;
			}
		}
	}

	// This is terrible, but here we detect the keys that are infinite. A key is determined
	// to be infinite if it has a point on the edge of the graph.
	graph.infiniteKeys = [];

	// Top
	for (let i = 0; i <= graph.highX; i++) {
		let key = `${i},0`;
		if (!graph[key].double) {
			let infKey = graph[key].closest;
			if (graph.infiniteKeys.indexOf(infKey) < 0) {
				graph.infiniteKeys.push(infKey);
			}
		}
	}

	// Left
	for (let i = 0; i <= graph.highY; i++) {
		let key = `0,${i}`;
		if (!graph[key].double) {
			let infKey = graph[key].closest;
			if (graph.infiniteKeys.indexOf(infKey) < 0) {
				graph.infiniteKeys.push(infKey);
			}
		}
	}


	// Right
	for (let i = 0; i <= graph.highY; i++) {
		let key = `${graph.highX},${i}`;
		if (!graph[key].double) {
			let infKey = graph[key].closest;
			if (graph.infiniteKeys.indexOf(infKey) < 0) {
				graph.infiniteKeys.push(infKey);
			}
		}
	}

	// Bottom
	for (let i = 0; i <= graph.highX; i++) {
		let key = `${i},${graph.highY}`;
		if (!graph[key].double) {
			let infKey = graph[key].closest;
			if (graph.infiniteKeys.indexOf(infKey) < 0) {
				graph.infiniteKeys.push(infKey);
			}
		}
	}

	const filtered = Object.keys(graph.areas)
						.filter(key => !graph.infiniteKeys.includes(key))
						.reduce((obj, key) => {
							return {
								...obj,
								[key]: graph.areas[key]
							};
						}, {});
	
	let maxEntryValue = 0;
	for (const entryKey in filtered) {
		if (filtered[entryKey] > maxEntryValue) {
			maxEntryValue = filtered[entryKey];
		}
	}

	return maxEntryValue;
}

const partTwo = (graph) => {

	// Helper function that detects points on any edge
	const isSafe = (x, y, { highX, highY }) =>  (x !== 0 || y !== 0 || x !== highX || y !== highY);

	// First, zero out all the distances from the graph and flip all the 'active' boolean switches
	// to off; we don't care if it's a point from the input or not calculating this region.
	for (let y = 0; y <= graph.highY; y++) {
		for (let x = 0; x <= graph.highX; x++) {
			graph[`${x},${y}`].dist = 0;
			graph[`${x},${y}`].on = false;
		}
	}

	// Sum up all the distance values
	graph.setKeys.forEach(k => {
		for (let y = 0; y <= graph.highY; y++) {
			for (let x = 0; x <= graph.highX; x++) {
				let nextPoint = graph[`${x},${y}`];
				if (!nextPoint.on) {
					nextPoint.dist += graph[k].distFrom(nextPoint);
				}
			}
		}
	});

	// This is terrible, but here we detect the keys that are infinite. A key is determined
	// to be infinite if it has a point on the edge of the graph.
	graph.infiniteKeys = [];

	// Top
	for (let i = 0; i <= graph.highX; i++) {
		let key = `${i},0`;
		if (!graph[key].double) {
			let infKey = graph[key].closest;
			if (graph.infiniteKeys.indexOf(infKey) < 0) {
				graph.infiniteKeys.push(infKey);
			}
		}
	}

	// Left
	for (let i = 0; i <= graph.highY; i++) {
		let key = `0,${i}`;
		if (!graph[key].double) {
			let infKey = graph[key].closest;
			if (graph.infiniteKeys.indexOf(infKey) < 0) {
				graph.infiniteKeys.push(infKey);
			}
		}
	}


	// Right
	for (let i = 0; i <= graph.highY; i++) {
		let key = `${graph.highX},${i}`;
		if (!graph[key].double) {
			let infKey = graph[key].closest;
			if (graph.infiniteKeys.indexOf(infKey) < 0) {
				graph.infiniteKeys.push(infKey);
			}
		}
	}

	// Bottom
	for (let i = 0; i <= graph.highX; i++) {
		let key = `${i},${graph.highY}`;
		if (!graph[key].double) {
			let infKey = graph[key].closest;
			if (graph.infiniteKeys.indexOf(infKey) < 0) {
				graph.infiniteKeys.push(infKey);
			}
		}
	}

	const region = [];
	for (let y = 0; y <= graph.highY; y++) {
		for (let x = 0; x <= graph.highX; x++) {
			let key = `${x},${y}`;
			if (isSafe(x, y, graph) && graph[key].dist < 10000) {
				region.push(graph[key]);
			}
		}
	}

	return region.length;
}

let graph = buildGraph(realInput);
// Part 1
console.log(getBiggestFiniteArea(graph));
// Part 2
console.log(partTwo(graph));