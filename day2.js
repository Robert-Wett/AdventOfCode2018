let input = require('fs').readFileSync('./input/day2.txt', { encoding: 'utf8' });

const partOne = (input) => {
	let [double, triple] = [0, 0];
	for (let i = 0; i < input.length; i++) {
		let collector = {};
		for (let ii = 0; ii < input[i].length; ii++) {
			collector[input[i][ii]] = (collector[input[i][ii]] || 0) + 1;
		}
		let d = Object.keys(collector).filter(key => collector[key] === 2);
		let t = Object.keys(collector).filter(key => collector[key] === 3);
		if (d.length >= 1) {
			double++;
		}
		if (t.length >= 1) {
			triple++;
		}
	}

	console.log((double * triple));
}

partOne(input);


const partTwo = (input) => {
	let thing = [];
	for (let i = 0; i < input.length; i++) {
		let curWord = input[i];
		input.forEach((val, idx) => {
			if (idx !== i && hammingDistance(curWord, val) === 1) {
				thing.push(val);
			}
		});
	}
	console.log(thing);
}

const hammingDistance = (s1, s2) => {
	let distance = 0;
	for (let i = 0; i < s1.length; i++) {
		if (s1[i] !== s2[i]) distance++;
	}

	return distance;
}

partTwo(input);