var ejs;
const {readFile, writeFile, readdir} = require('fs').promises;
const {preparedata} = require("../functions.js");

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
    server.get('/edit/:any', async function (req, res) {
        // can't post quick fix is to make a post for edit maybe
        let data;
        let documentnames = await readdir(dd, 'utf8');
        let notsent = true;
        let ip = await readFile(da + 'ip.txt', 'utf8');
        for (i = 0; i < documentnames.length; i++) {
            if (req.params.any == documentnames[i]) {
                if (req.ip == ip) {
                    data = await preparedata(du + 'Aes/options', dd + req.params.any, 'edit' + req.params.any);
                    data.filename = req.params.any;
                    data.type = 'document';
                    pack = ejs.render(await m('edit', data), data);
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
                        data = await preparedata(du + 'Aes/options', df + req.params.any, 'edit' + req.params.any);
                        data.filename = req.params.any;
                        data.type = 'file';
                        pack = ejs.render(await m('edit', data), data);
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
                data = await preparedata(du + 'Aes/options', du + 'Aes/' + req.params.any, 'edit ' + req.params.any);
                data.filename = req.params.any;
                data.type = 'user';
                pack = ejs.render(await m('edit', data), data);
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
                data = await preparedata(du + 'Aes/options', du + 'Aes/' + req.params.any, 'edit ' + req.params.any);
                data.filename = req.params.any;
                data.type = 'user';
                pack = ejs.render(await m('edit', data), data);
                res.send(pack);
                notsent = false;
            } else {
                res.end();  // not yet
                notsent = false;
            }
        }
        if (notsent) {
            if (req.ip == ip) {
                data = await preparedata(du + 'Aes/options', dd + 'notfound', 'view notfound');
                data.filename = 'notfound';
                data.type = 'document';
                pack = ejs.render(await m('view', data), data);
                res.send(pack);
            } else {
                data = await preparedata(da + 'options', dd + 'notfound', 'view notfound');
                data.filename = 'notfound';
                data.type = 'document';
                pack = ejs.render(await m('view', data), data);
                res.send(pack);
            }
        }
    });
}
