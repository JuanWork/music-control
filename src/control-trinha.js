const { exec } = require('child_process');
class ControlTrinha {
  static playPause() { return this._exec('rhythmbox-client --play-pause'); }
  static next() { return this._exec('rhythmbox-client --next'); }
  static previous() { return this._exec('rhythmbox-client --previous'); }
  static volumeUp() { return this._exec('rhythmbox-client --volume-up'); }
  static volumeDown() { return this._exec('rhythmbox-client --volume-down'); }
  static current() { return this._exec('rhythmbox-client --print-playing'); }
  static _exec(cmd) {
    return new Promise((res, rej) => {
      exec(cmd, (err, out) => err ? rej(err) : res(out ? out.trim() : null));
    });
  }
}
module.exports = ControlTrinha;

