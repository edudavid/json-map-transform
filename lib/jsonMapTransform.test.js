const transform = require('./jsonMapTransform');

const buildProduct = (name, category, price, photos, vendor) => ({
	name,
	category,
	price,
	photos,
	meta: { vendor }
});

const product1 = buildProduct('My book', 'books', '200',
	[ 
		{ title: 'photo1', photoUrl: 'http://photo1.jpg', isCover: true },
		{ title: 'photo2', photoUrl: 'http://photo2.jpg' }
	],
	'Author name'
);

const product2 = buildProduct('My Digital Product', 'digital', '160',
	[ 
		{ title: 'photo3', photoUrl: 'http://photo3.jpg', isCover: true },
		{ title: 'photo4', photoUrl: 'http://photo4.jpg' }
	],
	'Global'
);

const template = {
	mapping: {
		title: {
			path: ['name'],
			transform: (val) => val.toUpperCase()
		},
		label: {
			path: ['category', 'categories'],
		},
		vendor: {
			path: ['meta.vendor']
		},
		photos: {
			path: ['photos'],
			transform: (val) => val.map(photo => photo.photoUrl)
		},
	},
	afterEach: (element) => Object.assign({}, element, {
		categoryCode: element.label == 'books' ? 101 : 102
	})
};


test('converts json object based on template', () => {
	const convertedJson = transform(product1, template);

	expect(convertedJson.title).toBe('MY BOOK');
	expect(convertedJson.label).toBe('books');
	expect(convertedJson.vendor).toBe('Author name');
	expect(convertedJson.photos[0]).toBe('http://photo1.jpg');
	expect(convertedJson.photos[1]).toBe('http://photo2.jpg');
});

test('converts array of json objects based on template', () => {
	const convertedJsonArray = transform([product1, product2], template);

	expect(convertedJsonArray[0].title).toBe('MY BOOK');
	expect(convertedJsonArray[0].label).toBe('books');
	expect(convertedJsonArray[0].vendor).toBe('Author name');
	expect(convertedJsonArray[0].photos[0]).toBe('http://photo1.jpg');
	expect(convertedJsonArray[0].photos[1]).toBe('http://photo2.jpg');

	expect(convertedJsonArray[1].title).toBe('MY DIGITAL PRODUCT');
	expect(convertedJsonArray[1].label).toBe('digital');
	expect(convertedJsonArray[1].vendor).toBe('Global');
	expect(convertedJsonArray[1].categoryCode).toBe(102);
	expect(convertedJsonArray[1].photos[0]).toBe('http://photo3.jpg');
	expect(convertedJsonArray[1].photos[1]).toBe('http://photo4.jpg');
});