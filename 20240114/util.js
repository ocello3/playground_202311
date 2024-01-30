// debug
const isIndividualData = (arg) =>
	typeof arg === "string" ||
	typeof arg === "number" ||
	typeof arg === "boolean" ||
	arg instanceof p5.Vector;

const isNeedToDivideObject = (arg) =>
	typeof arg === "object" && !(arg instanceof p5.Vector);

// for any array argument
const divideArrayToString = (
	arg,
	length,
	start,
	logList
) => {
	// extract a part of array
	const limitedStart = start < arg.length ? start : arg.length - 1;
	const calcLimitedLength = () => {
		if (length === null) return arg.length;
		const lastId = limitedStart + length;
		const isOver = lastId > arg.length;
		return isOver ? arg.length - limitedStart : length;
	};
	const limitedLength = calcLimitedLength();
	const limitedObjArray = arg.slice(limitedStart, limitedStart + limitedLength);
	if (isIndividualData(limitedObjArray[0])) {
		// for indivisual data type, add to array
		addDataToStringArray(" - ", limitedObjArray, logList);
	} else {
		// for object, divide and add to array
		limitedObjArray.forEach((innerObj, index) => {
			logList.push(`- index ${index + limitedStart}<br>`);
			if (innerObj instanceof p5.Vector) {
				addDataToStringArray(" - ", innerObj, logList);
			} else {
				divideObjectToString(innerObj, length, start, logList);
			}
		});
	}
	return logList;
};

// for non-array argument without individual data type
const divideObjectToString = (
	arg,
	length,
	start,
	logList
) => {
	for (const key in arg) {
		if (Array.isArray(arg[key])) {
			logList.push(`-- ${key}:<br>`);
			divideArrayToString(arg[key], length, start, logList);
		} else if (isIndividualData(arg[key])) {
			addDataToStringArray(key, arg[key], logList);
		} else if (isNeedToDivideObject(arg[key])) {
			divideObjectToString(arg[key], length, start, logList);
		}
	}
	return logList;
};

// add display-data to array
const addDataToStringArray = (
	key,
	data,
	logList
) => {
	if (Array.isArray(data)) {
		// for p5.Vector: add to new line
		if (data[0] instanceof p5.Vector) {
			logList.push(`[`);
			data.forEach((element, index) => {
				if (index === data.length - 1) {
					logList.push(`${element}`);
				} else {
					logList.push(`${element},<br>`);
				}
			});
			logList.push(`]<br>`);
			// for other data (string, number, boolean): add to same line
		} else {
			logList.push(`[`);
			data.forEach((element, index) => {
				if (index === data.length - 1) {
					// for last element of array
					logList.push(`${element}`);
				} else {
					logList.push(`${element}, `);
				}
			});
			logList.push(`]<br>`);
		}
	} else {
		// if NOT array
		logList.push(`${key}: ${data}<br>`);
	}
};

/**
 * @param {p5} s 
 * @param {*} arg 
 * @param {*} displayArrayLength 
 * @param {*} startPosition 
 */
export const debug = (
	s,
	arg,
	displayArrayLength = null,
	startPosition = 0
) => {
	// header
	const title = ``;
	// data
	const logList = [];
	if (Array.isArray(arg)) {
		divideArrayToString(arg, displayArrayLength, startPosition, logList);
	} else if (isIndividualData(arg)) {
		addDataToStringArray(" - ", arg, logList);
	} else {
		divideObjectToString(
			arg,
			displayArrayLength,
			startPosition,
			logList
		);
	}
	document.getElementById("debug").innerHTML = title.concat(...logList);
};

/** 
 * get square size from widowWidth and windowHeight
 * @return {number} square size
*/
export const getSize = s => s.windowWidth > s.windowHeight ? s.windowHeight : s.windowWidth;

/**
 * draw frame
 * @param {number} window width
 * @param {number} window height
 */
export const drawFrame = (s, size) => {
	s.push();
	s.noFill();
	s.strokeWeight(1);
	s.stroke(0);
	s.rect(0, 0, size, size);
	s.pop();
}

/**
 * surround argument function by push() and pop() for drawing
 * @param {*} func 
 * @param {*} pg 
 */
export function pp(s, func, pg = undefined) {
	if (pg === undefined) {
		s.push();
		func();
		s.pop();
	} else {
		pg.push();
		func();
		pg.pop();
	}
}
