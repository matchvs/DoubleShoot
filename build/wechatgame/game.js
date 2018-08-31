require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "https://data.tianziyou.com/matchvsGamesRes/doubleshoot";
wxDownloader.SUBCONTEXT_ROOT = "";
require('src/settings.73c08');
require('main.ffc89');