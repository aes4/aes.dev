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
                                        case 'xi':
                                            data = await preparedata(du + 'Aes/options', dx + sreload[1], reload);
                                            break
                                        case 'splice':
                                            data = await preparedata(du + 'Aes/options', dsp + sreload[1], reload);
                                            break
                                        case 'user':
                                            data = await preparedata(du + 'Aes/options', du + 'Aes/' + sreload[1], reload);
                                            break
                                    }
                                    data.filename = req.body.f;
                                    data.type = req.body.t;
                                    content_ = req.body.g;
                                    content = content_.split(`\n`);
                                    content.pop();  // temp, also temp in preparedata
                                    content = JSON.stringify(content);
                                    data.content = content;
                                    data.splice = '[""]';
                                    pack = ejs.render(await m(sreload[0], data), data);
                                    res.send(pack);
                                    // return content
                                    break
                                case 'view':
                                    documentnames = await readdir(dd, 'utf8'); // ar
                                    for (let a = documentnames.length - 1; a >= 0; a--) {
                                        if (cmd[1] == documentnames[a]) { // str
                                            pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'document',
                                            { content: dd + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        filenames = await readdir(df, 'utf8');
                                        for (let b = filenames.length - 1; b >= 0; b--) {
                                            if (cmd[1] == filenames[b]) {
                                                pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'file',
                                                { content: df + cmd[1], options: du + 'Aes/options' });
                                                res.send(pack);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) {
                                        splicenames = await readdir(dsp, 'utf8');
                                        for (let c = splicenames.length - 1; c >= 0; c--) {
                                            if (cmd[1] == splicenames[c]) {
                                                pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'splice',
                                                { content: dsp + cmd[1], options: du + 'Aes/options' });
                                                res.send(pack);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) {
                                        notenames = await readdir(dx, 'utf8');
                                        for (let d = notenames.length - 1; d >= 0; d--) {
                                            if (cmd[1] == notenames[d]) {
                                                pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'splice',
                                                { content: dx + cmd[1], options: du + 'Aes/options' });
                                                res.send(pack);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (cmd[1] == 'options' && !found) {
                                        pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'user',
                                        { content: du + 'Aes/' + cmd[1], options: du + 'Aes/options' });
                                        res.send(pack);
                                        found = true;
                                    }
                                    if (cmd[1] == 'commands.txt' && !found) {
                                        pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'user',
                                        { content: du + 'Aes/' + cmd[1], options: du + 'Aes/options' });
                                        res.send(pack);
                                        found = true;
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'viewdocument':
                                    documentnames = await readdir(dd, 'utf8'); // ar
                                    for (let a = documentnames.length - 1; a >= 0; a--) {
                                        if (cmd[1] == documentnames[a]) { // str
                                            pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'document',
                                            { content: dd + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'viewfile':
                                    filenames = await readdir(df, 'utf8');
                                    for (let b = filenames.length - 1; b >= 0; b--) {
                                        if (cmd[1] == filenames[b]) {
                                            pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'file',
                                            { content: df + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'viewsplice':
                                    splicenames = await readdir(dsp, 'utf8');
                                    for (let c = splicenames.length - 1; c >= 0; c--) {
                                        if (cmd[1] == splicenames[c]) {
                                            pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'splice',
                                            { content: dsp + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'viewnote':
                                    notenames = await readdir(dx, 'utf8');
                                    for (let d = notenames.length - 1; d >= 0; d--) {
                                        if (cmd[1] == notenames[d]) {
                                            pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'splice',
                                            { content: dx + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'edit':
                                    documentnames = await readdir(dd, 'utf8');
                                    for (let a = documentnames.length - 1; a >= 0; a--) {
                                        if (cmd[1] == documentnames[a]) { // str
                                            pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'document',
                                            { content: dd + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        filenames = await readdir(df, 'utf8');
                                        for (let b = filenames.length - 1; b >= 0; b--) {
                                            if (cmd[1] == filenames[b]) {
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'file',
                                                { content: df + cmd[1], options: du + 'Aes/options' });
                                                res.send(pack);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) {
                                        notenames = await readdir(dx, 'utf8');
                                        for (let d = notenames.length - 1; d >= 0; d--) {
                                            if (cmd[1] == notenames[d]) {
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'file',
                                                { content: dx + cmd[1], options: du + 'Aes/options' });
                                                res.send(pack);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) {
                                        splicenames = await readdir(dsp, 'utf8');
                                        for (let c = splicenames.length - 1; c >= 0; c--) {
                                            if (cmd[1] == splicenames[c]) {
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'file',
                                                { content: dsp + cmd[1], options: du + 'Aes/options' });
                                                res.send(pack);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (cmd[1] == 'options' && !found) {
                                        pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'user',
                                        { content: du + 'Aes/' + cmd[1], options: du + 'Aes/options' });
                                        res.send(pack);
                                        found = true;
                                    }
                                    if (cmd[1] == 'commands.txt' && !found) {
                                        pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'user',
                                        { content: du + 'Aes/' + cmd[1], options: du + 'Aes/options' });
                                        res.send(pack);
                                        found = true;
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'editdocument':
                                    documentnames = await readdir(dd, 'utf8');
                                    for (let a = documentnames.length - 1; a >= 0; a--) {
                                        if (cmd[1] == documentnames[a]) { // str
                                            pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'document',
                                            { content: dd + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'editfile':
                                    filenames = await readdir(df, 'utf8');
                                    for (let b = filenames.length - 1; b >= 0; b--) {
                                        if (cmd[1] == filenames[b]) {
                                            pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'file',
                                            { content: df + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'editnote':
                                    notenames = await readdir(dx, 'utf8');
                                    for (let d = notenames.length - 1; d >= 0; d--) {
                                        if (cmd[1] == notenames[d]) {
                                            pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'file',
                                            { content: dx + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
                                        res.send(pack);
                                    }
                                    break
                                case 'editsplice':
                                    splicenames = await readdir(dsp, 'utf8');
                                    for (let c = splicenames.length - 1; c >= 0; c--) {
                                        if (cmd[1] == splicenames[c]) {
                                            pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'file',
                                            { content: dsp + cmd[1], options: du + 'Aes/options' });
                                            res.send(pack);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
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
                                        pack = await preparepack('view', 'view notfound', 'notfound', 'document',
                                        { content: dd + 'notfound', options: du + 'Aes/options' });
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
                                            case 'xi':
                                                data = await preparedata(du + 'Aes/options', dx + sreload[1], reload);
                                                writeFile(dx + req.body.f, req.body.g);
                                                break
                                            case 'splice':
                                                data = await preparedata(du + 'Aes/options', dsp + sreload[1], reload);
                                                writeFile(dsp + req.body.f, req.body.g);
                                                break
                                            case 'user':
                                                data = await preparedata(du + 'Aes/options', du + 'Aes/' + sreload[1], reload);
                                                writeFile(du + 'Aes/' + req.body.f, req.body.g);
                                                break
                                        }
                                    }
                                    data.filename = req.body.f;
                                    data.type = req.body.t;
                                    content_ = req.body.g;
                                    content = content_.split(`\n`);
                                    content.pop();  // temp, also temp in preparedata
                                    content = JSON.stringify(content);
                                    data.content = content;
                                    data.pos = req.body.p;
                                    data.splice = '[""]';
                                    pack = ejs.render(await m(sreload[0], data), data);
                                    res.send(pack);
                                    break
                                case 'grab':
                                    reload = req.body.r;  // e test or e test;grab g
                                    // sreload = s(reload, ";")
                                    sreload = s(reload, " ");
                                    pos = req.body.p;
                                    for (let u = 0; u < cmds.length; u++) {
                                        for (let uu = 0; uu < cmds[u].length; uu++) {
                                            if (sreload[0] == cmds[u][uu]) {
                                                switch (req.body.t) {  // what if unknown type
                                                    case 'document':  // in future 2nd arg reload should have ...ad[1] + ';grab ' + cmd[1]  // e test;grab g
                                                        pack = await preparepack(cmds[u][0], cmds[u][0] + ' ' + sreload[1], sreload[1], 'document',
                                                        { content: dd + sreload[1], options: du + 'Aes/options', splice: dsp + cmd[1] }, pos, cmd[1]);
                                                        break
                                                    case 'file':
                                                        pack = await preparepack(cmds[u][0], cmds[u][0] + ' ' + sreload[1], sreload[1], 'file',
                                                        { content: df + sreload[1], options: du + 'Aes/options', splice: dsp + cmd[1] }, pos, cmd[1]);
                                                        break
                                                    case 'xi':
                                                        pack = await preparepack(cmds[u][0], cmds[u][0] + ' ' + sreload[1], sreload[1], 'xi',
                                                        { content: dx + sreload[1], options: du + 'Aes/options', splice: dsp + cmd[1] }, pos, cmd[1]);
                                                        break
                                                    case 'splice':
                                                        pack = await preparepack(cmds[u][0], cmds[u][0] + ' ' + sreload[1], sreload[1], 'splice',
                                                        { content: dsp + sreload[1], options: du + 'Aes/options', splice: dsp + cmd[1] }, pos, cmd[1]);
                                                        break
                                                    case 'user':
                                                        pack = await preparepack(cmds[u][0], cmds[u][0] + ' ' + sreload[1], sreload[1], 'user',
                                                        { content: du + 'Aes/' + sreload[1], options: du + 'Aes/options', splice: dsp + cmd[1] }, pos, cmd[1]);
                                                        break
                                                }
                                            }
                                        }
                                    }
                                    res.send(pack);
                                    break
                                default:
                                    pack = await preparepack('view', 'view commandnotimplemented', 'commandnotimplemented', 'document',
                                    { content: dd + 'commandnotimplemented', options: du + 'Aes/options' });
                                    res.send(pack);
                            }
                        } else if (i == cmds.length - 1 && ii == cmds[i].length - 1) {
                            if (!cmdfound) {
                                pack = await preparepack('view', 'view commandnotfound', 'commandnotfound', 'document',
                                { content: dd + 'commandnotfound', options: du + 'Aes/options' });
                                res.send(pack);
                            }
                        }
                    }
                }
            } else {
                pack = await preparepack('view', 'view noargs', 'noargs', 'document', { content: dd + 'noargs', options: du + 'Aes/options' });
                res.send(pack);
            }
        } else {
            res.end();
        }
    });
}
