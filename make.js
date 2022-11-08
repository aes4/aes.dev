const {readFile, writeFile, readdir} = require('fs').promises;
// const {rs} = require('./functions.js');
// can't import fix later
async function rs(filename) {  // read and split
    let temp = await readFile(filename, 'utf8');
    temp = temp.split("\n");
    temp.pop()
    return temp;
}

function clean(base) {
    for (let i = 0; i < base.length; i++) {
        if (base[i][0] == ';') {
            base.splice(i, 1);
        }
    }
    return base.join("\n");
}

function genid(data, id) {
    let mline = '';  // modified line
    id++
    for (let i = 0; i < data.length; i++) {
        if (data[i] == ';mainfunctions') {
            mline = '    function f' + id.toString() + '() {';
            data[i + 1] = mline;
        }
        if (data[i] == ';frame') {
            mline = '        f' + id.toString() + '()';
            data[i + 1] = mline;
        }
    }
    return [data, id];
}

function insert(base, data) {
    let line = 0;  // amount of added lines
    let fun = [];  // list of all individual functions no duplicates fns?
    let fn = '';  // function name
    let bol = true;
    for (let i = 0; i < base.length; i++) {
        if (base[i][0] == ';') {
            for (let ii = 0; ii < data.length; ii++) {
                if (data[ii] == base[i]) {
                    switch (data[ii]) {
                        case ';function':
                            fn = data[ii + 1];
                            fn.slice(13);
                            fn.slice(0, -4);
                            for (let k = 0; k < fun.length; k++) {
                                if (fn == fun[k]) { bol = false; }
                            }
                            if (bol) {
                                fun.push(fn);
                                for (let l = ii + 1; l < data.length; l++) {
                                    if (data[l].length > 0) {
                                        if (data[l][0] == ';') { break }
                                    }
                                    line++;
                                    base.splice(i + line, 0, data[l]);
                                }
                                line = 0;
                            } else { bol = true; }
                            break
                        default:
                            for (let l = ii + 1; l < data.length; l++) {
                                if (data[l].length > 0) {
                                    if (data[l][0] == ';') { break }
                                }
                                line++;
                                base.splice(i + line, 0, data[l]);
                            }
                            line = 0;
                    }
                }
            }
        }
    }
    return base;
}

function replacefunctions(base, data) {
    let temp;
    let dataarr = [];
    let tempcount = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] == ';') {
            temp = data[i].split(' ');
            if (temp.length > 1) {
                dataarr.push([]);
                for (let ii = i; data[ii] != '    }'; ii++) {
                    dataarr[tempcount].push(data[ii + 1]);
                }
                tempcount++;
            }
        }
    }
    let insertat = [];
    for (let i = 0; i < dataarr.length; i++) {
        for (let ii = base.length - 1; ii >= 0; ii--) {
            if (dataarr[i][0] == base[ii]) {
                insertat.push(ii);
                while (base[ii] != '    }') { base.splice(ii, 1); }
                base.splice(ii, 1);
            }
        }
    }
    for (let i = dataarr.length - 1; i >= 0; i--) {
        for (let ii = dataarr[i].length - 1; ii >= 0; ii--) {
            base.splice(insertat[i], 0, dataarr[i][ii])
        }
    }
    return base;
    // might not work if function in snippet is larger than function in base?
    // incorrect insertat?
    // if case then insert ;randomchar + randomnum before delete then insert after ;random
}

module.exports = async function m(makearr, options) {
    let base = await rs('snippets/base');
    let id = 0;  // id number
    // let cstr = cstr_.split(" ");
    let snippet = await rs('snippets/' + makearr + '/default');
    makearroptions = await readdir('snippets/' + makearr, 'utf8');
    let optionarr = [];
    for (let i in options) {
        if (i.slice(0, 4) == 'make') {
            for (ii in makearroptions) {
                if (i.slice(4) == makearroptions[ii]) {
                    let option = await rs('snippets/' + makearr + '/' + i.slice(4));
                    snippet = replacefunctions(snippet, option);
                    optionarr.push(option);
                }
            }
        }
    }
    let cl = await rs('snippets/' + makearr + '/cl');
    [snippet, id] = genid(snippet, id);
    [cl, id] = genid(cl, id);
    base = insert(base, [].concat(snippet, cl, ...optionarr));
    return clean(base);
}
