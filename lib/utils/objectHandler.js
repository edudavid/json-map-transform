const isUndefined = (value) => value == undefined;

const has = (object, path) => {
	const subPaths = path.split('.');
	let hasPath = true;
	let obj = Object.assign({}, object);
	subPaths.forEach(subPath => {
		hasPath = obj && hasPath && Object.keys(obj).indexOf(subPath) > -1;
		obj = obj[subPath];
	});
	return hasPath;
};

const get = (object, path) => {
	const subPaths = path.split('.');
	let value = Object.assign({}, object);
	subPaths.forEach(subPath => {
		value = (value && !isUndefined(value[subPath])) ? value[subPath] : undefined;
	});
	return value;
};


const set =(object, path, value) => {
	let objectCopy = object;
	const subPaths = path.split('.');

	subPaths.forEach((subPath, index) => {
		if( !objectCopy[subPath] ) {
			objectCopy[subPath] = (index == subPaths.length -1) ? value : {};
		}
		objectCopy = objectCopy[subPath];
	});

	return object;
};

module.exports = {
	has,
	get,
	set,
	isUndefined
};
