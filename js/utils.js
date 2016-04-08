"use strict";

function _getIn(destObj, path) {
  return path.reduce(function(acc, name) {
    return acc[name];
  }, destObj);
}

function mergeIn(destObj, path, value) {
  path = [...path];
  path.reverse();
  var obj = path.reduce(function(acc, name) {
    return { [name]: acc };
  }, value);

  return destObj.merge(obj, { deep: true });
}

function setIn(destObj, path, value) {
  destObj = mergeIn(destObj, path, null);
  return mergeIn(destObj, path, value);
}

function updateIn(destObj, path, fn) {
  return setIn(destObj, path, fn(_getIn(destObj, path)));
}

function deleteIn(destObj, path) {
  const objPath = path.slice(0, -1);
  const propName = path[path.length - 1];
  const obj = _getIn(destObj, objPath);
  return setIn(destObj, objPath, obj.without(propName));
}

module.exports = {
  mergeIn,
  setIn,
  updateIn,
  deleteIn
};
