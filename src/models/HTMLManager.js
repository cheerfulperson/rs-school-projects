import cummonMixin from './CummonMixin';
import soundMaker from './SoundMaker';
import {
  getGames,
  getImagesScore
} from '../modules/gameLoader';
import router from '../router/router';
import GameProcess from './GameProcess';
import imagesDescriptions from '../modules/imagesEn'
import socket from '../modules/networking';

class LoadHTMLPage {
  constructor(_id, className, content) {
    this.contentID = _id;
    this.mainContentClass = className;
    this.content = content;
    this.currentPage = 0;
  }

  animateBody(start) {
    document.body.animate([{
      opacity: start ? 1 : 0
    }, {
      opacity: start ? 0 : 1
    }], {
      duration: 300,
      iterations: 1
    })
    document.body.style.opacity = start ? 0 : 1;
  }

  getHTMLString = (index, img, designation, score, length) => {
    return `
    <div id="${designation}_${index - 1}" class="container-list-item ${score ? 'active-list-item' : ''}">
      <div class="score">${score ? score : ''} / ${length}</div>
      <h2 class="index">${index}</h2>
      <p class="designation">${designation}</p>
      <img src="${img}" alt="">
    </div>`
  }
  getScoreCell(index, img, isPassed, info) {
    return `
    <div class="container-list-item ${isPassed ? 'active-list-item' : ''}">
      <div class="picture-info" >
          <h3>${info.author}</h3>
          <p>${info.name}</p>
          <p>${info.year}</p>
      </div>
      <h3 class="title"><span class="number">${index}</span> picture</h3>
      <img src="${img}" alt="">
    </div>`
  }
  getModalWindow = () => {
    return `<div class="modal-window display-none">
              <div class="section">
                  <div class="mark-media">
                      <img src="" alt="">
                  </div>
                  <img id="currentSectionImage" src="" alt="">
                  <ul>
                      <li id="pictName"><b>Picture name: </b><span></span></li>
                      <li id="pictAuthor"><b>Author: </b><span></span></li>
                      <li id="pictYear"><b>Year: </b><span></span></li>
                  </ul>
                  <div class="buttons-modal">
                  </div>
              </div>
          </div>`
  }
  addBtnScrollDown(parentEl) {
    let divBlock = parentEl.parentElement.querySelector('.btn-to-down');
    if (parentEl.offsetHeight < parentEl.scrollHeight)
      divBlock.classList.remove('display-none')
    else divBlock.classList.add('display-none')
    divBlock.onclick = () => {
      parentEl.scrollTo(0, parentEl.scrollHeight);
    }
    parentEl.onscroll = e => {
      if (parentEl.scrollHeight < parentEl.scrollTop + parentEl.offsetHeight + 10) {
        divBlock.classList.add('display-none')
      } else {
        divBlock.classList.remove('display-none')
      }
    }
  }
  fillButtonsContent(content, count, isNew) {
    if (isNew) content.innerHTML = '';
    while (count > 0) {
      content.insertAdjacentHTML('afterbegin', `<li><button ></button></li>`)
      count--;
    }
  }

  setGameContent(type, gameContent, isOnline, socketData) {
    const CONTENT = document.getElementById('gameRoom');
    const BULLETS = document.querySelector('#gameRoom div.bullets');
    const GAME_MEDIA = document.getElementById('gameMainMedia');
    const ANSWER_LIST = document.getElementById('answerList');
    const TITLE = document.querySelector('#gameHeader h2');
    const IMAGE = document.querySelector('#gameMainMedia img#gameMainImage');
    const NAVIGATION_BUTTONS = document.querySelectorAll('#navigation button');
    const PLAYERS_HEADER = document.getElementById('players');

    let key = type == 'artists' ? 'author' : 'imageNum';
    let info = '',
      time;

    let gameProcess = new GameProcess(gameContent, CONTENT, type, isOnline, socketData);

    NAVIGATION_BUTTONS.forEach(el => {
      el.onclick = () => clearTimeout(gameProcess.timeout);
    })

    // * Remove inserted modal-windows
    for (let el of document.querySelectorAll('#gameRoom  .modal-window')) {
      el.remove();
    }
    CONTENT.insertAdjacentHTML('afterbegin', this.getModalWindow());

    BULLETS.innerHTML = '';
    for (let obj of gameContent.data) {
      BULLETS.innerHTML += '<div></div>'
    }

    if (isOnline) {
      BULLETS.classList.add('display-none');
      const FIRST_PLAYER = PLAYERS_HEADER.querySelector('#firstPlayer');
      const SECONED_PLAER = PLAYERS_HEADER.querySelector('#seconedPlayer');
      FIRST_PLAYER.dataset.clientid = socketData.clientId;
      SECONED_PLAER.dataset.clientid =
        Object.keys(socketData.data)[0] == socketData.clientId ?
        Object.keys(socketData.data)[1] : Object.keys(socketData.data)[0]
      FIRST_PLAYER.querySelector('p').textContent = socketData.userName;
      SECONED_PLAER.querySelector('p').textContent =
        socketData.userNames[0] == socketData.userName ?
        socketData.userNames[1] : socketData.userNames[0];
      socket.addEventListener('message', msg => {
        msg = JSON.parse(msg.data);
        if (msg.event === 'leave') {
          gameProcess.current = 0;
          gameProcess.pauseTimer();
          gameProcess.finishGameProcess(true, msg);
        }
      })
    } else {
      BULLETS.classList.remove('display-none');
    }

    let BUTTONS = ANSWER_LIST.querySelectorAll('li button');

    if (BUTTONS.length === 0) {
      this.fillButtonsContent(ANSWER_LIST.querySelector('ul'), 4, true);
      BUTTONS = ANSWER_LIST.querySelectorAll('li button');
    }

    if (type == 'artists') {
      GAME_MEDIA.className = 'main-media';
      BULLETS.classList.remove('bullets-top');
      ANSWER_LIST.classList.remove('image-grid');
      TITLE.textContent = 'WHO is THE AUTHOR of THIS PICTURE?'
      gameProcess.setAnswersButtons(BUTTONS);
      gameProcess.insertImage(IMAGE, () => {
        router.gameQuizPage.loadHTMLcontent();
        if (isOnline)
          PLAYERS_HEADER.classList.remove('display-none')

      })
    } else {
      GAME_MEDIA.className = 'display-none';
      BULLETS.classList.add('bullets-top');
      ANSWER_LIST.classList.add('image-grid');
      gameProcess.setTitle(TITLE);
      gameProcess.setAnswersPictures(BUTTONS, () => {
        router.gameQuizPage.loadHTMLcontent();
        if (isOnline)
          PLAYERS_HEADER.classList.remove('display-none')
      });

    }

    BUTTONS.forEach(button => {
      button.addEventListener('click', e => {
        info = button.value;
        soundMaker.playGameSound(gameProcess.checkAnswer(info, key));
        gameProcess.insertAnswer(info, gameProcess.checkAnswer(info, key));
        gameProcess.showModalWindow(info, key, BUTTONS, IMAGE, TITLE);
        gameProcess.pauseTimer();
      })
    })
    gameProcess.pauseTimer();
    gameProcess.setTimerGame(BUTTONS, IMAGE, TITLE);
  }

  fillScorePage(from, to, cb = () => {}) {
    getImagesScore(from, to).then(images => {
      const SCORE_PAGE = document.querySelector('#scorePage div.content');
      SCORE_PAGE.scrollTop = 0;
      let curr = this.currentPage;
      let loadedImages = 0;
      document.querySelector('#scoreFooter .current').textContent = this.currentPage + 1;

      for (let img of images) {
        let imgPattern = new Image();
        imgPattern.src = this.getImageUrl(img.imageNum);
        imgPattern.onload = () => {
          loadedImages++;
          if (loadedImages == images.length - 1 && curr == this.currentPage) {
            cb();
            SCORE_PAGE.innerHTML = '';
            for (let i of images) {
              SCORE_PAGE.innerHTML += this.getScoreCell(+i.imageNum + 1, this.getImageUrl(i.imageNum), i.isPassed, i);
            }
            for (let i = 0; i < SCORE_PAGE.children.length; i++) {
              let el = SCORE_PAGE.children[i];
              if (!el.classList.contains('btn-to-down')) {
                el.addEventListener('click', e => {
                  soundMaker.playClickSound();
                  el.querySelector('.picture-info').classList.toggle('height-none');
                })
                setTimeout(() => {
                  el.classList.add('animate-s');
                }, 30 * i)
              }
            }
            this.addBtnScrollDown(SCORE_PAGE);

          }
        }
      }
    })
  }

  loadHTMLcontent(type, index, socketData) {
    const MAIN_CONTENT = document.getElementById('mainContent');
    const TITLE = document.getElementById('title');
    const currentContent = document.getElementById(this.contentID);

    function loadMainContent(cb = () => {}) {
      this.animateBody();
      MAIN_CONTENT.className = this.mainContentClass;
      TITLE.innerHTML = this.content.title;

      this.closeAll(MAIN_CONTENT);
      this.setContentVisibility(this.content.hideContentsById, this.content.showContentsById);
      this.addClassList(this.content.addClassNames)
      this.removeClassList(this.content.removeClassNames)

      currentContent.classList.remove('display-none');
      cb();
    }

    if (!this.content.isOnline) {
      if (!this.content.quizName && this.content.title !== 'score') loadMainContent.call(this);
      else if (this.content.title === 'score') {
        const PRE_SCORE_PAGE = document.getElementById('prevScorePage');
        const NEXT_SCORE_PAGE = document.getElementById('nextScorePage');
        const AMOUNT = document.querySelector('#scoreFooter .count');
        let blocksAmount = window.innerWidth > 1024 ? 10 : 12;
        let imagesAmount = imagesDescriptions.length;
        AMOUNT.textContent = (imagesAmount - 1) / blocksAmount;

        const getScorePage = e => {
            soundMaker.playClickSound();
            if (e.target.id == 'prevScorePage') this.currentPage--;
            else this.currentPage++;

            if (this.currentPage < 0) this.currentPage = (imagesAmount - 1) / blocksAmount - 1;
            else if (this.currentPage >= (imagesAmount - 1) / blocksAmount) this.currentPage = 0;

            this.fillScorePage(this.currentPage * blocksAmount, (this.currentPage + 1) * blocksAmount);
          }
          [PRE_SCORE_PAGE, NEXT_SCORE_PAGE].forEach(el => {
            el.onclick = getScorePage;
          })

        this.fillScorePage(this.currentPage * blocksAmount, (this.currentPage + 1) * blocksAmount, () => {
          loadMainContent.call(this);
        })

        window.onresize = () => {
          blocksAmount = window.innerWidth > 1024 ? 10 : 12;
          AMOUNT.textContent = (imagesAmount - 1) / blocksAmount;
          this.fillScorePage(this.currentPage * blocksAmount, (this.currentPage + 1) * blocksAmount);
        }
      } else {
        getGames(this.content.quizName).then(games => {
          const BTN_TO_CATEGORIES = document.getElementById('btnToCategories');
          BTN_TO_CATEGORIES.setAttribute('category', this.content.quizName);
          const currentItem = document.querySelector(`#${this.contentID} div.content`);
          currentItem.scrollTop = 0;
          currentItem.innerHTML = '';
          let index = 0;
          for (let i = 0; i < games.length; i++) {
            let {
              name,
              miniature,
              trueAnswers,
              data
            } = games[i];
            let htmlContent = this.getHTMLString(name, miniature, this.content.quizName, trueAnswers, data.length);
            currentItem.insertAdjacentHTML('beforeend', htmlContent);
            let el = document.getElementById(`${this.content.quizName}_${name - 1}`);

            el.addEventListener('click', e => {
              soundMaker.playClickSound();
              this.setGameContent(this.content.quizName, games[i]);
            })

            let img = currentItem.querySelector(`#${this.content.quizName}_${i} img`);
            img.onload = () => {
              index++;
              if (index == games.length - 1) {
                loadMainContent.call(this, () => {
                  this.addBtnScrollDown(currentItem);
                });
              }
            }
          }
        })
      }
    } else {
      getGames(type).then(games => {
        this.setGameContent(type, games[index], true, socketData);
      })
    }
  }

  returnToPage(arrOfElements) {

    arrOfElements.forEach((el) => {

      if (el) {
        el.addEventListener('click', () => {
          soundMaker.playClickSound();
          this.animateBody(true);
          setTimeout(() => {
            if (el.id === 'btnToCategories') {
              if (el.getAttribute('category') == 'artists')
                router.artistsQuizPage.loadHTMLcontent();
              else
                router.picturesQuizPage.loadHTMLcontent()
            } else this.loadHTMLcontent();
          }, 300)
        });
      }
    });
  }
}

Object.assign(LoadHTMLPage.prototype, cummonMixin);

export default LoadHTMLPage;