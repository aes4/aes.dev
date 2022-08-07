const {readFile, writeFile} = require('fs').promises;
const {rs} = require('./functions.js');

function clean(base) {
    for (let i = 0; i < base.length; i++) {
        if (base[i][0] == ';') {
            base.splice(i, 1);
        }
    }
    base_ = base;
    base = base_.join("\n");
    return base;
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
                                if (fn == fun[k]) {
                                    bol = false;
                                }
                            }
                            if (bol) {
                                fun.push(fn);
                                for (let l = ii + 1; l < data.length; l++) {
                                    if (data[l].length > 0) {
                                        if (data[l][0] == ';') {
                                            break
                                        }
                                    }
                                    line++;
                                    base.splice(i + line, 0, data[l]);
                                }
                                line = 0;
                            } else {
                                bol = true;
                            }
                            break
                        default:
                            for (let l = ii + 1; l < data.length; l++) {
                                if (data[l].length > 0) {
                                    if (data[l].length == ';') {
                                        break
                                    }
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

module.exports = async function m(cstr) {
    let base = await rs('snippets/base');
    let mods;  // modifications
    let id = 0;  // id number
    // let cstr = cstr_.split(" ");
    switch (cstr) {  // if multiple docs this might have to be if edit if view if etc insert etc
        case 'edit':
            let edit = await rs('snippets/edit');
            let editcl = await rs('snippets/editcl');
            mods = genid(edit, id);
            edit = mods[0];
            id = mods[1];
            mods = genid(editcl, id);
            editcl = mods[0];
            id = mods[1];
            data_ = [].concat(edit, editcl);
            base = insert(base, data_);
            data = clean(base);
            return data;
            break
        case 'view':
            let view = await rs('snippets/view');
            let cl = await rs('snippets/cl');  // move?
            mods = genid(view, id);
            view = mods[0];
            id = mods[1];
            mods = genid(cl, id);
            cl = mods[0];
            id = mods[1];
            data_ = [].concat(view, cl);
            base = insert(base, data_);
            data = clean(base);
            return data;
            break
    }
}
