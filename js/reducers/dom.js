"use strict";

const Immutable = require("seamless-immutable");
const constants = require("../constants.js");
const { mergeIn } = require("../utils.js");

const initialState = Immutable({
  selectedNode: null,
  rootNode: null,
  // Indexed by node actorIDs. Contains information about the state of the node.
  nodes: {}
});

module.exports = function(state = initialState, action) {
  switch (action.type) {
    case constants.ADD_NODE:
      return state.setIn(["nodes", action.node.actor, "actor"], action.node);
    case constants.ADD_CHILDREN:
      return state.setIn(["nodes", action.parent.actor, "children"],
                         action.children.map(n => n.actor));
    case constants.SET_ROOT_NODE:
      return state.merge({
        rootNode: action.node.actor
      });
    case constants.SELECT_NODE:
      return state.merge({
        selectedNode: action.node.actor
      });
    case constants.COLLAPSE_NODE:
      return mergeIn(state, ["nodes", action.node.actor, "isExpanded"], false);
    case constants.EXPAND_NODE:
      if (action.status === "done") {
        return mergeIn(state, ["nodes", action.value.actor, "isExpanded"], true);
      }
      break;
  }

  return state;
};
