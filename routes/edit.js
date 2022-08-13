var ejs;
const {readFile, writeFile} = require('fs').promises;
const {specarr} = require("../functions.js");

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
        let ip = await readFile(da + 'ip.txt', 'utf8');
        if (req.ip == ip) {
            let data = await readFile(du + 'Aes/options', 'utf8');
            let options = JSON.parse(data);
            let content = await readFile(dd + 'home', 'utf8');
            content = JSON.stringify(specarr(content));  // spec -> 'te\\nst\nt' ['te\', 'st', 't']? is it cause i u
            split`\n` instead of split "\n"
            data = data.split(`\n`);
            for (i = 0; i < data.length; i++) {
                data[i] = data[i].split(',');
            }
            pack = ejs.render(await m('view'), { fontsize: options.fontsize,
                fontname: options.fontname,
                textcolor: options.textcolor,
                backgroundcolor: options.backgroundcolor,
                content: content,
                linespacing: options.linespacing
            });
            res.send(pack);
        } else {
            let data = await readFile(da + 'options', 'utf8');
            let options = JSON.parse(data);
            let content = await readFile(dd + 'home', 'utf8');
            content = JSON.stringify(specarr(content));
            data = data.split(`\n`);
            for (i = 0; i < data.length; i++) {
                data[i] = data[i].split(',');
            }
            pack = ejs.render(await m('view'), { fontsize: options.fontsize,
                fontname: options.fontname,
                textcolor: options.textcolor,
                backgroundcolor: options.backgroundcolor,
                content: content,
                linespacing: options.linespacing
            });
            res.send(pack);
        }
    });
}
