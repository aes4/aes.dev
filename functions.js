var ejs;
const {readFile, writeFile } = require('fs').promises;

ejs = require("ejs");
m = require("./make.js");

module.exports = {
    preparepack: async function preparepack(makearr, optionspath, contentpath, reload) {
        let optionsdata = await readFile(optionspath);
        let options = JSON.parse(optionsdata);
        let content_ = await readFile(contentpath, 'utf8');
        content = content_.split(`\n`);
        content.pop();
        content = JSON.stringify(content);
        let data = options;
        data.content = content;
        data.reload = reload;
        pack = ejs.render(await m(makearr, options), data);
        return pack;
    },
    preparedata: async function preparedata(optionspath, contentpath, reload) {  // might need a better function than this
        let optionsdata = await readFile(optionspath);
        let options = JSON.parse(optionsdata);
        let content_ = await readFile(contentpath, 'utf8');
        content = content_.split(`\n`);
        content.pop();
        content = JSON.stringify(content);
        let data = options;
        data.content = content;
        data.reload = reload;
        return data;
    },
    specarr: function specarr(str) { // why doesn't this split \\n
        // wont check in str includes \n because every file has a \n i think
        arr = str.split(`\n`);
        arr.pop();
        // eventually do something in case there is a grave in the str
        return arr;
    },
    rs: async function rs(filename) {  // read and split
        let temp_ = await readFile(filename, 'utf8');
        let temp = temp_.split("\n");
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
