const transform = require('./jsonMapTransform');

const product = {
	name: 'Product name',
	category: 'books',
	price: '200',
	photos: [
		{ title: 'photo1', photoUrl: 'http://photo1.jpg', isCover: true },
		{ title: 'photo2', photoUrl: 'http://photo2.jpg' }
	],
	meta: {
		vendor: 'Author name'
	}
};

const template = {
	title: {
		path: ['name'],
		transform: (val) => val.toUpperCase()
	},
	label: {
		path: ['category', 'categories'],
	},
	author: {
		path: ['meta.vendor']
	},
	photos: {
		path: ['photos'],
		transform: (val) => val.map(photo => photo.photoUrl)
	},
};


test('converts json object based on template', () => {
	const convertedJson = transform(product, template);

	expect(convertedJson.title).toBe('PRODUCT NAME');
	expect(convertedJson.label).toBe('books');
	expect(convertedJson.author).toBe('Author name');
	expect(convertedJson.photos[0]).toBe('http://photo1.jpg');
	expect(convertedJson.photos[1]).toBe('http://photo2.jpg');
});

test.only('converts array of json objects based on template', () => {
	const convertedJsonArray = transform([product, product], template);

	expect(convertedJsonArray[0].title).toBe('PRODUCT NAME');
	expect(convertedJsonArray[0].label).toBe('books');
	expect(convertedJsonArray[0].author).toBe('Author name');
	expect(convertedJsonArray[0].photos[0]).toBe('http://photo1.jpg');
	expect(convertedJsonArray[0].photos[1]).toBe('http://photo2.jpg');
});