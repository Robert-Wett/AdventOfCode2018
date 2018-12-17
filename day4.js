let input = require('fs')
	.readFileSync('./input/day4.txt', { encoding: 'utf8' })
	.split('\n')
	.sort((a, b) => {
		let [d1, d2] = [new Date(a.slice(1, 17)), new Date(b.slice(1, 17))];
		return d1 - d2;
	});

let curId;
let asleepTime;
let lookup = {};

const getMin = line => Number(line.slice(15, 17));
input.forEach((line, idx) => {
	if (line.indexOf('#') === 25) {
		curId = /\#(\d+)/gm.exec(line)[1];
	} else if (!curId) {
		return;
	}

	let curGuard = lookup[curId] || (lookup[curId] = {});
	if (line[19] === 'f') {
		asleepTime = getMin(line);
		curGuard.sleep = curGuard.sleep ? curGuard.sleep + 1 : 1;
		curGuard.minuteLookup = curGuard.minuteLookup || (curGuard.minuteLookup = {});
		curGuard.minuteLookup[asleepTime] = (curGuard.minuteLookup[asleepTime] || 0) + 1;
	} else if (line[19] === 'w') {
		let minute = getMin(line);
		curGuard.minuteLookup = curGuard.minuteLookup || (curGuard.minuteLookup = {});
		for (let i = asleepTime + 1; i < minute; i++) {
			curGuard.sleep++;
			curGuard.minuteLookup[i] = (curGuard.minuteLookup[i] || 0) + 1;
		}
	}
});

const partOne = () => {
	let mostSleepy = 0;
	let sleepiestGuard;
	let sleepiestId;

	let keys = Object.keys(lookup);

	for (let i = 0; i < keys.length; i++) {
		if (lookup[keys[i]].sleep > mostSleepy) {
			sleepiestGuard = lookup[keys[i]];
			sleepiestId = keys[i];
			mostSleepy = lookup[keys[i]].sleep;
		}
	}

	let max = 0;
	let minuteNum;

	Object.keys(sleepiestGuard.minuteLookup).forEach(min => {
		if (sleepiestGuard.minuteLookup[min] > max) {
			max = sleepiestGuard.minuteLookup[min];
			minuteNum = min;
		}
	});

	console.log(minuteNum * sleepiestId);
};

const getHighest = timeLog => {
	if (!timeLog) {
		return [0, 0];
	}
	let highest = 0;
	let highestId;
	let keys = Object.keys(timeLog);

	for (let i = 0; i < keys.length; i++) {
		if (timeLog[keys[i]] > highest) {
			highestId = keys[i];
			highest = timeLog[highestId];
		}
	}

	return [highestId, highest];
};

const partTwo = () => {
	let mostSleepy = 0;
	let sleepiestGuard;
	let sleepiestMinute;

	let keys = Object.keys(lookup);

	for (let i = 0; i < keys.length; i++) {
		let [highestMinute, highestValue] = getHighest(lookup[keys[i]].minuteLookup);
		if (highestValue > mostSleepy) {
			sleepiestGuard = keys[i];
			mostSleepy = highestValue;
			sleepiestMinute = highestMinute;
		}
	}

	console.log(sleepiestGuard * sleepiestMinute);
};

partOne(input);
partTwo(input);
