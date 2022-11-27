var express, server;

express = require("express");

server = express();
server.use(express.urlencoded({extended: true}));
server.use(express.json());

server.set('trust proxy', true);
server.set('view engine', 'ejs');
server.set('views', __dirname);

require(__dirname + '/routes/root.js')(server);
require(__dirname + '/routes/post.js')(server);
require(__dirname + '/routes/git.js')(server);
require(__dirname + '/routes/sf.js')(server);

server.get('/favicon.ico', function (req, res) { res.sendFile(__dirname + '/files/favicon.ico'); });  // temp

//require(__dirname + '/routes/edit.js')(server);
require(__dirname + '/routes/any.js')(server);
require(__dirname + '/routes/temp.js')(server);  // super temp delete later, figure out something better

server.listen(12345);
