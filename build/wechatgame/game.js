require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "https://data.tianziyou.com/matchvsGamesRes/doubleshoot";
wxDownloader.SUBCONTEXT_ROOT = "";
require('src/settings.65c6f');
require('main.754cf');