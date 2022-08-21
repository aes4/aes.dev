var exec = require('child_process').exec;

module.exports = function(server) {
    server.post('/git', function (req, res) {
        exec('git pull', callback);
        exec('. .restart.sh', callback);
        process.exit();
    });
}

function callback(err, stdout, stderr) { return true }
