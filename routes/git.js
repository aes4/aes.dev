var exec = require('child_process').exec;

module.exports = function(server) {
    server.post('/git', function (req, res) {
        res.sendStatus(200);
        exec('git -C ~/aes.dev pull', callback);
        process.exit();
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
