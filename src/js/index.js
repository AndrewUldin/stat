'use strict';

var React = require('react');
var ReactDom = require('react-dom');
// Here we put our React instance to the global scope. Make sure you do not put it 
// into production and make sure that you close and open your console if the 
// DEV-TOOLS does not display
window.React = React; 

var data = require('../data/index');

var App = require('./App.jsx').App;
ReactDom.render(<App data={data} />, document.getElementById('App'));