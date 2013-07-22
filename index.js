var exec = require('child_process');
var execSync = require('exec-sync');

function _command(cmd, cb) {
  exec(cmd, function (err, stdout, stderr) {
    cb(stdout.split('\n').join(''));
  });
}
function _commandSync(cmd) {
  return execSync(cmd).split('\n').join('');
}

var commands = {
  short: 'git rev-parse --short HEAD',
  long: 'git rev-parse HEAD',
  branch: 'git rev-parse --abbrev-ref HEAD',
  tag: 'git describe --always --tag --abbrev=0'
};
var logCommand = 'git log --no-color --pretty=format:\'[ "%H", "%s", "%cr", "%an" ],\' --abbrev-commit';
var logParser = function (str) {
  return JSON.parse('[' + str.substr(0, str.length - 1) + ']');
};

var exports = {
  log: function (cb) {
    _command(logCommand, function (str) {
      cb(logParser(str));
    });
  },
  logSync: function () {
    return logParser(_commandSync(logCommand));
  }
};

commands.forEach(function (cmd, name) {
  exports[name] = function (cb) {
    _command(cmd, cb);
  };
  exports[name + "Sync"] = function () {
    return _commandSync(cmd);
  };
});

module.exports = exports;