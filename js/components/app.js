"use strict";

const React = require("react");
const { connect } = require("react-redux");
const {DOM: dom, createClass, createFactory} = React;
const DOMTree = createFactory(require("./tree"));

const App = createClass({
  displayName: "App",

  render() {
    return dom.div({}, DOMTree(this.props.dom));
  }
});

module.exports = connect(state => state)(App);
