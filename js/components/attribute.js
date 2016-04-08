"use strict";

const React = require("react");
const dom = React.DOM;

const COLLAPSE_DATA_URL_REGEX = /^data.+base64/;
const COLLAPSE_ATTRIBUTE_LENGTH = 120;
const COLLAPSE_DATA_URL_LENGTH = 60;

function getValue(value) {
  let maxLength = value.match(COLLAPSE_DATA_URL_REGEX)
                  ? COLLAPSE_DATA_URL_LENGTH
                  : COLLAPSE_ATTRIBUTE_LENGTH;
  let str = value;

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, Math.ceil(maxLength / 2)) +
         "…" +
         str.substring(str.length - Math.floor(maxLength / 2));
}

function Attribute({ name, value }) {
  return (
    dom.span({className: "attreditor"},
      dom.span({className: "editable", tabIndex: "0"},
        " ",
        dom.span({className: "attr-name theme-fg-color2"}, name),
        "=\"",
        dom.span({className: "attr-value theme-fg-color6"}, getValue(value)),
        "\""
      )
    )
  );
}

module.exports = Attribute;
