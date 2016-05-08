'use strict';

var data = require('../data/index');

var innerText = {
    data: data.innerText,
    app: require('./innerText.jsx')
}
var blockOne = {
    data: data.blockOne,
    app: require('./blockOne.jsx')
}

new innerText.app(innerText.data, document.getElementById('innerText'));
new blockOne.app(blockOne.data, document.getElementById('blockOne'));


if ((!window.pluso || "function" != typeof window.pluso.start) && void 0 == window.ifpluso) {
    window.ifpluso = 1;
    var a = document,
        b = a.createElement("script"),
        c = "getElementsByTagName";
    b.type = "text/javascript", b.charset = "UTF-8", b.async = !0, b.src = ("https:" == window.location.protocol ? "https" : "http") + "://share.pluso.ru/pluso-like.js";
    var d = a[c]("body")[0];
    d.appendChild(b)
}