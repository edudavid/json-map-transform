module.exports = {
	has,
	get,
	set
};

function has(object, path) {
	const subPaths = path.split('.');
	let hasPath = true;
	let obj = Object.assign({}, object);
	subPaths.forEach(subPath => {
		hasPath = obj && hasPath && Object.keys(obj).indexOf(subPath) > -1;
		obj = obj[subPath];
	});
	return hasPath;
}

function get(object, path) {
	const subPaths = path.split('.');
	let value = Object.assign({}, object);
	subPaths.forEach(subPath => {
		value = value ? value[subPath] : undefined;
	});
	return value;
}


function set(object, path, value) {
	let objectCopy = object;
	const subPaths = path.split('.');

	subPaths.forEach((subPath, index) => {
		if(index == subPaths.length -1) {
			objectCopy[subPath] = value;
		}
		if( !objectCopy[subPath] ) {
			objectCopy[subPath] = {};
		}
		objectCopy = objectCopy[subPath];
	});

	return object;
}
