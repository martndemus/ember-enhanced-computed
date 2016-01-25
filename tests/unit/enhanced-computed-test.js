import Ember from 'ember';
import { module, test } from 'qunit';
import computed from 'ember-enhanced-computed';

const { get, set } = Ember;

module('Enhanced Computed');

test('passes dependent keys into function as arguments', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    name: computed('first', 'last', function(first, last) {
      assert.equal(first, 'rob');
      assert.equal(last, 'jackson');
    })
  };

  get(obj, 'name');
});

test('dependent key changes invalidate the computed property', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    name: computed('first', 'last', function(first, last) {
      return `${first} ${last}`;
    })
  };

  assert.equal(get(obj, 'name'), 'rob jackson');
  set(obj, 'first', 'al');
  assert.equal(get(obj, 'name'), 'al jackson');
});

test('allows using get/set syntax', function(assert) {
  let setCallCount = 0;
  let getCallCount = 0;
  let obj = {
    first: 'rob',
    last: 'jackson',

    name: computed('first', 'last', {
      get(first, last) {
        assert.equal(first, 'rob');
        assert.equal(last, 'jackson');

        getCallCount++;
      },

      set(value, first, last) {
        assert.equal(first, 'rob');
        assert.equal(last, 'jackson');

        setCallCount++;
      }
    })
  };

  get(obj, 'name');
  assert.equal(getCallCount, 1, 'calls getter initially');

  get(obj, 'name');
  assert.equal(getCallCount, 1, 'does not call getter when cache is not busted');

  set(obj, 'name', 'foo');
  assert.equal(setCallCount, 1, 'calls setter when set');
});

test('works properly without dependent keys', function(assert) {
  let callCount = 0;
  let obj = {
    first: 'rob',
    last: 'jackson',

    name: computed(function() {
      callCount++;
    })
  };

  get(obj, 'name');

  assert.equal(callCount, 1);
});

test('attr.foo passes attr.foo', function(assert) {
  assert.expect(2);

  let obj = {
    attr: {
      foo: 'bar'
    },

    something: computed('attr.foo', {
      get(foo) {
        assert.deepEqual(foo, 'bar');
      },
      set(value, foo) {
        assert.deepEqual(foo, 'bar');
      }
    }),
  };

  get(obj, 'something');
  set(obj, 'something', 'something');
});

test('attr.models.@each passes attr.models', function(assert) {
  assert.expect(2);

  let obj = {
    attr: {
      models: [{ name: 'one' }, { name: 'two' }]
    },

    something: computed('attr.models.@each.name', {
      get(models) {
        assert.deepEqual(models, [{ name: 'one' }, { name: 'two' }]);
      },
      set(value, models) {
        assert.deepEqual(models, [{ name: 'one' }, { name: 'two' }]);
      }
    }),
  };

  get(obj, 'something');
  set(obj, 'something', 'something');
});

test('attr.models.[] passes attr.models', function(assert) {
  assert.expect(2);

  let obj = {
    models: ['one', 'two'],

    something: computed('models.[]', {
      get(models) {
        assert.deepEqual(models, ['one', 'two']);
      },
      set(value, models) {
        assert.deepEqual(models, ['one', 'two']);
      }
    }),
  };

  get(obj, 'something');
  set(obj, 'something', 'something');
});

test('attr.{foo,bar} passes attr.foo and attr.bar', function(assert) {
  assert.expect(4);

  let obj = {
    attr: {
      foo: 'foo',
      bar: 'bar'
    },

    something: computed('attr.{foo,bar}', {
      get(foo, bar) {
        assert.equal(foo, 'foo');
        assert.equal(bar, 'bar');
      },
      set(value, foo, bar) {
        assert.equal(foo, 'foo');
        assert.equal(bar, 'bar');
      }
    }),
  };

  get(obj, 'something');
  set(obj, 'something', 'something');
});

test('attr.@each.{foo,bar} passes attr', function(assert) {
  assert.expect(2);

  let obj = {
    attr: [{
      foo: 'foo',
      bar: 'bar'
    }],

    something: computed('attr.@each.{foo,bar}', {
      get(models) {
        assert.deepEqual(models, [{ foo: 'foo', bar: 'bar' }]);
      },
      set(value, models) {
        assert.deepEqual(models, [{ foo: 'foo', bar: 'bar' }]);
      }
    }),
  };

  get(obj, 'something');
  set(obj, 'something', 'something');
});
