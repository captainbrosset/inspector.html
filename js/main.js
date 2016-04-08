"use strict";

const { createFactory, createElement } = require("react");
const ReactDOM = require("react-dom");
const { createStore, combineReducers, applyMiddleware } = require("redux");
const { Provider } = require("react-redux");
const { promise } = require("devtools/client/shared/redux/middleware/promise");
const { thunk } = require("devtools/client/shared/redux/middleware/thunk");
const reducers = require("./reducers");
const actions = require("./actions");
const App = createFactory(require("./components/app"));

const { DebuggerClient } = require("devtools/shared/client/main");
const { DebuggerTransport } = require("devtools/transport/transport");
const { TargetFactory } = require("devtools/client/framework/target");

const socket = new WebSocket("ws://localhost:9000");
const transport = new DebuggerTransport(socket);
const client = new DebuggerClient(transport);

client.connect().then(() => {
  return client.listTabs().then(response => {
    const tab = response.tabs[response.selected];
    const options = { form: tab, client, chrome: false };
    return TargetFactory.forRemoteTab(options).then(target => {
      return client.request({
        to: target.form.inspectorActor,
        type: "getWalker"
      }).then(({walker}) => {
        startup(target, walker);
      });
    });
  });
}).catch(e => console.error(e));

function startup(target, walker) {
  let store = createStore(combineReducers(reducers),
                          applyMiddleware(thunk, promise));
  let provider = createElement(Provider, { store }, App());

  window.gStore = store;
  window.gActions = actions;
  window.gClient = client;
  window.gWalker = walker;

  ReactDOM.render(provider, document.querySelector("#mount"));

  store.dispatch(actions.setRootNode());
  store.dispatch(actions.selectDefaultNode());
}

/*

function displayNode(node, rootEl) {
  let nodeEl = document.createElement("li");
  rootEl.appendChild(nodeEl);
  nodeEl.textContent = node.nodeName;
  return nodeEl;
}

function displayTree(client, walker, node, rootEl = mountEl) {
  let nodeEl = displayNode(node, rootEl);

  let containerEl = document.createElement("ul");
  nodeEl.appendChild(containerEl);

  client.request({
    to: walker.actor,
    type: "children",
    node: node.actor
  }).then(({nodes}) => {
    if (nodes && nodes.length) {
      for (let childNode of nodes) {
        displayTree(client, walker, childNode, containerEl);
      }
    }
  }, e => console.error(e));
}

*/
