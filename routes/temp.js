var ejs;
const {readFile, writeFile, readdir} = require('fs').promises;
const {preparepack, preparedata, rs, s, j} = require("../functions.js");

ejs = require("ejs");
m = require("../make.js");
p = require("../process.js");

// directory paths
const du = '/home/ubuntu/aes.dev/users/';
const ds = '/home/ubuntu/aes.dev/snippets/';
const dd = '/home/ubuntu/aes.dev/documents/';
const df = '/home/ubuntu/aes.dev/files/';
const dx = '/home/ubuntu/aes.dev/xi/';
const dsp = '/home/ubuntu/aes.dev/splices/';
const da = '/home/ubuntu/aes.dev/data/';
const dr = '/home/ubuntu/aes.dev/routes/';

module.exports = function(server) {
    server.post('/temp', async function (req, res) {
        let ip = await readFile(da + 'ip.txt', 'utf8');
        let c = req.body.c;
        let found = false;
        if (req.ip == ip) {
            notenames = await readdir(dx, 'utf8');
            for (let i = notenames.length - 1; i >= 0; i--) {
                if (c == notenames[i]) {
                    let note = await readFile(dx + c, 'utf8');
                    note = note.split(`\n`);
                    note.pop();
                    note = JSON.stringify(note);
                    res.send(note);
                    found = true;
                }
            }
            if (!found) {
                res.end();
            }
        }
    });
}
