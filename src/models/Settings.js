import storage from '../db/Storage';
import soundMaker from './SoundMaker';

class Settings {
  constructor(store) {
    this.store = store;
    this._volume = 0.4;
    this.timer = {
      hasTime: false,
      time: 5,
    };
  }

  set volume(value) {
    soundMaker.volume = value;
    this._volume = value;
  }

  get volume() {
    return this._volume;
  }

  set hasTime(value) {
    this.timer.hasTime = value;
  }

  get hasTime() {
    return this.timer.hasTime;
  }

  set time(value) {
    this.timer.time = value;
  }

  get time() {
    return this.timer.time;
  }

  save() {
    const obj = {
      volume: this._volume,
      timer: this.timer,
    };
    this.store.setItem('settings', obj);
  }

  setDefault() {
    this.volume = 0.4;
    this.timer = {
      hasTime: false,
      time: 5,
    };
    this.update();
  }

  update() {
    const VOLUME_INPUT = document.getElementById('volume');
    const TIME_SECONDES_AMOUNT = document.getElementById('timeAmountSecondes');
    const TIMER_CONTROLLER = document.getElementById('timerBox');
    VOLUME_INPUT.value = this.volume * 100;
    VOLUME_INPUT.dispatchEvent(new Event('input'));
    TIME_SECONDES_AMOUNT.value = this.timer.time;
    TIMER_CONTROLLER.checked = this.hasTime;
    document.getElementById('temerAmountValue').textContent = this.timer.time;
    if (this.hasTime) TIME_SECONDES_AMOUNT.disabled = false;
    else TIME_SECONDES_AMOUNT.disabled = true;
  }

  loadSettings() {
    const settings = this.store.getItem('settings');
    if (!settings || settings.length === 0) {
      this.setDefault();
      return;
    }
    this.volume = settings.volume;
    this.timer = settings.timer;
    this.update();
  }
}

export default new Settings(storage);
