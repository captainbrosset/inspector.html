"use strict";

function getParent(state, node) {
  return state.dom.nodes[node.parent];
}

function getChildren(state, node) {
  return state.dom.nodes[node.actor].children;
}

module.exports = {
  getChildren,
  getParent
};
