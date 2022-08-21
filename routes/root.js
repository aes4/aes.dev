var ejs;
const {readFile, writeFile} = require('fs').promises;
const {preparepack, preparedata} = require("../functions.js");

ejs = require("ejs");
m = require("../make.js");

// directory paths
const du = '/home/ubuntu/aes.dev/users/';
const ds = '/home/ubuntu/aes.dev/snippets/';
const dup = '/home/ubuntu/aes.dev/upload/';
const dd = '/home/ubuntu/aes.dev/documents/';
const df = '/home/ubuntu/aes.dev/files/';
const da = '/home/ubuntu/aes.dev/data/';
const dr = '/home/ubuntu/aes.dev/routes/';

module.exports = function(server) {
    server.get('/', async function (req, res) {
        let data;
        let ip = await readFile(da + 'ip.txt', 'utf8');
        if (req.ip == ip) {
            pack = await preparepack('view', du + 'Aes/options', dd + 'home', 'view home');
            res.send(pack);
        } else {
            data = await preparedata(da + 'options', dd + 'home', 'view home');
            pack = ejs.render(await m('view'), data);
            res.send(pack);
        }
    });
}
