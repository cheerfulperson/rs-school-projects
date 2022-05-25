import router from '../router/router';
import soundMaker from '../models/SoundMaker';
import cummonMixin from '../models/CummonMixin';
import store from '../db/Storage';

const {
  countTrueAnswers,
} = cummonMixin;
const socket = new WebSocket('ws://my-art-quiz.herokuapp.com');

const BUTTLE_ROOM_BTN = document.getElementById('onlineQuizBtn');
const MODAL = document.getElementById('modalW');
const PLAYERS_HEADER = document.getElementById('players');
const HEADER_BUTTONS = document.querySelectorAll('#header button');
const ONLINE_TEXT_CONTENT = document.querySelector('#modalW p.online .data');
const LEAVE_BTN = document.getElementById('leaveOnlineGame');

BUTTLE_ROOM_BTN.addEventListener('click', () => {
  soundMaker.playClickSound();
  MODAL.classList.remove('display-none');
  socket.send(JSON.stringify({
    event: 'open',
  }));
});

LEAVE_BTN.onclick = () => {
  soundMaker.playClickSound();
  MODAL.classList.add('display-none');
  socket.send(JSON.stringify({ event: 'leave' }));
};

HEADER_BUTTONS.forEach((el) => {
  el.addEventListener('click', (e) => {
    socket.send(JSON.stringify({ event: 'leave' }));
    PLAYERS_HEADER.classList.add('display-none');
  });
});
socket.onmessage = (msg) => {
  const {
    event,
    data,
    clientID,
  } = JSON.parse(msg.data);
  if (data)data.clientId = clientID;
  if (event === 'start') {
    ONLINE_TEXT_CONTENT.textContent = data.online;
  } else if (event === 'open') {
    MODAL.classList.add('display-none');

    router.onlineGameQuizPage.loadHTMLcontent(data.gameType, data.gameIndex, data);
    socket.send(JSON.stringify({
      event: 'fill',
      roomId: data.id,
      userId: clientID,
      results: [],
    }));
  } else if (event == 'leave') {

  } else if (event == 'fill') {
    const keys = Object.keys(data.data);
    const firstResults = data.data[clientID];
    const seconedResults = keys[0] == clientID ? data.data[keys[1]] : data.data[keys[0]];
    PLAYERS_HEADER.querySelectorAll('ul li').forEach((li) => {
      if (li.className == 'text') return;
      let score;
      if (li.dataset.clientid == clientID) { score = countTrueAnswers(firstResults); } else { score = countTrueAnswers(seconedResults); }
      li.querySelector('div.score-user').textContent = score;
    });
  }
};

export default socket;
