const { exec } = require('child_process');
const aspectHumor = require('./aspects/logs');

class MusicControl {
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

// Wrapper que adiciona logs automáticos
const creatLogger = (MusicControl, aspectHumor) => {
  return new Proxy(MusicControl, {
    get(target, prop) {
      const original = target[prop];
      if (typeof original === 'function') {
        return async function(...args) {
          try {
            const result = await original.apply(target, args);
            aspectHumor('sucesso');
            return result;
          } catch (err) {
            aspectHumor('nó');
            throw err;
          }
        };
      }
      return original;
    }
  });
};

module.exports = creatLogger(MusicControl, aspectHumor);
