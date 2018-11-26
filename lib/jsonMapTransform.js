const _ = require('lodash');

const transformJson = (json, template) => {
	const mapping = template.mapping;

	return Object.keys(mapping).reduce((convertedJson, key) => {
		const path = mapping[key].path.filter(path => _.has(json, path))[0];
		const value = _.get(json, path);
	
		return (value) ? Object.assign({}, convertedJson, {
			[key]: mapping[key].transform ? mapping[key].transform(value) : value 
		}) : convertedJson;
	}, {});
};

const mapTransform = (jsonArray, template) => jsonArray.map(json => {
	const element = transform(json, template);
	return template.afterEach ? template.afterEach(element) : element;
});

const transform = (json, template) =>
	Array.isArray(json) ? mapTransform(json, template) : transformJson(json, template);

module.exports = transform;