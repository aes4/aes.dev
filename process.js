const {readFile, writeFile} = require('fs').promises;

const du = '/home/ubuntu/aes/users/';

function cb(input) {  // check bool
    switch (input.toLowerCase()) {
        case "true":
        case "yes":
        case "y":
        case "on":
        case "1":
            return true;
        case "false":
        case "no":
        case "n":
        case "off":
        case "0":
            return false;
        default:  // idk what to do if not the cases above
            return false;
    }
}

function type(any, input) {  // check type and set input to that type
    switch(typeof any) {
        case 'string':
            input = input.toString();
            break
        case 'number':
            input = Number(input);
            break
        case 'boolean':
            input = cb(input);
            break
    }
    return input;
}

module.exports = async function p(data) {
    carr = data.cmd;
    switch (carr[0]) {
        case 'option':
            if (carr.length > 2) {
                let options = JSON.parse(data.options);
                for (const option in options) {
                    if (carr[1] == option) {
                        carr[2] = type(options[option], carr[2]);
                        options[option] = carr[2];
                    }
                }
                options = JSON.stringify(options, null, 4);
                await writeFile(du + 'Aes/options', options);
            }
    }
}
