#!/usr/bin/env node
/// <reference path="typings/node/node.d.ts"/>

var express = require('express');
var serveStatic = require('serve-static');
var app = express();
var colors = require('colors/safe');
var path = require('path');

app.use(serveStatic(path.join(__dirname, 'dist')));
app.use(serveStatic(path.join(__dirname, 'app')));
app.use(serveStatic(__dirname));
app.listen(3000);

console.log(colors.green.underline('Serving app at http://localhost:3000'));