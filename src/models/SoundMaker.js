import settings from './Settings';

class SoundMaker extends Audio {
  constructor() {
    super();
    this.gameSounds = new Audio();
  }

  playClickSound() {
    const audio = new Audio();
    audio.src = './assets/sounds/04715.mp3';
    audio.volume = this.volume;
    audio.play();
  }

  playGameSound(isTrue) {
    this.gameSounds.src = `./assets/sounds/${isTrue ? 'good' : 'mistake'}.mp3`;
    this.gameSounds.volume = this.volume;

    const playPromise = this.gameSounds.play();
    if (playPromise !== undefined) {
      playPromise.then((_) => {
      })
        .catch((error) => {
        });
    }
  }

  playFinishSound() {
    this.gameSounds.src = './assets/sounds/pobeds.mp3';
    this.gameSounds.volume = this.volume;

    const playPromise = this.gameSounds.play();
    if (playPromise !== undefined) {
      playPromise.then((_) => {
      })
        .catch((error) => {
        });
    }
  }

  setDefault() {
    this.volume = settings.volume;
  }
}

export default new SoundMaker();
