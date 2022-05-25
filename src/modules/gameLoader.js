import imagesDescriptions from './imagesEn';
import storage from '../db/Storage';

class Game {
  constructor(name, miniature, type) {
    this.name = name;
    this.type = type;
    this.miniature = miniature;
    this.data = [];
  }

  push(data) {
    this.data.push(data);
  }
}

const getImageUrl = (name) => `https://raw.githubusercontent.com/cheerfulperson/image-data/master/img/${name}.jpg`;

const ranomizer = (exception, limit = 240, key) => {
  const num = Math.round(Math.random() * limit);
  return imagesDescriptions[num][key] != exception ? num : ranomizer(exception, limit, key);
};

export const getGames = async (type) => {
  const games = [];
  let index = 1;
  let game;
  let i = type == 'artists' ? 0 : Math.floor(imagesDescriptions.length / 2);
  const border = type == 'artists' ? Math.floor(imagesDescriptions.length / 2) : imagesDescriptions.length;
  const playedGames = Array.isArray(storage.getItem('games')) ? storage.getItem('games') : [];
  for (i; i < border; i++) {
    const image = imagesDescriptions[i];

    if (i == 0 || i == Math.floor(imagesDescriptions.length / 2)) {
      game = new Game(index.toString(), getImageUrl(i), type);
      game.push(image);
    } else if ((i + 1) % 12 === 0) {
      game.push(image);
      games.push(game);
      index++;
      for (const obj of playedGames) {
        if (obj.name == game.name && obj.type == game.type) {
          game.data = obj.data;
          game.trueAnswers = obj.trueAnswersAmount;
        } else continue;
      }
      game = new Game(index.toString(), getImageUrl(i + 1), type);
    } else {
      game.push(image);
    }
  }
  return games;
};

export const getRandomInfo = async (exception, count = 3, type) => {
  const arr = [];
  const key = type === 'artists' ? 'author' : 'imageNum';
  for (let i = 0; i < count; i++) {
    const el = imagesDescriptions[ranomizer(exception, imagesDescriptions.length - 1, key)][key];
    arr.push(el);
  }
  return arr;
};

export const getImagesScore = async (from, to) => {
  const playedGames = Array.isArray(storage.getItem('games')) ? storage.getItem('games') : [];
  const images = [];
  for (let i = from; i < to; i++) {
    const el = imagesDescriptions[i];
    for (const obj of playedGames) {
      const { data } = obj;
      for (const description of data) {
        if (el.imageNum == description.imageNum && description.answer.isTrue) {
          el.isPassed = true;
        }
      }
    }
    images.push(el);
  }
  return images;
};
