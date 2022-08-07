var ejs;
const {readFile, writeFile} = require('fs').promises;
const {preparedata} = require("../functions.js");

ejs = require("ejs");
m = require("../make.js");

// directory paths
const du = '/home/ubuntu/aes/users/';
const ds = '/home/ubuntu/aes/snippets/';
const dup = '/home/ubuntu/aes/upload/';
const dd = '/home/ubuntu/aes/documents/';
const df = '/home/ubuntu/aes/files/';
const da = '/home/ubuntu/aes/data/';
const dr = '/home/ubuntu/aes/routes/';

module.exports = function(server) {
    server.get('/', async function (req, res) {
        let data;
        let ip = await readFile(da + 'ip.txt', 'utf8');
        if (req.ip == ip) {
            data = await preparedata(du + 'Aes/options', dd + 'home', 'view home');
            pack = ejs.render(await m('view'), data);
            res.send(pack);
        } else {
            data = await preparedata(da + 'options', dd + 'home', 'view home');
            pack = ejs.render(await m('view'), data);
            res.send(pack);
        }
    });
}
