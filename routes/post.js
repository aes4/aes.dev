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
        let found = false;
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
                                    switch (req.body.t) {
                                        case 'document':
                                            data = await preparedata(du + 'Aes/options', dd + sreload[1], reload);
                                            break
                                        case 'file':
                                            data = await preparedata(du + 'Aes/options', df + sreload[1], reload);
                                            break
                                        case 'user':
                                            data = await preparedata(du + 'Aes/options', du + 'Aes/' + sreload[1], reload);
                                            break
                                    }
                                    data.filename = req.body.f;
                                    data.type = req.body.t;
                                    pack = ejs.render(await m(sreload[0], data), data);
                                    res.send(pack);
                                    break
                                case 'view':
                                    documentnames = await readdir(dd, 'utf8'); // ar
                                    for (u = 0; u < documentnames.length; u++) {
                                        if (cmd[1] == documentnames[u]) { // str
                                            data = await preparedata(du + 'Aes/options', dd + cmd[1], 'view ' + cmd[1]);
                                            data.filename = cmd[1];
                                            data.type = 'document';
                                            pack = ejs.render(await m('view', data), data);
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        filenames = await readdir(df, 'utf8');
                                        for (uu = 0; uu < filenames.length; uu++) {
                                            if (cmd[1] == filenames[uu]) {
                                                data = await preparedata(du + 'Aes/options', df + cmd[1], 'view ' + cmd[1]);
                                                data.filename = cmd[1];
                                                data.type = 'file';
                                                pack = ejs.render(await m('view', data), data);
                                                res.send(pack);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (cmd[1] == 'options' && !found) {
                                        data = await preparedata(du + 'Aes/options', du + 'Aes/' + cmd[1], 'view ' + cmd[1]);
                                        data.filename = cmd[1];
                                        data.type = 'user';
                                        pack = ejs.render(await m('view', data), data);
                                        res.send(pack);
                                        found = true;
                                    }
                                    if (cmd[1] == 'commands.txt' && !found) {
                                        data = await preparedata(du + 'Aes/options', du + 'Aes/' + cmd[1], 'view ' + cmd[1]);
                                        data.filename = cmd[1];
                                        data.type = 'user';
                                        pack = ejs.render(await m('view', data), data);
                                        res.send(pack);
                                        found = true;
                                    }
                                    if (!found) {
                                        data = await preparedata(du + 'Aes/options', dd + 'notfound', 'view notfound');
                                        data.filename = 'notfound';
                                        data.type = 'document';
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
                                            data.type = 'document';
                                            pack = ejs.render(await m('edit', data), data);
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        filenames = await readdir(df, 'utf8');
                                        for (uu = 0; uu < filenames.length; uu++) {
                                            if (cmd[1] == filenames[uu]) {
                                                data = await preparedata(du + 'Aes/options', df + cmd[1], 'edit ' + cmd[1]);
                                                data.filename = cmd[1];
                                                data.type = 'file';
                                                pack = ejs.render(await m('edit', data), data);
                                                res.send(pack);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (cmd[1] == 'options' && !found) {
                                        data = await preparedata(du + 'Aes/options', du + 'Aes/' + cmd[1], 'edit ' + cmd[1]);
                                        data.filename = cmd[1];
                                        data.type = 'user';
                                        pack = ejs.render(await m('edit', data), data);
                                        res.send(pack);
                                        found = true;
                                    }
                                    if (cmd[1] == 'commands.txt' && !found) {
                                        data = await preparedata(du + 'Aes/options', du + 'Aes/' + cmd[1], 'edit ' + cmd[1]);
                                        data.filename = cmd[1];
                                        data.type = 'user';
                                        pack = ejs.render(await m('edit', data), data);
                                        res.send(pack);
                                        found = true;
                                    }
                                    if (!found) {
                                        data = await preparedata(du + 'Aes/options', dd + 'notfound', 'view notfound');
                                        data.filename = 'notfound';
                                        data.type = 'document';
                                        pack = ejs.render(await m('view', data), data);
                                        res.send(pack);
                                    }
                                    break
                                case 'get':
                                    filenames = await readdir(df, 'utf8');
                                    for (u = 0; u < filenames.length; u++) {
                                        if (cmd[1] == filenames[u]) {
                                            res.sendFile(df + cmd[1]);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        documentnames = await readdir(dd, 'utf8');
                                        for (uu = 0; uu < documentnames.length; uu++) {
                                            if (cmd[1] == documentnames[uu]) { // str
                                                res.sendFile(dd + cmd[1]);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (cmd[1] == 'options' && !found) {
                                        res.sendFile(du + 'Aes/' + cmd[1]);
                                        found = true;
                                    }
                                    if (cmd[1] == 'commands.txt' && !found) {
                                        res.sendFile(du + 'Aes/' + cmd[1]);
                                        found = true;
                                    }
                                    if (!found) {
                                        data = await preparedata(du + 'Aes/options', dd + 'notfound', 'view notfound');
                                        data.filename = 'notfound';
                                        data.type = 'document';
                                        pack = ejs.render(await m('view', data), data);
                                        res.send(pack);
                                    }
                                    break
                                case 'save':
                                    reload = req.body.r;
                                    sreload = s(reload, " ");
                                    if (req.body.g.length > 0) {
                                        switch (req.body.t) {
                                            case 'document':
                                                data = await preparedata(du + 'Aes/options', dd + sreload[1], reload);
                                                writeFile(dd + req.body.f, req.body.g);
                                                break
                                            case 'file':
                                                data = await preparedata(du + 'Aes/options', df + sreload[1], reload);
                                                writeFile(df + req.body.f, req.body.g);
                                                break
                                            case 'user':
                                                data = await preparedata(du + 'Aes/options', du + 'Aes/' + sreload[1], reload);
                                                writeFile(du + 'Aes/' + req.body.f, req.body.g);
                                                break
                                        }
                                    }
                                    data.filename = req.body.f;
                                    data.type = req.body.t;
                                    let content_ = req.body.g;
                                    content = content_.split(`\n`);
                                    content.pop();  // temp, also temp in preparedata
                                    content = JSON.stringify(content);
                                    data.content = content;
                                    pack = ejs.render(await m(sreload[0], data), data);
                                    res.send(pack);
                                    break
                                default:
                                    data = await preparedata(du + 'Aes/options', dd + 'commandnotimplemented', 'view commandnotimplemented');
                                    data.filename = 'commandnotimplemented';
                                    data.type = 'document';
                                    pack = ejs.render(await m('view', data), data);
                                    res.send(pack);
                            }
                        } else if (i == cmds.length - 1 && ii == cmds[i].length - 1) {
                            if (!cmdfound) {
                                data = await preparedata(du + 'Aes/options', dd + 'commandnotfound', 'view commandnotfound');
                                data.filename = 'commandnotfound';
                                data.type = 'document';
                                pack = ejs.render(await m('view', data), data);
                                res.send(pack);
                            }
                        }
                    }
                }
            } else {
                data = await preparedata(du + 'Aes/options', dd + 'noargs', 'view noargs');
                data.filename = 'noargs';
                data.type = 'document';
                pack = ejs.render(await m('view', data), data);
                res.send(pack);
            }
        } else {
            res.end();
        }
    });
}
