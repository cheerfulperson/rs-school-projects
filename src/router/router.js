import LoadHTMLPage from '../models/HTMLManager';

const removeClassNames = [{
  selector: 'header',
  classList: ['min-head'],
}, {
  selector: 'main',
  classList: ['max-main'],
}];

const homePageContent = {
  title: '&nbsp;',
  hideContentsById: ['setSettingsDefault',
    'saveSettingsBtn',
    'btnToHome',
    'btnToScore',
    'btnToCategories',
    'gameHeader',
    'scoreFooter',
  ],
  showContentsById: ['openSettingsBtn', 'footer', 'navigation', 'logo', 'contacts', 'footerButtonsList'],
  removeClassNames,
};

const homePage = new LoadHTMLPage('startContent', 'container', homePageContent);

const settingsPageContent = {
  title: 'settings',
  hideContentsById: ['openSettingsBtn', 'btnToScore', 'btnToCategories', 'btnToHome', 'gameHeader', 'scoreFooter'],
  showContentsById: ['setSettingsDefault', 'saveSettingsBtn', 'footer', 'contacts', 'footerButtonsList'],
  removeClassNames,
};

const settingsPage = new LoadHTMLPage('settingContent', 'container', settingsPageContent);

const asristQuizPageContent = {
  title: 'categories',
  quizName: 'artists',
  hideContentsById: ['footer', 'btnToHome', 'btnToCategories', 'gameHeader'],
  showContentsById: ['btnToHome', 'btnToScore', 'navigation', 'logo'],
  removeClassNames,
};

const artistsQuizPage = new LoadHTMLPage('categoryPage', 'container', asristQuizPageContent);

const picturesQuizPageContent = {
  title: 'categories',
  quizName: 'pictures',
  hideContentsById: ['footer', 'btnToCategories', 'gameHeader'],
  showContentsById: ['btnToHome', 'btnToScore', 'navigation', 'logo'],
  removeClassNames,
};

const picturesQuizPage = new LoadHTMLPage('categoryPage', 'container', picturesQuizPageContent);

const socrePageContent = {
  title: 'score',
  hideContentsById: ['footerButtonsList', 'btnToScore', 'gameHeader', 'contacts'],
  showContentsById: ['btnToHome', 'navigation', 'scoreFooter', 'logo', 'btnToCategories', 'footer'],
  removeClassNames,
};

const scorePage = new LoadHTMLPage('scorePage', 'container', socrePageContent);

const gamePageContent = {
  title: '',
  hideContentsById: ['footer', 'logo', 'btnToScore'],
  showContentsById: ['gameHeader', 'btnToCategories', 'btnToHome'],
  addClassNames: [{
    selector: 'header',
    classList: ['min-head'],
  }, {
    selector: 'main',
    classList: ['max-main'],
  }],
};

const gameQuizPage = new LoadHTMLPage('gameRoom', 'container', gamePageContent);

const onlineGamePageContent = {
  title: '',
  isOnline: true,
  hideContentsById: ['footer', 'logo', 'btnToScore', 'btnToCategories', 'btnToHome'],
  showContentsById: ['gameHeader'],
  addClassNames: [{
    selector: 'header',
    classList: ['min-head'],
  }, {
    selector: 'main',
    classList: ['max-main'],
  }],
};

const onlineGameQuizPage = new LoadHTMLPage('gameRoom', 'container', onlineGamePageContent);

const resultsPageContent = {
  title: 'Results',
  hideContentsById: ['footer', 'btnToScore', 'btnToCategories', 'gameHeader'],
  showContentsById: ['navigation', 'btnToHome', 'logo'],
  addClassNames: [{
    selector: 'header',
    classList: ['min-head'],
  }, {
    selector: 'main',
    classList: ['max-main'],
  }],
};

const resultsPage = new LoadHTMLPage('resultsRoom', 'container', resultsPageContent);

export default {
  homePage,
  settingsPage,
  artistsQuizPage,
  picturesQuizPage,
  gameQuizPage,
  onlineGameQuizPage,
  scorePage,
  resultsPage,
};
