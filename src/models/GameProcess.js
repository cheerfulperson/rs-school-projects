import cummonMixin from './CummonMixin';
import {
  getRandomInfo,
} from '../modules/gameLoader';
import soundMaker from './SoundMaker';
import router from '../router/router';
import keyframes from '../json/keyframes.json';
import settings from './Settings';
import storage from '../db/Storage';
import socket from '../modules/networking';

const {
  getImageUrl,
  countTrueAnswers,
} = cummonMixin;

const HEADER_TIMER = document.getElementById('gameTimer');
const CLOCK_ARROW = document.querySelector('#gameTimer > div > div.clock-arrow');

class GameProcess {
  constructor(game, gameRoom, type, isOnline, socketData) {
    this._game = game;
    this._gameRoom = gameRoom;
    this._gameType = type;
    this.isOnline = isOnline;
    this.socketData = socketData;
    this.timer = 0;
    this.results = [];
    this.current = 0;
    this.key = this._gameType == 'artists' ? 'author' : 'imageNum';
    this.timeout;
  }

  get game() {
    return this._game;
  }

  set game(value) {
    this._game = value;
  }

  get gameRoom() {
    return this._gameRoom;
  }

  set gameRoom(value) {
    this._gameRoom = value;
  }

  get gameType() {
    return this._gameType;
  }

  set gameType(value) {
    this._gameType = value;
  }

  setClock(val, secondes, BUTTONS, IMAGE, TITLE) {
    const TIME = document.querySelector('#gameTimer time');
    TIME.textContent = `${secondes}`;
    if (secondes === 0) {
      const key = this.gameType == 'artists' ? 'author' : 'imageNum';
      soundMaker.playGameSound(this.checkAnswer('', key));
      this.insertAnswer('', this.checkAnswer('', key));
      this.showModalWindow('', key, BUTTONS, IMAGE, TITLE);
      return;
    } if (val != this.current) {
      this.pauseTimer();
      return;
    }
    this.timeout = setTimeout(() => {
      secondes--;
      this.setClock(val, secondes, BUTTONS, IMAGE, TITLE);
    }, 1000);
  }

  pauseTimer() {
    clearTimeout(this.timeout);
    document.querySelector('#gameTimer time').textContent = `${this.timer}`;
  }

  setTimerGame(BUTTONS, IMAGE, TITLE) {
    if (settings.hasTime || this.isOnline) {
      this.timer = this.isOnline ? 15 : settings.time;
      // document.querySelector('#gameTimer img').src = './assets/svg/clock.svg';
      HEADER_TIMER.classList.remove('display-none');
      CLOCK_ARROW.animate([{
        transform: 'rotate(0)',
      },
      {
        transform: 'rotate(360deg)',
      },
      ], {
        duration: this.timer * 1000,
        iterations: 1,
      });
      this.setClock(this.current, this.timer, BUTTONS, IMAGE, TITLE);
    } else {
      HEADER_TIMER.classList.add('display-none');
    }
  }

  setTitle(title) {
    title.innerHTML = `Which of these paintings was written by <b>${this._game.data[this.current].author}</b>?`;
  }

  insertImage(IMAGE, cb = () => {}) {
    const img = new Image();
    img.src = getImageUrl(this._game.data[this.current].imageNum);
    img.onload = () => {
      IMAGE.style.opacity = '0.2';
      setTimeout(() => {
        IMAGE.src = img.src;
        IMAGE.style.opacity = '1';
        cb();
      }, 300);
    };
  }

  setAnswersPictures(buttons, cb = () => {}) {
    const obj = this._game.data[this.current];
    getRandomInfo(obj.imageNum, 3, 'pictures').then((data) => {
      let index = 0;
      data = this.mixAnswers(data, obj.imageNum);
      buttons.forEach((button, i) => {
        button.animate(keyframes[i], {
          duration: 1000,
          iterations: 1,
        });

        button = buttons[i];
        button.value = data[i];
        let IMAGE = button.querySelector('img');
        if (!IMAGE) {
          button.innerHTML = '<img src="" alt="">';
          IMAGE = button.querySelector('img');
        }
        const img = new Image();
        img.src = getImageUrl(data[i]);
        IMAGE.style.opacity = '0.2';
        img.onload = () => {
          index++;
          IMAGE.src = img.src;
          IMAGE.style.opacity = '1';
          if (index == buttons.length - 1) {
            cb();
          }
        };
      });
    });
  }

  mixAnswers(arr, value) {
    const data = arr;
    const num = Math.round(Math.random() * 3);
    if (num > data.length - 1) {
      data.push(value);
    } else {
      for (let i = 0; i < data.length; i++) {
        if (num == i) {
          data.push(data[i]);
          data[i] = value;
        }
      }
    }
    return data;
  }

  setAnswersButtons(buttons) {
    const obj = this._game.data[this.current];
    getRandomInfo(obj.author, 3, 'artists').then((data) => {
      data = this.mixAnswers(data, obj.author);
      buttons.forEach((button, i) => {
        button.value = data[i];
        button.textContent = data[i];
        button.animate([{
          transform: 'scale(0)',
        },
        {
          transform: 'scale(1)',
        },
        ], {
          duration: (Math.round(Math.random() * 3) + 2) * 150,
          iterations: 1,
        });
      });
    });
  }

  checkAnswer(answer, key) {
    if (!this._game) return;
    const isTrue = this._game.data[this.current][key] == answer;
    return isTrue;
  }

  insertAnswer(answer, isTrue) {
    if (!this._game) return;
    const obj = {
      isTrue,
    };
    obj[this.key] = answer;
    if (this.current < this._game.data.length) { this.results.push(obj); }
  }

  getNextQuestion(answer, key) {
    const isTrue = this.checkAnswer(answer, key);
    this._gameRoom.querySelector('div.bullets').children[this.current].className = isTrue ? 'active' : 'wrang';
    if (this.current == this._game.data.length - 1) {
      delete this;
      return;
    }
    this.current++;
  }

  nextGame(info, key, buttons, img, title, MODAL_WINDOW) {
    if (this.current < this._game.data.length - 1) {
      this.getNextQuestion(info, key);

      if (key == 'author') {
        this.setAnswersButtons(buttons);
        this.insertImage(img, () => {
          this.setTimerGame(buttons, img, title);
        });
      } else {
        this.setAnswersPictures(buttons, () => {
          this.setTimerGame(buttons, img, title);
        });
        this.setTitle(title);
      }
      MODAL_WINDOW.classList.add('display-none');
    } else {
      this.getNextQuestion(info, key);
      this.pauseTimer();
      this.finishGameProcess();
    }
  }

  showModalWindow(info, key, buttons, img, title) {
    if (!this._game) return;
    const MODAL_WINDOW = document.querySelector('#gameRoom .modal-window');
    const isTrue = this.checkAnswer(info, key);
    const levelObject = this._game.data[this.current];

    if (this.isOnline) {
      socket.send(JSON.stringify({
        event: 'fill',
        roomId: this.socketData.id,
        userId: this.socketData.clientId,
        results: this.results,
      }));
      this.nextGame(info, key, buttons, img, title, MODAL_WINDOW);
      return;
    }
    const MARK_MEDAI = MODAL_WINDOW.querySelector('.mark-media');
    const CURRENT_SETCION_IMG = document.querySelector('#currentSectionImage');
    const PICT_NAME = document.querySelector('#pictName span');
    const AUTHOR = document.querySelector('#pictAuthor span');
    const YEAR = document.querySelector('#pictYear span');
    const MODAL_BUTTONS = document.querySelector('#gameRoom .buttons-modal');

    CURRENT_SETCION_IMG.src = getImageUrl(levelObject.imageNum);

    MARK_MEDAI.style.border = `4px solid ${isTrue ? '#006635' : '#660033'}`;
    MARK_MEDAI.querySelector('img').src = isTrue ? './assets/svg/good.svg' : './assets/svg/bad.svg';

    MODAL_BUTTONS.innerHTML = '';

    const button = document.createElement('button');
    button.textContent = 'next';
    MODAL_BUTTONS.insertAdjacentElement('afterbegin', button);
    button.addEventListener('click', () => {
      soundMaker.playClickSound();
      this.nextGame(info, key, buttons, img, title, MODAL_WINDOW);
    });

    PICT_NAME.textContent = levelObject.name;
    AUTHOR.textContent = levelObject.author;
    YEAR.textContent = levelObject.year;

    MODAL_WINDOW.classList.remove('display-none');
  }

  finishGameProcess(extraEnd, leaveUserData) {
    const MODAL_WINDOW = document.querySelector('#gameRoom .modal-window');
    const section = document.querySelector('#gameRoom .modal-window .section');
    const MODAL_BUTTONS = document.querySelector('#gameRoom .buttons-modal');
    const PLAYERS_BLOCK = document.getElementById('players');

    const buttonToHome = document.createElement('button');
    const buttonToNextQuize = document.createElement('button');
    const showResultsBtn = document.createElement('button');
    let sectionComponents;

    this.pauseTimer();
    function setWindowContent(freeButton) {
      section.innerHTML = '';
      section.insertAdjacentElement('beforeend', MODAL_BUTTONS);
      MODAL_BUTTONS.innerHTML = '';
      if (freeButton) {
        MODAL_BUTTONS.insertAdjacentElement('afterbegin', freeButton);
      }
      MODAL_BUTTONS.insertAdjacentElement('afterbegin', buttonToHome);
      section.insertAdjacentHTML('afterbegin', sectionComponents);
      MODAL_WINDOW.classList.remove('display-none');
    }

    buttonToHome.innerHTML = '<img src="./assets/svg/home-i.svg" alt=""><span>Home</span>';
    buttonToHome.addEventListener('click', (e) => {
      soundMaker.playClickSound();
      router.homePage.loadHTMLcontent();
      MODAL_WINDOW.remove();
      PLAYERS_BLOCK.classList.add('display-none');
      this.destroy();
    });

    if (this.isOnline) {
      function getUserWindow(data, isEventLeave) {
        const usersData = data.data.data; const
          { clientID } = data;

        const playersResults = {};
        let maxResult = 0;
        const addStr = isEventLeave ? 'because your opponent came out.' : 'cool';
        const thisPlayer = usersData[clientID];
        let secondPlayer;
        Object.keys(usersData).forEach((key) => {
          if (key != clientID) secondPlayer = usersData[key];
          playersResults[key] = countTrueAnswers(usersData[key]);
          if (playersResults[key] > maxResult) maxResult = playersResults[key];
        });

        const isYouWin = playersResults[clientID] == maxResult;
        const img = `./assets/svg/${isYouWin ? 'win' : 'lose'}.svg`;
        sectionComponents = `
                                        <h2 class="${isYouWin ? 'win' : 'lose'}">
                                            ${isYouWin ? `You won, ${addStr}` : 'You lose'}!
                                        </h2>
                                        <img class="congr-img" src="${img}" alt="">`;
        PLAYERS_BLOCK.classList.add('display-none');

        if (!isEventLeave) {
          showResultsBtn.textContent = 'Show Results';

          showResultsBtn.onclick = () => {
            PLAYERS_BLOCK.classList.add('display-none');
            const RESULT_TABLE = document.querySelector('#resultsRoom table tbody');
            soundMaker.playClickSound();
            RESULT_TABLE.innerHTML = '';
            for (let i = 0; i < this.game.data.length; i++) {
              const image = this.game.data[i];
              const tr = `<tr>
                            <td><img src="${getImageUrl(image.imageNum)}" alt=""></td>
                            <td>${image.name}</td>
                            <td>${image.author}</td>
                            <td>${image.year}</td>
                            <td><img src="./assets/svg/${thisPlayer[i].isTrue ? 'good' : 'bad'}.svg" alt=""></td>
                            <td><img src="./assets/svg/${secondPlayer[i].isTrue ? 'good' : 'bad'}.svg" alt=""></td></tr>`;
              RESULT_TABLE.innerHTML += tr;
            }
            router.resultsPage.loadHTMLcontent();
            MODAL_WINDOW.remove();
            this.destroy();
          };
          setWindowContent(showResultsBtn);
        } else {
          sectionComponents = `
                                        <h2 class="win">
                                            ${`You won, ${addStr}`}!
                                        </h2>
                                        <img class="congr-img" src="./assets/svg/win.svg" alt="">`;
          setWindowContent();
        }
      }
      socket.send(JSON.stringify({
        event: 'end',
        roomId: this.socketData.id,
        userId: this.socketData.clientId,
        results: this.results,
        isReady: true,
      }));
      socket.addEventListener('message', (msg) => {
        const data = JSON.parse(msg.data);
        if (data.event == 'unready') {
          sectionComponents = '<h2>Please wait for your opponent to finish!</h2>';
          this.pauseTimer();
          setWindowContent();
        } else if (data.event == 'end') {
          getUserWindow.call(this, data);
        }
      });
      if (extraEnd) {
        getUserWindow.call(this, leaveUserData, true);
      }
    } else {
      if (!this.results) return;
      soundMaker.playFinishSound();
      this.saveGameProcess();
      buttonToNextQuize.textContent = 'Next Quiz';
      buttonToNextQuize.addEventListener('click', (e) => {
        soundMaker.playClickSound();
        if (this._gameType == 'artists') {
          router.artistsQuizPage.loadHTMLcontent();
        } else {
          router.picturesQuizPage.loadHTMLcontent();
        }
        this.destroy();
        MODAL_WINDOW.remove();
      });

      sectionComponents = `
                <h2>CONGRATULATIONS !</h2>
                <p>${countTrueAnswers(this.results)} / ${this.results.length}</p>
                <img class="congr-img" src="./assets/svg/congratulation.svg" alt="">
              `;
      setWindowContent(buttonToNextQuize);
    }
  }

  destroy() {
    Object.keys(this).forEach((key) => {
      delete this[key];
    });
    delete this;
  }

  async saveGameProcess() {
    if (!this.game) return;
    let amount = 0;
    for (let i = 0; i < this.game.data.length; i++) {
      const obj = this.game.data[i];
      obj.answer = this.results[i];
      if (this.results[i].isTrue) amount++;
    }
    this.game.trueAnswersAmount = amount;
    const games = Array.isArray(storage.getItem('games')) ? storage.getItem('games') : [];
    let index;
    for (let i = 0; i < games.length; i++) {
      const obj = games[i];
      if (obj.name == this.game.name && obj.type == this.gameType) index = i;
    }
    if (index === 0 || index) games[index] = this.game;
    else games.push(this.game);

    storage.setItem('games', games);
  }
}

export default GameProcess;
