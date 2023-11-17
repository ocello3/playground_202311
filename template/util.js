// debug
const getArrayObjLogList = (obj, name=null, length, start) => {
	const logList = [];
	const arrayObj = (name === null)? obj: obj[name];
	const limitedStart = (start < arrayObj.length)? start: arrayObj.length - 1;
	const calcLimitedLength = () => {
		const lastId = limitedStart + length;
		const isOver = (lastId > arrayObj.length);
		return (isOver)? arrayObj.length - limitedStart: length;
	}
	const limitedLength = (length === null)? arrayObj.length: calcLimitedLength();
	const limitedObjArray = arrayObj.slice(limitedStart, limitedStart + limitedLength);
	limitedObjArray.forEach((innerObj, index) => {
		const innerObjLog = `- index: ${index + limitedStart} -<br>`;
		const innerObjLogList = getObjLogList(innerObj, length, start);
		logList.push(innerObjLog.concat(...innerObjLogList));
	});
	return logList;
}

const getObjLogList = (obj, length, start) => {
	const logList = [];
	for (const name in obj) {
		if (Array.isArray(obj[name])) {
			logList.push(`** ${name}: **<br>`); 
			const arrayObjLogList = getArrayObjLogList(obj, name, length, start)
			logList.push(...arrayObjLogList);
		} else {
			logList.push(`${name}: ${obj[name]}<br>`);
		}
	}
	return logList;
}

const getLogList = (obj, length, start) => {
	const logList = [];
	if (Array.isArray(obj)) {
		const arrayObjLogList = getArrayObjLogList(obj, null, length, start);
		logList.push(...arrayObjLogList);
		// console.log('array');
	} else {
		const objLogList = getObjLogList(obj, length, start);
		logList.push(...objLogList);
	}
	return logList;
}

const debug = (obj, length=null, start=0) => {
	const title = '// debug result<br>';
	const logList = getLogList(obj, length, start);
	document.getElementById('debug').innerHTML = title.concat(...logList);
}

// others
// const getSize = (w, h) => w > h ? h : w;
const getSize = () => windowWidth > windowHeight ? windowHeight : windowWidth;
const drawFrame = (w, h) => {
	push();
	noFill();
	strokeWeight(1);
	stroke(0);
	rect(0, 0, w, h);
	pop();
}