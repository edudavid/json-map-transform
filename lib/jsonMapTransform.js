const get = require('./utils/objectHandler').get;
const set = require('./utils/objectHandler').set;
const has = require('./utils/objectHandler').has;

const setObjectValue = (template, key, value, json, transformedJson) => {
	const defaultValue = template[key].default;
	const transform = template[key].transform;
	const transformedValue = transform ? transform(value, json) : value;

	return set(Object.assign({}, transformedJson), key, transformedValue || defaultValue);
};

const transformJson = (json, template, afterTransform) => {
	const transformed = Object.keys(template).reduce((transformedJson, key) => {
		const path = Array.isArray(template[key].path) ?
			template[key].path.filter(path => has(json, path))[0] : template[key].path;

		const value = get(json, path);

		return setObjectValue(template, key, value, json, transformedJson);
	}, {});
	return afterTransform ? afterTransform(transformed) : transformed;
};

const mapTransform = (jsonArray, template, afterTransform) => jsonArray.map(json => {
	const element = transform(json, template);
	return afterTransform ? afterTransform(element) : element;
});

const transform = (json, template, afterTransform) =>
	Array.isArray(json) ? mapTransform(json, template, afterTransform) : transformJson(json, template, afterTransform);

module.exports = transform;
