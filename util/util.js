/**
 * display debug information to DOM of id=debug
 * @param {*} obj 
 * @param {number} length 
 * @param {number} start 
 */
const debug = (obj, length = null, start = 0) => {
	const getObjLogList = (_obj, _length, _start) => {
		const logList = [];
		for (const name in _obj) {
			if (Array.isArray(_obj[name])) {
				logList.push(`** ${name}: **<br>`);
				const arrayObjLogList = getArrayObjLogList(_obj, name, _length, _start);
				logList.push(...arrayObjLogList);
			} else {
				logList.push(`${name}: ${_obj[name]}<br>`);
			}
		}
		return logList;
	}
	const getArrayObjLogList = (_obj, name = null, _length, _start) => {
		const logList = [];
		const arrayObj = (name === null) ? _obj : _obj[name];
		const limitedStart = (_start < arrayObj._length) ? _start : arrayObj._length - 1;
		const calcLimitedLength = () => {
			const lastId = limitedStart + _length;
			const isOver = (lastId > arrayObj._length);
			return (isOver) ? arrayObj._length - limitedStart : _length;
		}
		const limitedLength = (_length === null) ? arrayObj._length : calcLimitedLength();
		const limitedObjArray = arrayObj.slice(limitedStart, limitedStart + limitedLength);
		limitedObjArray.forEach((innerObj, index) => {
			const innerObjLog = `- index: ${index + limitedStart} -<br>`;
			const innerObjLogList = getObjLogList(innerObj, _length, _start);
			logList.push(innerObjLog.concat(...innerObjLogList));
		});
		return logList;
	}
	const title = isLooping() ? 'drawing<br>' : '...waiting/click canvas to start<br>';
	const logList = [];
	if (Array.isArray(obj)) {
		const arrayObjLogList = getArrayObjLogList(obj, null, length, start);
		logList.push(...arrayObjLogList);
		// console.log('array');
	} else {
		const objLogList = getObjLogList(obj, length, start);
		logList.push(...objLogList);
	}
	document.getElementById('debug').innerHTML = title.concat(...logList);
}

/** 
 * get square size from widowWidth and windowHeight
 * @return {number} square size
*/
const getSize = () => windowWidth > windowHeight ? windowHeight : windowWidth;

/**
 * draw frame
 * @param {number} window width
 * @param {number} window height
 */
const drawFrame = (w, h) => {
	push();
	noFill();
	strokeWeight(1);
	stroke(0);
	rect(0, 0, w, h);
	pop();
}

/**
 * surround argument function by push() and pop() for drawing
 * @param {*} func 
 */
const pp = (func) => {
	push();
	func();
	pop();
}