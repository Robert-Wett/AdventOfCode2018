let input = require('fs').readFileSync('./inputfiles/day5.txt', { encoding: 'utf8' });

const reduceFiber = input => {
	let i = 0;
	while (true) {
		if (input[i + 1]) {
			let n1 = input[i];
			let n2 = input[i + 1];
			let n1Lower = /[a-z]/.test(n1);
			let n2Lower = /[a-z]/.test(n2);
			if (n1.toLowerCase() === n2.toLowerCase() && n1Lower !== n2Lower) {
				input = input.slice(0, i).concat(input.slice(i+2));
				i = 0;
			} else {
				i++;
			}
		} else {
			break;
		}
	}

	return input.length;
}

// Part 1
console.log(reduceFiber(input));

// Part 2
let lookup = {};
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
	let i = input.replace(new RegExp(`[${letter}]`, 'gi'), '');
	lookup[letter] = reduceFiber(i);
})

console.log(
	Object.keys(lookup).reduce((lowest, next) => {
		if (lookup[next] < lowest) return lookup[next];
		return lowest;
	}, Number.MAX_SAFE_INTEGER)
);