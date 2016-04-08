"use strict";

const React = require("react");
const {DOM: dom, createClass, createFactory} = React;
const DOMNode = createFactory(require("./dom-node"));

let DOMTree = createClass({
  displayName: "DOMTree",

  render: function() {
    let selectedId = this.props.selectedNode;
    let rootId = this.props.rootNode;
    let nodes = this.props.nodes;

    if (!selectedId || !nodes[selectedId] || !rootId || !nodes[rootId]) {
      return null;
    }

    return DOMTreeNode(nodes[rootId], nodes, selectedId,
                       node => gStore.dispatch(gActions.selectNode(node)),
                       node => gStore.dispatch(gActions.expandNode(node)),
                       node => gStore.dispatch(gActions.collapseNode(node)));
  }
});

function DOMTreeNode({ actor, isExpanded, children }, nodes, selectedId, selectNode, expandNode, collapseNode) {
  let isSelected = actor.actor === selectedId;

  let renderChildren = () => {
    if (!isExpanded || !children) {
      return null;
    }

    return [...children].map(child => {
      return DOMTreeNode(nodes[child], nodes, selectedId, selectNode, expandNode, collapseNode);
    });
  };

  return (
    dom.li({onClick: e => {
              e.stopPropagation();
              selectNode(actor);
            },
            className: isExpanded ? "child" : "child collapsed"},
      dom.div({className: "tag-line"},
        dom.span({className: "tag-state" +
                             (isSelected ? " theme-selected" : "")}),
        actor.numChildren > 0
          ? dom.span({onClick: e => {
                        e.stopPropagation();
                        isExpanded ? collapseNode(actor) : expandNode(actor);
                      },
                      className: "theme-twisty expander" +
                                 (isExpanded ? " expanded" : "") })
          : null,
        DOMNode(actor)
      ),
      dom.ul({className: "children"}, renderChildren())
    )
  );
}

module.exports = DOMTree;
