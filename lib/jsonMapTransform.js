const get = require('./utils/objectHandler').get;
const set = require('./utils/objectHandler').set;
const has = require('./utils/objectHandler').has;
const isUndefined = require('./utils/objectHandler').isUndefined;

const setObjectValue = (template, key, value, transformedObject, originalObject) => {
	const defaultValue = template[key].default;
	const transform = template[key].transform;
	const omitValues = template[key].omitValues || [];
	let transformedValue = transform ? transform(value, transformedObject, originalObject) : value;

	if (isUndefined(transformedValue) && !isUndefined(defaultValue)) {
		transformedValue = defaultValue;
	}

	if(omitValues.indexOf(transformedValue) == -1) {
		return set(Object.assign({}, transformedObject), key, transformedValue);
	}

	return transformedObject;
};

const transformJson = (originalObject, template, afterTransform) => {
	const transformedObject = Object.keys(template).reduce((transformedJson, key) => {
		const path = Array.isArray(template[key].path) ?
			template[key].path.filter(path => has(originalObject, path))[0] : template[key].path;

		const value = path ? get(originalObject, path) : undefined;

		return setObjectValue(template, key, value, transformedJson, originalObject);
	}, {});
	return afterTransform ? afterTransform(transformedObject, originalObject) : transformedObject;
};

const mapTransform = (jsonArray, template, afterTransform) => jsonArray.map(originalObject => {
	const transformedObject = transform(originalObject, template);
	return afterTransform ? afterTransform(transformedObject, originalObject) : transformedObject;
});

const transform = (json, template, afterTransform) =>
	Array.isArray(json) ? mapTransform(json, template, afterTransform) : transformJson(json, template, afterTransform);

module.exports = transform;
