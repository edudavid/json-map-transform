# json-map-transform
A Node library that transforms a json object or an array of json objects based on tranformation template.

[![Build Status](https://travis-ci.org/edudavid/json-map-transform.svg?branch=master)](https://travis-ci.org/edudavid/json-map-transform)

## Usage

[Template](#template)

[Single object transformation](#single-object-transformation)

[Array transformation](#array-transformation)

### Template

**Key:** Each key in the template object describes the path the property in the output object where the property described in path path will be mapped.

**Path:** Is the path to the property in the original object that will be mapped to the key. It can also be an array of possible paths in case the objects that are being converted are not standarized

**Transform:** as a callback that can be used to transform the current property. It receives two parameters: (property, originalObject)

Template example:

```javascript
const template = {
	title: {
		path: 'name',
		transform: (val) => val.toUpperCase()
	},
	label: {
		path: ['category', 'categories'],
	},
	vendor: {
		path: 'meta.vendor'
	},
	'meta.photos': {
		path: 'photos',
		transform: (val) => val.map(photo => photo.photoUrl)
	},
	'meta.id': {
		path: 'code'
	}
}
```

This template will work like this:

| from                   | to            | transform      |
| :--------------------- |:-------------| :--------------|
| name                   | title         | toUpperCase()  |
| category or categories | label         |                |
| meta.vendor            | vendor        |                |
| photos                 | meta.photos   | photo.photoUrl |
| code                   | meta.code     |                |




### Single object transformation

```javascript
const transform = require('json-map-transform');

//The json objects to be transformed
const product1 = {
	name: 'Hello world',
	code: 'BOOK01',
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

const product2 = {
	name: 'My Digital Product',
	code: 'DIGITAL01',
	category: 'digital',
	price: '500',
	photos: [ 
		{ title: 'photo3', photoUrl: 'http://photo3.jpg', isCover: true },
		{ title: 'photo4', photoUrl: 'http://photo4.jpg' }
	],
	meta: {
		vendor: 'Global Digital'
	}
};

convertedJson = transform(product1, template);

//Outut object
{
    "title": "HELLO WORLD",
    "label": "books",
    "vendor": "Author name",
    "meta": {
        "photos": [
            "http://photo1.jpg",
            "http://photo2.jpg"
        ],
        "id": "BOOK01"
    }
}
```

You ca also use an optional callback executed after transformation

```javascript
const afterTransform = (element) => Object.assign({}, element, {
	categoryCode: element.label == 'books' ? 101 : 102
});

transform(product1, template, afterTransform);

// Output json
{
    "title": "HELLO WORLD",
    "label": "books",
    "vendor": "Author name",
    "meta": {
        "photos": [
            "http://photo1.jpg",
            "http://photo2.jpg"
        ],
        "id": "BOOK01"
    },
    "categoryCode": 101
}
```

### Array transformation
```javascript
// The afterTransform callback is also optional
transform([product1, product2], template, afterTransform);


[
    {
        "title": "HELLO WORLD",
        "label": "books",
        "vendor": "Author name",
        "meta": {
            "photos": [
                "http://photo1.jpg",
                "http://photo2.jpg"
            ],
            "id": "BOOK01"
        },
        "categoryCode": 101
    },
    {
        "title": "MY DIGITAL PRODUCT",
        "label": "digital",
        "vendor": "Global Digital",
        "meta": {
            "photos": [
                "http://photo3.jpg",
                "http://photo4.jpg"
            ],
            "id": "DIGITAL01"
        },
        "categoryCode": 102
    }
]
```
