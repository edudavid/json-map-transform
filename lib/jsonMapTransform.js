const _ = require('lodash');

const transformJson = (json, template) => Object.keys(template).reduce((convertedJson, key) => {
	const path = template[key].path.filter(path => _.has(json, path))[0];
	const value = _.get(json, path);

	return (value) ? Object.assign({}, convertedJson, {
		[key]: template[key].transform ? template[key].transform(value) : value 
	}) : convertedJson;
}, {});

const mapTransform = (jsonArray, template) => jsonArray.map(json => transform(json, template));

const transform = (json, template) =>
	Array.isArray(json) ? mapTransform(json, template) : transformJson(json, template);

module.exports = transform;