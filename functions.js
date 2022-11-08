//var ejs;
const {readFile, writeFile} = require('fs').promises;

ejs = require("ejs");
m = require("./make.js");

module.exports = {
    preparepack: async function preparepack(makearr, reload, filename, type, paths, splice = '[""]') {
        let optionsdata = await readFile(paths.options);
        let options = JSON.parse(optionsdata);
        let content = await readFile(paths.content, 'utf8');
        content = content.split(`\n`);
        content.pop();
        content = JSON.stringify(content);
        if (splice != '[""]') {
            splice = await readFile(paths.splice, 'utf8');
            splice = splice.split(`\n`);
            splice.pop();
            splice = JSON.stringify(splice);
        }  // maybe check if paths >= 3 read paths.splice else splice = '[""]' del splice arg
        let data = options;
        data.content = content;
        data.reload = reload;
        data.splice = splice;
        data.filename = filename;
        data.type = type;
        pack = ejs.render(await m(makearr, options), data);
        return pack;
    },
    preparedata: async function preparedata(optionspath, contentpath, reload) {
        let optionsdata = await readFile(optionspath);
        let options = JSON.parse(optionsdata);
        let content = module.exports.rs(contentpath);
        content = JSON.stringify(content);
        let data = options;
        data.content = content;
        data.reload = reload;
        return data;
    },
    specarr: function specarr(str) { // why doesn't this split \\n
        // wont check in str includes \n because every file has a \n i think
        arr = str.split(`\n`);
        if (arr[arr.length - 1] == "") {
            arr.pop();
        }
        // eventually do something in case there is a grave in the str
        return arr;
    },
    rs: async function rs(filename) {  // read and split
        let temp = await readFile(filename, 'utf8');
        temp = temp.split("\n");
        temp.pop()
        return temp;
    },
    s: function s(str_, d) {
        str = str_.split(d);
        return str;
    },
    j: function j(arr, d) {
        str = arr.join(d);
        return str;
    }
}
