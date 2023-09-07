var ejs;
const {readFile, writeFile, readdir} = require('fs').promises;
const {preparepack, preparedata, rs, s, j} = require("../functions.js");
const AWS = require('aws-sdk');

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
const dsf = '/home/ubuntu/aes.dev/sf/';

AWS.config.update({ region: 'us-west-1' });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const up = process.env.ENABLE_S3_UPLOAD ? process.env.ENABLE_S3_UPLOAD === 'true' : false;
const bn = 'raw-aes-dev';

async function idk(dp, info, stype) {
    n = await readdir(dp, 'utf8'); // ar
    for (let i = n.length - 1; i >= 0; i--) {
        if (info == n[i]) { // str
            pack = await preparepack('view', 'view ' + info, info, stype,
            { content: dp + cmd[1], options: du + 'Aes/options' });
            res.send(pack);
            return true;
        }
    }
}

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
                                        case 'server':
                                            data = await preparedata(du + 'Aes/options', dsf + sreload[1], reload);
                                    }
                                    data.filename = req.body.f;
                                    data.type = req.body.t;
                                    content_ = req.body.g;
                                    content = content_.split(`\n`);  // undefined check later?
                                    content.pop();  // temp, also temp in preparedata
                                    content = JSON.stringify(content);
                                    data.content = content;
                                    data.pos = req.body.p;
                                    data.splice = '[""]';
                                    pack = ejs.render(await m(sreload[0], data), data);
                                    res.send(pack);
                                    // return content
                                    break
                                case 'view':
                                    //if !(typeof await fview(dd, cmd[1], 'document') === 'undefined') { found = true; }
                                    //if !(typeof await fview(df, cmd[1], 'file') === 'undefined') { found = true; }
                                    //if !(typeof await fview(dsp, cmd[1], 'splice') === 'undefined') { found = true; }
                                    //if !(typeof await fview(dx, cmd[1], 'xi') === 'undefined') { found = true; }
                                    //if !(typeof await fview(dsf, cmd[1], 'server') === 'undefined') { found = true; }
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
                                            pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'xi',
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
                                case 'viewsf':
                                    sfnames = await readdir(dsf, 'utf8');
                                    for (let e = sfnames.length - 1; e >= 0; e--) {
                                        if (cmd[1] == sfnames[d]) {
                                            pack = await preparepack('view', 'view ' + cmd[1], cmd[1], 'server',
                                            { content: dsf + cmd[1], options: du + 'Aes/options' });
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
                                    if (cmd.length > 2) {
                                        switch (cmd[2]) {
                                            case 'document':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'document',
                                                { content: dd + cmd[1], options: du + 'Aes/options' });
                                                break
                                            case 'file':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'file',
                                                { content: df + cmd[1], options: du + 'Aes/options' });
                                                break
                                            case 'xi':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'xi',
                                                { content: dx + cmd[1], options: du + 'Aes/options' });
                                                break
                                            case 'splice':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'splice',
                                                { content: dsp + cmd[1], options: du + 'Aes/options' });
                                                break
                                            case 'user':
                                                if (cmd[1] == 'options') {
                                                    pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'user',
                                                    { content: du + 'Aes/' + cmd[1], options: du + 'Aes/options' });
                                                }
                                                if (cmd[1] == 'commands.txt') {
                                                    pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'user',
                                                    { content: du + 'Aes/' + cmd[1], options: du + 'Aes/options' });
                                                }
                                                break
                                            case 'server':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'server',
                                                { content: dsf + cmd[1], options: du + 'Aes/options' });
                                            default:
                                                res.end();
                                        }
                                        res.send(pack);
                                    } else {
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
                                                    pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'xi',
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
                                                    pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'splice',
                                                    { content: dsp + cmd[1], options: du + 'Aes/options' });
                                                    res.send(pack);
                                                    found = true;
                                                }
                                            }
                                        }
                                        if (!found) {
                                            sfnames = await readdir(dsf, 'utf8');
                                            for (let e = sfnames.length - 1; e >= 0; e--) {
                                                if (cmd[1] == sfnames[e]) {
                                                    pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'server',
                                                    { content: dsf + cmd[1], options: du + 'Aes/options' });
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
                                            pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'xi',
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
                                            pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'splice',
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
                                case 'editsplice':
                                    sfnames = await readdir(dsf, 'utf8');
                                    for (let e = sfnames.length - 1; e >= 0; e--) {
                                        if (cmd[1] == sfnames[e]) {
                                            pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'splice',
                                            { content: dsf + cmd[1], options: du + 'Aes/options' });
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
                                /*
                                case 'editnew':
                                    if (cmd.length > 2) { // editnew name doc?
                                        switch (cmd[2]) {
                                            case 'document':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'document',
                                                { content: dd + 'placeholder', options: du + 'Aes/options' });
                                                break
                                            case 'file':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'file',
                                                { content: dd + 'placeholder', options: du + 'Aes/options' });
                                                break
                                            case 'xi':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'xi',
                                                { content: dd + 'placeholder', options: du + 'Aes/options' });
                                                break
                                            case 'splice':
                                                pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'splice',
                                                { content: dd + 'placeholder', options: du + 'Aes/options' });
                                                break
                                            default:
                                                res.end();
                                        }
                                        res.send(pack);
                                    } else {  // instead of the rest of this we do default type not found does not apply
                                        pack = await preparepack('edit', 'edit ' + cmd[1], cmd[1], 'document',  //{default type here}
                                        { content: dd + 'placeholder', options: du + 'Aes/options' });
                                        res.send(pack);
                                        ^ might already have info of option default type i need
                                        or might have to read it from file
                                        have to look to see if I got and used a option somewhere else
                                    break
                                case 'editnewdocument':
                                case 'editnewfile':
                                case 'editnewnote':
                                case 'editnewsplice':
                                case 'editnewsf':
                                case 'editnewdocument':
                                */
                                case 'get':
                                    filenames = await readdir(df, 'utf8');
                                    for (let a = filenames.length - 1; a >= 0; a--) {
                                        if (cmd[1] == filenames[a]) {
                                            res.sendFile(df + cmd[1]);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        documentnames = await readdir(dd, 'utf8');
                                        for (b = documentnames.length - 1; b >= 0; b--) {
                                            if (cmd[1] == documentnames[b]) { // str
                                                res.sendFile(dd + cmd[1]);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) {
                                        notenames = await readdir(dx, 'utf8');
                                        for (c = notenames.length - 1; c >= 0; c--) {
                                            if (cmd[1] == notenames[c]) {
                                                res.sendFile(dx + cmd[1]);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) {
                                        splicenames = await readdir(dsp, 'utf8');
                                        for (d = splicenames.length - 1; d >= 0; d--) {
                                            if (cmd[1] == splicenames[d]) {
                                                res.sendFile(dsp + cmd[1]);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) {
                                        sfnames = await readdir(dsf, 'utf8');
                                        for (e = sfnames.length - 1; e >= 0; e--) {
                                            if (cmd[1] == sfnames[e]) {
                                                res.sendFile(dsf + cmd[1]);
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
                                            case 'server':
                                                data = await preparedata(du + 'Aes/options', dsf + sreload[1], reload);
                                                writeFile(dsf + req.body.f, req.body.g);
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
                                    if (req.body.t == 'file') {
                                        if (up) {
                                            const upparams = {
                                                Bucket: bn,
                                                Key: req.body.f,
                                                Body: req.body.g,
                                            }
                                            s3.upload(upparams, (err, data) => {
                                                if (err) {
                                                    console.log('Error', err);
                                                } if (data) {
                                                    //console.log('Upload done', data.Location);
                                                }
                                            });
                                        } else {
                                            //console.log('S3 upload disabled.');
                                        }
                                    }
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
                                                    case 'server':
                                                        pack = await preparepack(cmds[u][0], cmds[u][0] + ' ' + sreload[1], sreload[1], 'server',
                                                        { content: dsf + sreload[1], options: du + 'Aes/options', splice: dsp + cmd[1] }, pos, cmd[1]);
                                                }
                                            }
                                        }
                                    }
                                    res.send(pack);
                                    break
                                case 'note':
                                    let nns = await readdir(dx, 'utf8');  // nns = notenames
                                    for (let a = nns.length - 1; a >= 0; a--) {
                                        if (cmd[1] == nns[a]) {
                                            let note = await readFile(dx + cmd[1], 'utf8');
                                            note = note.split(`\n`);
                                            note.pop();
                                            let newnote = [];
                                            switch (cmd.length) {
                                                case 4:
                                                    for (let b = 0; b < note.length; b++) {
                                                        if (note[b].length > 0 && note[b][0] == 'Ξ') {
                                                            if (note[b].slice(1, note[b].length) == cmd[2] + ' ' + cmd[3]) {
                                                                for (let c = b + 1; c < note.length; c++) {
                                                                    if (note[c].length > 0 && note[c][0] != 'Ξ') {
                                                                        newnote.push(note[c]);
                                                                    }
                                                                    if (note[c].length > 0 && note[c][0] == 'Ξ') {
                                                                        break
                                                                    }
                                                                    if (note[c].length == 0) {
                                                                        newnote.push('');
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (newnote.length == 0) { newnote = ['could not find section'] }
                                                    newnote = JSON.stringify(newnote);
                                                    res.send(newnote);
                                                    break
                                                case 3:
                                                    for (let b = 0; b < note.length; b++) {
                                                        if (note[b].length > 0 && note[b][0] == 'Ξ') {
                                                            if (note[b].slice(1, note[b].length) == cmd[2]) {
                                                                for (let c = b + 1; c < note.length; c++) {
                                                                    if (note[c].length > 0 && note[c][0] != 'Ξ') {
                                                                        newnote.push(note[c]);
                                                                    }
                                                                    if (note[c].length > 0 && note[c][0] == 'Ξ') {
                                                                        break
                                                                    }
                                                                    if (note[c].length == 0) {
                                                                        newnote.push('');
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (newnote.length == 0) { newnote = ['could not find section'] }
                                                    newnote = JSON.stringify(newnote);
                                                    res.send(newnote);
                                                    break
                                                default:
                                                    note = JSON.stringify(note);
                                                    res.send(note);
                                            }
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        res.send(JSON.stringify(['could not find note']));
                                    }
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
