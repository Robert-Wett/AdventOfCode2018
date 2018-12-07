let input = require('fs').readFileSync('./input/day1.txt', { encoding: 'utf8' });

// Day 1
const dayOne = input => (
	input.split('\n').reduce((acc, n) => { return acc + Number(n) }, 0)
)


// Day 2
const dayTwo = input => {
	const changes = input.split('\n');
	const frequencies = {};
	let curFrequency = 0;

	while (true) {
		for (const change of changes) {
			curFrequency += Number(change);
			if (frequencies[curFrequency]) {
				return curFrequency;
			}
			frequencies[curFrequency] = true;
		}
	}
}

console.log(dayOne(input));
console.log(dayTwo(input));