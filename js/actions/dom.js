"use strict";

const { Task } = require("devtools/sham/task");
const constants = require("../constants.js");
const { getParent, getChildren } = require("../queries.js");
const { PROMISE } = require("devtools/client/shared/redux/middleware/promise");

function addNode(node) {
  return (dispatch, getState) => {
    let known = getState().dom.nodes;
    if (!known[node.actor]) {
      return dispatch({ type: constants.ADD_NODE, node });
    }
  };
}

function addChildren(parent, children) {
  return (dispatch, getState) => {
    for (let child of children) {
      dispatch(addNode(child));
    }

    return dispatch({ type: constants.ADD_CHILDREN, parent, children });
  };
}

function selectDefaultNode() {
  return selectSelector("body");
}

function selectSelector(selector) {
  return (dispatch, getState) => {
    return dispatch({
      type: constants.SELECT_SELECTOR,
      [PROMISE]: Task.spawn(function*() {
        let {node, newParents} = yield gClient.request({
          to: gWalker.actor,
          type: "querySelector",
          node: gWalker.root.actor,
          selector
        });

        dispatch(selectNode(node, newParents));
      })
    });
  };
}

function selectNode(node, newParents = []) {
  return (dispatch, getState) => {
    // Add all new parents since we don't know about them yet.
    for (let newParent of newParents) {
      dispatch(addNode(newParent));
    }

    // And expand all new parents.
    let current = getParent(getState(), node);
    while (current) {
      dispatch(expandNode(current.actor));
      current = getParent(getState(), current.actor);
    }

    return dispatch({ type: constants.SELECT_NODE, node });
  };
}

function setRootNode(node = gWalker.root) {
  return (dispatch, getState) => {
    dispatch(addNode(node));
    return dispatch({ type: constants.SET_ROOT_NODE, node });
  };
}

function expandNode(node) {
  return (dispatch, getState) => {
    return dispatch({
      type: constants.EXPAND_NODE,
      [PROMISE]: Task.spawn(function*() {
        if (!getChildren(getState(), node)) {
          let {nodes} = yield gClient.request({
            to: gWalker.actor,
            type: "children",
            node: node.actor,
          });
          dispatch(addChildren(node, nodes));
        }

        return node;
      })
    });
  };
}

function collapseNode(node) {
  return { type: constants.COLLAPSE_NODE, node };
}

module.exports = {
  collapseNode,
  expandNode,
  selectDefaultNode,
  selectNode,
  selectSelector,
  setRootNode
};
