const get = require('lodash.get');
const set = require('lodash.set');
const has = require('lodash.has');

const transformJson = (json, template, afterTransform) => {
	const transformed = Object.keys(template).reduce((transformedJson, key) => {
		const path = Array.isArray(template[key].path) ?
			template[key].path.filter(path => has(json, path))[0] : template[key].path;
		const value = get(json, path);

		return (value) ? set(Object.assign({}, transformedJson), key, 
			template[key].transform ? template[key].transform(value, json) : value) : transformedJson;
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