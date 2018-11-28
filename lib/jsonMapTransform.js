const get = require('lodash.get');
const set = require('lodash.set');
const has = require('lodash.has');

const transformJson = (json, template, after) => {
	const tmpTransformedJson = Object.keys(template).reduce((transformedJson, key) => {
		const path = template[key].path.filter(path => has(json, path))[0];
		const value = get(json, path);

		return (value) ? set(Object.assign({}, transformedJson), key, 
			template[key].transform ? template[key].transform(value, json) : value) : transformedJson;
	}, {});
	return after ? after(tmpTransformedJson) : tmpTransformedJson;
};

const mapTransform = (jsonArray, template, afterEach) => jsonArray.map(json => {
	const element = transform(json, template);
	return afterEach ? afterEach(element) : element;
});

const transform = (json, template, afterEach) =>
	Array.isArray(json) ? mapTransform(json, template, afterEach) : transformJson(json, template, afterEach);

module.exports = transform;