var ejs;
const {readFile, writeFile} = require('fs').promises;
const {preparepack, preparedata} = require("../functions.js");

ejs = require("ejs");
m = require("../make.js");

// directory paths
const du = '/home/ubuntu/aes.dev/users/';
const ds = '/home/ubuntu/aes.dev/snippets/';
const dd = '/home/ubuntu/aes.dev/documents/';
const df = '/home/ubuntu/aes.dev/files/';
const dx = '/home/ubuntu/aes.dev/xi/'; // ?
const dsp = '/home/ubuntu/aes.dev/splices/';
const da = '/home/ubuntu/aes.dev/data/';
const dr = '/home/ubuntu/aes.dev/routes/';

module.exports = function(server) {
    server.get('/', async function (req, res) {
        let data;
        let ip = await readFile(da + 'ip.txt', 'utf8');
        if (req.ip == ip) {
            pack = await preparepack('view', 'view home', 'home', 'document', { content: dd + 'home', options: du + 'Aes/options' });
            res.send(pack);
        } else {
            pack = await preparepack('view', 'view home', 'home', 'document', { content: dd + 'home', options: da + 'options' });
            res.send(pack);
        }
    });
}
