"use strict";

const React = require("react");
const dom = React.DOM;
const Attribute = React.createFactory(require("./attribute"));

function DOMNode(node) {
  if (node.isBeforePseudoElement || node.isAfterPseudoElement) {
    return PseudoElement(node);
  } else if (node.nodeType == Node.DOCUMENT_TYPE_NODE) {
    return DocType(node);
  } else if (node.nodeType == Node.ELEMENT_NODE) {
    return Element(node);
  } else if (node.nodeType == Node.COMMENT_NODE) {
    return Comment(node);
  } else if (node.nodeType == Node.TEXT_NODE) {
    return Text(node);
  }

  return ReadOnly(node);
}

function Element(node) {
  let attrs = [...node.attrs];
  return (
    dom.span({className: "editor"},
      dom.span({className: "open"},
        "<",
        dom.span({className: "tag theme-fg-color3", tabIndex: "0"},
          node.nodeName.toLowerCase()
        ),
        dom.span({},
          attrs.map(attr => Attribute(attr))
        ),
        dom.span({className: "newattr", tabIndex: "0"}),
        dom.span({className: "closing-bracket"},
          ">"
        )
      )
    )
  );
}

function Comment(node) {
  return (
    dom.span({className: "editor comment theme-comment"},
      dom.span({}, "<!--"),
      dom.pre({tabIndex: "0"}, node.shortValue),
      dom.span({}, "-->")
    )
  );
}

function Text(node) {
  return (
    dom.span({className: "editor text"},
      dom.pre({tabIndex: "0"}, node.shortValue)
    )
  );
}

function DocType(node) {
  return (
    dom.span({className: "editor comment"},
      dom.span({className: "tag"},
        "<!DOCTYPE " + node.name +
        (node.publicId ? " PUBLIC \"" + node.publicId + "\"" : "") +
        (node.systemId ? " \"" + node.systemId + "\"" : "") +
        ">"
      )
    )
  );
}

function PseudoElement(node) {
  return (
    dom.span({className: "editor"},
      dom.span({className: "tag theme-fg-color5"},
        node.isBeforePseudoElement ? "::before" : "::after"
      )
    )
  );
}

function ReadOnly(node) {
  return (
    dom.span({className: "editor"},
      dom.span({className: "tag"},
        node.nodeName
      )
    )
  );
}

module.exports = DOMNode;
