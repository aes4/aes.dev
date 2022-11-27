var exec = require('child_process').exec;

module.exports = function(server) {
    server.post('/sf', function (req, res) {
        res.sendStatus(200);
        exec('. ~/aes.dev/2sf', callback);
    });
}

function callback(err, stdout, stderr) {
    if (stdout) {
        console.log(stdout);
    }
    if (stderr) {
        console.log(stderr);
    }
}
