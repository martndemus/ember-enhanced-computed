[![Build Status](https://travis-ci.org/martndemus/ember-enhanced-computed.svg?branch=master)](https://travis-ci.org/martndemus/ember-enhanced-computed)

# ember-enhanced-computed

Enhances the user experience of the `Ember.computed` function just a little bit.

## Installation

```sh
ember install ember-enhanced-computed
```

## Usage

#### Dependent keys are passed into the function as arguments

```js
import computed from 'ember-enhanced-computed';

let person = {
  first: 'Rob',
  last:  'Jackson',

  name: computed('first', 'last', function(first, last) {
    return `${first} ${last}`;
  })
};

person.get('name'); // => 'Rob Jackson'
```

#### get / set style is also supported

```js
import computed from 'ember-enhanced-computed';

let person = {
  first: 'Rob',
  last:  'Jackson',

  name: computed('first', 'last', {
    get(first, last) {
      return `${first} ${last}`;
    },

    set(value /*, first, last */) {
      let [first, last] = value.split(' ');
      this.set('first', first);
      this.set('last', last);

      return value;
    }
  })
};

person.get('name'); // => 'Rob Jackson'
person.set('name', 'Stefan Penner');
person.get('name'); // => 'Stefan Penner'
```

#### When a dependent key uses the @each macro, the array before the macro is passed in

```js
import computed from 'ember-enhanced-computed';

let crowd = {
  people: [
    { name: 'Rob Jackson' },
    { name: 'Stefan Penner' }
  ],

  names: computed('people.@each.name', function(people) {
    return people.map((person) => person.get('name'));
  });
};


crowd.get('names') // => ['Rob Jackson', 'Stefan Penner'];
```

### 'person.{first,last}' passes first and last of person as arguments

```js
import computed from 'ember-enhanced-computed';

let post = {
  author: {
    first: 'Rob',
    last:  'Jackson',
  }

  authorName: computed('author.{first,last}', function(first, last) {
    return `${first} ${last}`;
  })
};

post.get('authorName'); // => 'Rob Jackson'
```
