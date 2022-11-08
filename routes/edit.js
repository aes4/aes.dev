var ejs;
const {readFile, writeFile, readdir} = require('fs').promises;
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
    server.get('/edit/:any', async function (req, res) {
        // can't post quick fix is to make a post for edit maybe
        let data;
        let documentnames = await readdir(dd, 'utf8');
        let notsent = true;
        let ip = await readFile(da + 'ip.txt', 'utf8');
        for (i = 0; i < documentnames.length; i++) {
            if (req.params.any == documentnames[i]) {
                if (req.ip == ip) {
                    pack = await preparepack('edit', 'edit ' + req.params.any, req.params.any, 'document',
                    { content: dd + req.params.any, options: du + 'Aes/options' });
                    res.send(pack);
                    notsent = false;
                    break
                } else {
                    res.end();  // not yet
                    notsent = false;
                }
            }
        }
        if (notsent) {
            let filenames = await readdir(df, 'utf8');
            for (ii = 0; ii < filenames.length; ii++) {
                if (req.params.any == filenames[ii]) {
                    if (req.ip == ip) {
                        pack = await preparepack('edit', 'edit ' + req.params.any, req.params.any, 'file',
                        { content: df + req.params.any, options: du + 'Aes/options' });
                        res.send(pack);
                        notsent = false;
                        break
                    } else {
                        res.end();  // not yet
                        notsent = false;
                    }
                }
            }
        }
        if (req.params.any == 'options' && notsent) {
            if (req.ip == ip) {
                pack = await preparepack('edit', 'edit ' + req.params.any, req.params.any, 'user',
                { content: du + 'Aes/' + req.params.any, options: du + 'Aes/options' });
                res.send(pack);
                notsent = false;
            } else {
                res.end();  // not yet
                notsent = false;
            }
        }
        if (req.params.any == 'commands.txt' && notsent) {
            console.log('e');
            if (req.ip == ip) {
                pack = await preparepack('edit', 'edit ' + req.params.any, req.params.any, 'user',
                { content: du + 'Aes/' + req.params.any, options: du + 'Aes/options' });
                res.send(pack);
                notsent = false;
            } else {
                res.end();  // not yet
                notsent = false;
            }
        }
        if (notsent) {
            if (req.ip == ip) {
                pack = await preparepack('view', 'view notfound', 'notfound', 'document', { content: dd + 'notfound', options: du + 'Aes/options' });
                res.send(pack);
            } else {
                pack = await preparepack('view', 'view notfound', 'notfound', 'document', { content: dd + 'notfound', options: da + 'options' });
                res.send(pack);
            }
        }
    });
}
