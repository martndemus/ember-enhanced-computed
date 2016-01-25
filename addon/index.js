import Ember from 'ember';

const { computed, expandProperties, get } = Ember;

export default function(...dependentProperties) {
  let userSuppliedHandler = dependentProperties.pop();
  let computedHandler;

  if (typeof userSuppliedHandler === 'object') {
    computedHandler = {};
    if (userSuppliedHandler.get) {
      computedHandler.get =
        callUserSuppliedGet(dependentProperties, userSuppliedHandler.get);
    }
    if (userSuppliedHandler.set) {
      computedHandler.set =
        callUserSuppliedSet(dependentProperties, userSuppliedHandler.set);
    }
  } else {
    computedHandler =
      callUserSuppliedGet(dependentProperties, userSuppliedHandler);
  }

  dependentProperties.push(computedHandler);

  return computed(...dependentProperties);
}

function expandPropertyList(propertyList) {
  return propertyList.reduce((newPropertyList, property) => {
    const atEachIndex = property.indexOf('.@each');
    if (atEachIndex !== -1) {
      return newPropertyList.concat(property.slice(0, atEachIndex));
    } else if (property.slice(-2) === '[]') {
      return newPropertyList.concat(property.slice(0, -3));
    }

    expandProperties(property, (expandedProperties) => {
      newPropertyList = newPropertyList.concat(expandedProperties);
    });

    return newPropertyList;
  }, []);
}

function callUserSuppliedGet(params, func) {
  const expandedParams = expandPropertyList(params);
  return function() {
    let paramValues = expandedParams.map(p => get(this, p));

    return func.apply(this, paramValues);
  };
}


function callUserSuppliedSet(params, func) {
  const expandedParams = expandPropertyList(params);
  return function(key, value) {
    let paramValues = expandedParams.map(p => get(this, p));
    paramValues.unshift(value);

    return func.apply(this, paramValues);
  };
}
