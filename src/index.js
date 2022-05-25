import './styles/style.scss';
import './styles/media.scss';
import router from './router/router';
import storage from './db/Storage';
import settings from './models/Settings';
import networking from './modules/networking';

const {
  homePage,
  settingsPage,
  artistsQuizPage,
  picturesQuizPage,
  scorePage,
} = router;

const BTN_TO_HOME = document.getElementById('btnToHome');
const OPEN_SETTINGS_BTN = document.getElementById('openSettingsBtn');
const ARTISTS_QUIZ_BTN = document.getElementById('artistQuizBtn');
const PICTURES_QUIZ_BTN = document.getElementById('picturesQuizBtn');
const BTN_TO_SCORE = document.getElementById('btnToScore');
const BTN_TO_CATEGORIES = document.getElementById('btnToCategories');

const VOLUME_INPUT = document.getElementById('volume');
const SAVE_SETTINGS_BTN = document.getElementById('saveSettingsBtn');
const SET_DEFAULT_SETTINGS_BTN = document.getElementById('setSettingsDefault');
const TIME_SECONDES_AMOUNT = document.getElementById('timeAmountSecondes');
const TIMER_CONTROLLER = document.getElementById('timerBox');

homePage.returnToPage([BTN_TO_HOME, SAVE_SETTINGS_BTN]);

settingsPage.returnToPage([OPEN_SETTINGS_BTN]);

artistsQuizPage.returnToPage([ARTISTS_QUIZ_BTN, BTN_TO_CATEGORIES]);

picturesQuizPage.returnToPage([PICTURES_QUIZ_BTN, BTN_TO_CATEGORIES]);
scorePage.returnToPage([BTN_TO_SCORE]);

function loadScript() {
  storage.openStore(() => {
    settings.loadSettings();
  });

  loadRangeGradient(VOLUME_INPUT);
}

function loadRangeGradient(el) {
  if (el) el.style.background = `linear-gradient(to right, #710707 0%, #710707 ${el.value}%, #C4C4C4 ${el.value}%, #C4C4C4 100%)`;
}

if (VOLUME_INPUT) {
  VOLUME_INPUT.addEventListener('input', (e) => {
    loadRangeGradient(e.target);
  });
}

VOLUME_INPUT.addEventListener('input', (e) => {
  const volume = e.target.value / 100;
  settings.volume = volume;
});

TIMER_CONTROLLER.addEventListener('change', (e) => {
  const isChecked = e.target.checked;
  settings.hasTime = isChecked;
  if (isChecked) TIME_SECONDES_AMOUNT.disabled = false;
  else TIME_SECONDES_AMOUNT.disabled = true;
});

TIME_SECONDES_AMOUNT.addEventListener('input', (e) => {
  document.getElementById('temerAmountValue').textContent = e.target.value;
  settings.time = e.target.value;
});

SAVE_SETTINGS_BTN.addEventListener('click', (e) => {
  if (!settings) return;
  settings.save();
});
SET_DEFAULT_SETTINGS_BTN.addEventListener('click', () => {
  settings.setDefault();
});

window.onload = loadScript;
