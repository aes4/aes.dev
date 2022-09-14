var ejs;
const {readFile, writeFile, readdir} = require('fs').promises;
const {preparedata, rs, s, j} = require("../functions.js");

ejs = require("ejs");
m = require("../make.js");
p = require("../process.js");

// directory paths
const du = '/home/ubuntu/aes.dev/users/';
const ds = '/home/ubuntu/aes.dev/snippets/';
const dup = '/home/ubuntu/aes.dev/upload/';
const dd = '/home/ubuntu/aes.dev/documents/';
const df = '/home/ubuntu/aes.dev/files/';
const da = '/home/ubuntu/aes.dev/data/';
const dr = '/home/ubuntu/aes.dev/routes/';

module.exports = function(server) {
    server.post('/post', async function (req, res) {
        let data, reload, documentnames;
        let ip = await readFile(da + 'ip.txt', 'utf8');
        let cmdfound = false;
        let docfound = false;
        let notsent = true;
        if (req.ip == ip) {
            let cmd = req.body.c;
            if (cmd.includes(" ")) {
                cmd = s(cmd, " ");
                let cmds = await rs(du + 'Aes/commands.txt');
                for (let i = 0; i < cmds.length; i++) {
                    cmds[i] = cmds[i].split(",");
                    for (let ii = 0; ii < cmds[i].length; ii++) {
                        if (cmd[0] == cmds[i][ii]) {
                            cmdfound = true;
                            switch (cmds[i][0]) {
                                case 'option':
                                    let optionsdata = await readFile(du + 'Aes/options');  // read twice
                                    cmd[0] = 'option';
                                    p({cmd: cmd, options: optionsdata});
                                    reload = req.body.r;
                                    sreload = s(reload, " ");
                                    data = await preparedata(du + 'Aes/options', dd + sreload[1], reload);
                                    if (sreload[0] == 'edit') {  // this of solution to get rid of this later maybe filename = NULL
                                        data.filename = cmd[i];
                                        data.loc = 'docs'
                                    }
                                    pack = ejs.render(await m(sreload[0], data), data);
                                    res.send(pack);
                                    break
                                case 'view':
                                    documentnames = await readdir(dd, 'utf8'); // ar
                                    for (u = 0; u < documentnames.length; u++) {
                                        if (cmd[1] == documentnames[u]) { // str
                                            data = await preparedata(du + 'Aes/options', dd + cmd[1], 'view ' + cmd[1]);
                                            pack = ejs.render(await m('view', data), data);
                                            res.send(pack);
                                            docfound = true;
                                        }
                                    }
                                    if (cmd[1] == 'options' && !docfound) {
                                        data = await preparedata(du + 'Aes/options', du + 'Aes/options', 'view ' + cmd[1]);
                                        pack = ejs.render(await m('view', data), data);
                                        res.send(pack);
                                        docfound = true;
                                    }
                                    if (!docfound) {
                                        data = await preparedata(du + 'Aes/options', dd + 'docnotfound', 'view docnotfound');
                                        pack = ejs.render(await m('view', data), data);
                                        res.send(pack);
                                    }
                                    break
                                case 'edit':
                                    documentnames = await readdir(dd, 'utf8');
                                    for (u = 0; u < documentnames.length; u++) {
                                        if (cmd[1] == documentnames[u]) { // str
                                            data = await preparedata(du + 'Aes/options', dd + cmd[1], 'edit ' + cmd[1]);
                                            data.filename = cmd[1];
                                            data.loc = 'docs'  // not sure
                                            pack = ejs.render(await m('edit', data), data);
                                            res.send(pack);
                                            notsent = false;
                                            docfound = true;
                                        }
                                    }
                                    if (!docfound) {
                                        data = await preparedata(du + 'Aes/options', dd + 'docnotfound', 'view docnotfound');
                                        pack = ejs.render(await m('view', data), data);
                                        res.send(pack);
                                    }
                                    break
                                default:
                                    data = await preparedata(du + 'Aes/options', dd + 'commandnotimplemented', 'viewcommandnotimplemented');
                                    pack = ejs.render(await m('view', data), data);
                                    res.send(pack);
                            }
                        } else if (i == cmds.length - 1 && ii == cmds[i].length - 1) {
                            if (!cmdfound) {
                                data = await preparedata(du + 'Aes/options', dd + 'commandnotfound', 'view commandnotfound');
                                pack = ejs.render(await m('view', data), data);
                                res.send(pack);
                            }
                        }
                    }
                }
            } else {
                data = await preparedata(du + 'Aes/options', dd + 'noargs', 'view noargs');
                pack = ejs.render(await m('view', data), data);
                res.send(pack);
            }
        } else {
            res.end();
        }
    });
}
