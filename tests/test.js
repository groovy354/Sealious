var Mocha = require("mocha");
var mocha = new Mocha();

var fs = require("fs");
var path = require("path");

var Sealious = require("../lib/main.js");

Sealious.test();