var exec = require('child_process').exec;

module.exports = function(server) {
    server.post('/git', function (req, res) {
        exec('git pull');
        exec('. .restart.sh');
        process.exit();
    });
}
