import { $, fetchData, hasChildren } from "./js/general.js";
import AudioTag from "./js/audio.js";
import quotes from "./js/quotes.js";
import i18next from "i18next";
import playList from "./js/playList.js";

const TIME_STRING = $("time.time");
const DATE_STRING = $("date.date");
const NAME_INPUT = $("input#name");

const GREETING_SPAN = $("div.greeting-container span.greeting");
const BUTTON_slide_PRE = $("div.slider-icons .slide-prev");
const BUTTON_slide_NEXT = $("div.slider-icons .slide-next");

// * Weather block
const weatherIcon = $(".weather-icon");
const temperature = $(".temperature");
const weatherDescription = $(".weather-description");
const cityInput = $("#weatherValue");
const weatherError = $(".weather-error");
const wind = $(".wind");
const humidity = $(".humidity");

// * Quote block
const QUOTE = $(".quote");
const AUTHOR = $(".author");
const CHANGE_QUOTE_BTN = $(".change-quote");

// * Settings
const settings = document.querySelector("#settings");
const languageS = document.getElementById("languageS");
const photoSettings = document.getElementById("photoS");
const generalS = document.getElementById("generalS");
const iKeyword = document.getElementById("iKeyword");
const settingsUnlockBtn = document.querySelector(
  "footer div.settings-btn button"
);

let language = "en"; // ru, en
let bgCollection = "github"; // github, unsplash, flickr
let photo = [];

let imageNum = Math.floor(Math.random() * 20),
  dayPeriod = new Date();

let isVolumeOff = false;
let currentQuote = Math.floor(Math.random() * quotes.length);

const currentDuraction = $("#currentDuraction");
const allDurText = $("#allDuraction");
const volumeBtn = $("#volumeBtn");
const volumeRange = $("#volume");

let audioControllers = {
  btnPlay: $("#playBtn"),
  prePlaybtn: $("#playPrevBtn"),
  nextPlaybtn: $("#playNextBtn"),
  playList: $("#playList"),
  progressBar: $("#songProgress"),
  songName: $("#songName"),
  allDurText,
  volumeBtn,
  volumeRange,
};

// todo todoList
const dropbtn = document.getElementById("dropbtn");
let btnAddTodo = document.querySelector("#btnAddTodo");
const todoInput = document.querySelector(".todo-input input");
const todobBody = document.querySelector("section.todo-body");

let todoList = new Array();

let audio = new Audio();

let audioEl = new AudioTag(audio, playList, audioControllers);

// * i18next changer lng
let localize = i18next.init({
  lng: language, // if you're using a language detector, do not define the lng option
  debug: false,
  resources: {
    en: {
      translation: {
        languageS: {
          title: "Language",
          select: ["English", "Russian"],
        },
        photoS: {
          title: "Photo source",
          legent: "Collection of images",
          labels: {
            github: "Git Hub",
            unsplash: "Unsplash API",
            flickr: "Flickr API",
          },
          pKeyword: "Photo Keyword",
        },
        generalS: {
          title: "General",
          p: "Customize your dashbored",
          linksTitle: "Show",
          show: {
            dateS: "Date",
            timeS: "Time",
            greetingS: "Greeting",
            quoteS: "Quote of the day",
            weatherS: "Weather forecast",
            audioS: "Audio player",
            listS: "To-do list",
          },
        },
        todo: {
          title: "ToDo",
          text: "Inbox",
          body: {
            text: "Add a todo to get started",
            start: "New ToDo",
            edit: "Edit",
            del: "Delete",
            placeHolder: "Write your todo",
            inbox: "Inbox",
            today: "Today",
            done: "Archive",
          },
        },
      },
    },
    ru: {
      translation: {
        languageS: {
          title: "Язык",
          select: ["Английский", "Русский"],
        },
        photoS: {
          title: "Источник фото",
          legent: "Коллекция изображений",
          labels: {
            github: "Гит Хаб",
            unsplash: "Ансплэш ИПП",
            flickr: "Фликр ИПП",
          },
          pKeyword: "Ключевое слово",
        },
        generalS: {
          title: "Основное",
          p: "Настройте свой дашборд",
          linksTitle: "Показать",
          show: {
            dateS: "Дата",
            timeS: "Время",
            greetingS: "Приветствие",
            quoteS: "Цитата дня",
            weatherS: "Прогноз погоды",
            audioS: "Аудиоплеер",
            listS: "Список дел",
          },
        },
        todo: {
          title: "ТуДУ",
          text: "Входящие",
          body: {
            text: "Добавьте задачу, чтобы начать",
            start: "Новая запись",
            edit: "Редактировать",
            del: "Удалить",
            placeHolder: "Напишите свое дело",
            inbox: "Входящие",
            today: "Сегодня",
            done: "Архив",
          },
        },
      },
    },
  },
});

function getStringNumber(units, isHour = false) {
  return units < 10 ? "0" + units : units;
}

function getEuropeDate(date) {
  let days, months, str;
  if (language == "en") {
    days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    str =
      days[date.getDay()] +
      ", " +
      months[date.getMonth()] +
      " " +
      date.getDate();
  } else if (language == "ru") {
    days = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    months = [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря",
    ];
    str =
      days[date.getDay()] +
      ", " +
      date.getDate() +
      " " +
      months[date.getMonth()];
  }

  return str;
}

function getTimePeriod() {
  let hour = new Date().getHours();
  if (hour >= 0 && hour < 6) return "night";
  else if (hour >= 6 && hour < 12) return "morning";
  else if (hour >= 12 && hour < 18) return "afternoon";
  else if (hour >= 18 && hour < 24) return "evening";
}

function setDayPeriod(hour) {
  let expression = "";
  dayPeriod.setMinutes(59);
  dayPeriod.setSeconds(59);
  if (hour >= 0 && hour < 6) {
    if (language == "en") expression = "Good night";
    else if (language == "ru") expression = "Доброй ночи";
    dayPeriod.setHours(5);
  } else if (hour >= 6 && hour < 12) {
    if (language == "en") expression = "Good morning";
    else if (language == "ru") expression = "Доброе утро";
    dayPeriod.setHours(11);
  } else if (hour >= 12 && hour < 18) {
    if (language == "en") expression = "Good afternoon";
    else if (language == "ru") expression = "Добрый день";
    dayPeriod.setHours(17);
  } else if (hour >= 18 && hour < 24) {
    if (language == "en") expression = "Good evening";
    else if (language == "ru") expression = "Добрый вечер";
    dayPeriod.setHours(23);
  }
  return expression;
}

function reloadTime() {
  let date = new Date();
  let [HOURS, MINUTS, SECONDS] = TIME_STRING.children;

  [HOURS.innerHTML, MINUTS.innerHTML, SECONDS.innerHTML] = [
    getStringNumber(date.getHours(), true),
    getStringNumber(date.getMinutes()),
    getStringNumber(date.getSeconds()),
  ];

  if (dayPeriod - date < 0) {
    DATE_STRING.innerHTML = getEuropeDate(new Date());
    GREETING_SPAN.innerHTML = setDayPeriod(date.getHours()) + ",";
    if (!iKeyword.value) {
      photo.length = 0;
      localStorage.setItem("keyword", getTimePeriod());
    }
  }

  setTimeout(() => {
    reloadTime();
  }, 1000);
}

function setBg(url) {
  let img = new Image();
  img.src = url;
  img.onload = () => {
    document.getElementById("progressLoad").className = "";
    document.body.style.backgroundImage = `url(${url})`;
  };
}

function loadBg() {
  let url, keyWord;
  document.getElementById("progressLoad").className = "load";
  if (bgCollection === "github") {
    keyWord = getTimePeriod();
    url = new URL(
      `./assets/images/${keyWord}/${
        imageNum + 1 < 10 ? `0${imageNum + 1}` : imageNum + 1
      }.jpg?raw=true`,
      location.href
    ).href;
    setBg(url);
  } else if (bgCollection === "unsplash") {
    keyWord = localStorage.getItem("keyword") || getTimePeriod();
    url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${keyWord}&client_id=pzJQx45avWcLCo-upCKGH1-GtfcXXEp01XDAHiJWNiY`;
    fetchData(url).then((data) => {
      setBg(data.urls.regular);
    });
  } else if (bgCollection === "flickr") {
    keyWord = localStorage.getItem("keyword") || getTimePeriod();
    url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=67a961253fd1b8d257fcb946482159a9&tags=${keyWord}&extras=url_l&format=json&nojsoncallback=1`;
    if (photo.length == 0) {
      fetchData(url).then((data) => {
        console.log(data);
        for (let el of data.photos.photo) {
          photo.push(el.url_l);
        }
        setBg(photo[Math.floor(Math.random() * photo.length)]);
      });
    } else {
      setBg(photo[Math.floor(Math.random() * photo.length)]);
    }
  }
}

function setWeather() {
  let city = localStorage.getItem("city");
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${language}&appid=b2e80999bab3204f14a0a20a4714beb0&units=metric`;
  fetchData(url)
    .then((data) => {
      weatherError.textContent = "";
      if (data || data.code != 404) {
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${
          language == "ru" ? "Температура" : "Temperature"
        }: ${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${
          language == "ru" ? "Скорость ветра" : "Wind speed"
        }: ${Math.round(data.wind.speed)} ${language == "ru" ? "м/с" : "m/s"}`;
        humidity.textContent = `${
          language == "ru" ? "Влажность" : "Humidity"
        }: ${Math.round(data.main.humidity)} %`;
      }
    })
    .catch((err) => {
      weatherError.textContent = `Error 404! city not found for '${city}'`;
      weatherIcon.classList = "weather-icon owf";
      temperature.textContent = ``;
      weatherDescription.textContent = "";
      wind.textContent = "";
      humidity.textContent = "";
      console.error(err);
    });
}

function setQuote() {
  QUOTE.textContent = `"${quotes[currentQuote][language]["text"]}"`;
  AUTHOR.textContent = quotes[currentQuote][language]["author"];
}

function fillPlayList() {
  playList.forEach((el, i) => {
    audioControllers.playList.innerHTML += `
            <li id="song${i}" class="play-item">
                <button class="play-song player-icon play"id="songBtn${i}"></button>
                <span>${el.title} | </span>${el.duration}<span></span>
            </li>`;
  });
}

function addListenerToSongBtn() {
  for (let i = 0; i < playList.length; i++) {
    document.querySelector(`#songBtn${i}`).addEventListener("click", (e) => {
      audioEl.currentSongNumber = i;
      audioControllers.playList.querySelectorAll("button").forEach((el) => {
        if (el.classList.contains("pause")) {
          el.classList.remove("pause");
          el.classList.add("play");
        }
      });

      if (audioEl.isPlayd && e.target.getAttribute("active")) {
        audioEl.pause();
      } else {
        if (e.target.classList.contains("play"))
          e.target.classList.remove("play");
        e.target.classList.add("pause");
        audioEl.currentSongNumber = i;
        audioEl.setSong();
        audioEl.play();
      }
    });
  }
}

function replaceClassItem(item, removeStr, replaceStr) {
  item.classList.remove(removeStr);
  item.classList.add(replaceStr);
}

function loadLocalStorage() {
  if (localStorage.getItem("name"))
    NAME_INPUT.value = localStorage.getItem("name");

  if (!localStorage.getItem("city")) {
    localStorage.setItem("city", "Minsk");
  }
  cityInput.value = localStorage.getItem("city");

  if (!localStorage.getItem("lng")) {
    localStorage.setItem("lng", "en");
  } else {
    language = localStorage.getItem("lng");
    languageS.querySelector("select#language").value = language;
  }

  if (!localStorage.getItem("bgCollection")) {
    localStorage.setItem("bgCollection", bgCollection);
  } else {
    photoSettings.querySelectorAll("fieldset input").forEach((el) => {
      if (el.id == localStorage.getItem("bgCollection")) {
        bgCollection = el.id;
        el.checked = true;
      }
    });
  }

  if (
    localStorage.getItem("hidenItems") &&
    Object.keys(localStorage.getItem("hidenItems")).length != 0
  ) {
    hidenItems = JSON.parse(localStorage.getItem("hidenItems"));
    let event = new Event("change");
    for (let key in hidenItems) {
      let el = document.querySelector(
        `li#${hidenItems[key].hidingElParentId} label input`
      );
      el.checked = false;
      el.dispatchEvent(event);
    }
  }

  if (!localStorage.getItem("todoList")) localStorage.setItem("todoList", "[]");
  else if (localStorage.getItem("todoList").length != 0) {
    fillInbox();
  }
}

// Notes methods
function makeNoteDone(id, loc) {
  todoList.forEach((el) => {
    if (el.id == id) {
      if (el.done) {
        el.done = false;
        el.location = "inbox";
      } else el.done = true;
    }
  });
  localStorage.setItem("todoList", JSON.stringify(todoList));
  fillInbox(loc);
}

function editNote(id) {
  let elem = document.getElementById(id).querySelector("p.value");
  let input = document.createElement("input");
  input.type = "text";
  input.className = "beauty-input";
  input.value = elem.textContent;
  elem.innerHTML = "";
  elem.insertAdjacentElement("afterbegin", input);
  input.focus();
  showMenu(id);

  input.addEventListener("change", (e) => {
    elem.innerHTML = input.value;
    todoList.forEach((el) => {
      if (el.id == id) {
        el.value = input.value;
      }
    });
    localStorage.setItem("todoList", JSON.stringify(todoList));
  });
}

function deleteNote(id, loc) {
  todoList = todoList.filter((el) => el.id != id);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  fillInbox(loc);
}

function showMenu(id) {
  let elem = document.getElementById(id).querySelector("div.buttons");
  document
    .getElementById(id)
    .parentElement.querySelectorAll("div.buttons")
    .forEach((el) => {
      if (el.classList.contains("dropdown-hover") && el != elem)
        el.classList.remove("dropdown-hover");
    });

  elem.classList.toggle("dropdown-hover");
}
function moveNote(id, location, ru) {
  dropbtn.querySelector(".text").textContent = language == "en" ? location : ru;
  todoList.forEach((el) => {
    if (el.id == id) {
      if (location == "archive") {
        el.done = true;
      }
      el.location = location;
    }
  });
  localStorage.setItem("todoList", JSON.stringify(todoList));
  fillInbox(location);
}

function countLocationLists(loc) {
  let sum = 0;
  todoList.forEach((el) => {
    if (el.location == loc) sum++;
  });
  return sum;
}

function fillAmount() {
  document.querySelector("#inbox span.count").textContent =
    countLocationLists("inbox");
  document.querySelector("#today span.count").textContent =
    countLocationLists("today");
  document.querySelector("#done span.count").textContent =
    countLocationLists("archive");
}

function fillInbox(loc) {
  todoList = JSON.parse(localStorage.getItem("todoList"));
  let length = 0;
  fillAmount();
  if (todoList.length != 0) {
    todobBody.innerHTML = "";
    //({id: Date.now(), value: e.target.value, date: new Date(), done: false, location: 'inbox'})
    let ul = document.createElement("ul");
    ul.className = "list";
    for (let el of todoList) {
      if (loc == "inbox" && el.location == "inbox") {
        length++;
        ul.innerHTML += `
                    <li id="${el.id}" class="list-item">
                        <input class="checkb" ${
                          el.done ? "checked" : ""
                        } type="checkbox">
                        <p class="value">${el.value}</p>
                        <button class="menu">...</button>
                        <div class="dropdown-content buttons" >
                            <button class="Edit">${
                              language == "en" ? "Edit" : "Редактировать"
                            }</button>
                            <button class="Move">${
                              language == "en" ? "Move to Today" : "В сегодня"
                            }</button>
                            <button class="Archive">${
                              language == "en" ? "Archive" : "Архивировать"
                            }</button>
                            <button class="Delete">${
                              language == "en" ? "Delete" : "Удалить"
                            }</button>
                        </div>
                    </li>`;
      } else if (loc == "today" && el.location == "today") {
        length++;
        ul.innerHTML += `
                    <li id="${el.id}" class="list-item">
                        <input class="checkb" ${
                          el.done ? "checked" : ""
                        } type="checkbox">
                        <p class="value">${el.value}</p>
                        <button class="menu">...</button>
                        <div class="dropdown-content buttons" >
                            <button class="Edit">${
                              language == "en" ? "Edit" : "Редактировать"
                            }</button>
                            <button class="MoveI">${
                              language == "en" ? "Move to Inbox" : "Во входяще"
                            }</button>
                            <button class="Delete">${
                              language == "en" ? "Delete" : "Удалить"
                            }</button>
                        </div>
                    </li>`;
      } else if (loc == "archive" && el.location == "archive") {
        length++;
        ul.innerHTML += `
                    <li id="${el.id}" class="list-item">
                        <input class="checkb" ${
                          el.done ? "checked" : ""
                        } type="checkbox">
                        <p class="value">${el.value}</p>
                        <button class="menu">...</button>
                        <div class="dropdown-content buttons" >
                            <button class="Edit">${
                              language == "en" ? "Edit" : "Редактировать"
                            }</button>
                            <button class="Delete">${
                              language == "en" ? "Delete" : "Удалить"
                            }</button>
                        </div>
                    </li>`;
      }
    }
    if (length == 0) {
      todobBody.innerHTML = `<p class="text">${
        language == "en" ? "List is empty" : "Лист пуст"
      }</p>`;
    }
    // todoLis
    ul.querySelectorAll("input.checkb").forEach((el) => {
      el.addEventListener("change", (e) => {
        let id = e.target.parentElement.id;
        makeNoteDone(id, loc);
      });
    });
    todobBody.insertAdjacentElement("beforeend", ul);
    ["menu", "Edit", "Move", "Archive", "Delete", "MoveI"].forEach(
      (className) => {
        ul.querySelectorAll("." + className).forEach((el) => {
          el.addEventListener("click", (e) => {
            let id =
              className == "menu"
                ? e.target.parentElement.id
                : e.target.parentElement.parentElement.id;
            if (className == "menu") showMenu(id);
            else if (className == "Edit") editNote(id);
            else if (className == "Archive") moveNote(id, "archive", "Архив");
            else if (className == "Move") moveNote(id, "today", "Сегодня");
            else if (className == "MoveI") moveNote(id, "inbox", "Входящие");
            else if (className == "Delete") deleteNote(id, loc);
          });
        });
      }
    );

    todoInput.style.width = "80%";
  } else {
    todobBody.innerHTML = `<p class="text">${
      language == "en"
        ? "Add a todo to get started"
        : "Добавьте задачу, чтобы начать"
    }</p>
                                <button id="btnAddTodo" class="btnAddTodo">New ToDo</button> `;
    todoInput.style.width = "0%";
    btnAddTodo = document.querySelector(".btnAddTodo");
    btnAddTodo.addEventListener("click", () => {
      todoInput.style.width = "80%";
      todoInput.focus();
    });
  }
}

function changeLanguage() {
  let date = new Date();
  let defCity = language == "ru" ? "Минск" : "Minsk";
  if (
    localStorage.getItem("city") == "Minsk" ||
    localStorage.getItem("city") == "Минск"
  ) {
    localStorage.setItem("city", defCity);
    cityInput.value = defCity;
  }

  DATE_STRING.innerHTML = getEuropeDate(date);
  GREETING_SPAN.innerHTML = setDayPeriod(date.getHours()) + ",";

  i18next.changeLanguage(language);
  localize.then((t) => {
    languageS.querySelector("h2.title").textContent =
      i18next.t(`languageS.title`);
    languageS.querySelectorAll("select option").forEach((el, i) => {
      el.textContent = t(`languageS.select.${i}`);
    });
    photoSettings.querySelector("h2.title").textContent = t(`photoS.title`);
    photoSettings.querySelector("fieldset p").textContent = t(`photoS.legent`);
    photoSettings.querySelectorAll("fieldset label").forEach((el) => {
      el.textContent = t(`photoS.labels.${el.className}`);
    });
    photoSettings.querySelector(`div#tagP label`).textContent =
      t(`photoS.pKeyword`) + ":";

    generalS.querySelector("h2.title").textContent = t(`generalS.title`);
    generalS.querySelector("p.pre-title").textContent = t(`generalS.p`);
    generalS.querySelector("h3.links-title").textContent =
      t(`generalS.linksTitle`);
    generalS.querySelectorAll("ul li").forEach((el) => {
      el.querySelector("div.text").textContent = t(`generalS.show.${el.id}`);
    });
    document.querySelector(".todo-btn button").textContent = t(`todo.title`);
    dropbtn.querySelector(".text").textContent = t(`todo.text`);

    if (todobBody.querySelector(".text"))
      todobBody.querySelector(".text").textContent = t(`todo.body.text`);
    if (todobBody.querySelector("#btnAddTodo"))
      todobBody.querySelector("#btnAddTodo").textContent = t(`todo.body.start`);
    todobBody.querySelectorAll(".Edit").forEach((el) => {
      el.textContent = t(`todo.body.edit`);
    });
    todobBody.querySelectorAll(".Delete").forEach((el) => {
      el.textContent = t(`todo.body.del`);
    });
    todoInput.placeholder = t(`todo.body.placeHolder`);

    document.querySelector("#inbox span.text").textContent =
      t(`todo.body.inbox`);
    document.querySelector("#today span.text").textContent =
      t(`todo.body.today`);
    document.querySelector("#done span.text").textContent = t(`todo.body.done`);
  });

  // ? init function
  setWeather();
  setQuote();
}

function togleTodoList(e) {
  document.getElementById("myDropdown").classList.toggle("dropdown-hover");
}
document.querySelector(".todo-btn button").addEventListener("click", (e) => {
  document.querySelector(".todo-form").classList.toggle("height-h");
  fillInbox("inbox");
});
dropbtn.addEventListener("click", (e) => {
  togleTodoList(e.target);
});

btnAddTodo.addEventListener("click", () => {
  todoInput.style.width = "80%";
});

document.getElementById("inbox").addEventListener("click", (e) => {
  dropbtn.querySelector(".text").textContent =
    document.querySelector("#inbox span.text").textContent;
  fillInbox("inbox");
});

document.getElementById("today").addEventListener("click", (e) => {
  dropbtn.querySelector(".text").textContent =
    document.querySelector("#today .text").textContent;
  fillInbox("today");
});

document.getElementById("done").addEventListener("click", (e) => {
  dropbtn.querySelector(".text").textContent =
    document.querySelector("#done .text").textContent;
  fillInbox("archive");
});
// * Listeners
NAME_INPUT.addEventListener("input", (e) => {
  localStorage.setItem("name", e.target.value);
});

todoInput.addEventListener("change", (e) => {
  if (!e.target.value) return;

  todoList.push({
    id: Date.now(),
    value: e.target.value,
    date: new Date(),
    done: false,
    location: "inbox",
  });
  localStorage.setItem("todoList", JSON.stringify(todoList));
  fillInbox("inbox");
  dropbtn.querySelector(".text").textContent =
    language == "en" ? "Inbox" : "Входящие";
  e.target.value = "";
});
BUTTON_slide_NEXT.addEventListener("click", () => {
  imageNum++;
  if (imageNum > 19) imageNum = 0;
  loadBg();
});

BUTTON_slide_PRE.addEventListener("click", () => {
  imageNum--;
  if (imageNum < 0) imageNum = 19;
  loadBg();
});

CHANGE_QUOTE_BTN.addEventListener("click", () => {
  currentQuote = Math.floor(Math.random() * quotes.length);
  setQuote();
});

cityInput.addEventListener("change", (e) => {
  localStorage.setItem("city", e.target.value);
  setWeather();
});
volumeBtn.addEventListener("click", (e) => {
  if (isVolumeOff) {
    volumeRange.value = 20;
    audioEl.volume = 0.2;
    isVolumeOff = false;
    replaceClassItem(e.target, "volume-off", "volume-on");
  } else {
    volumeRange.value = 0;
    audioEl.volume = 0;
    isVolumeOff = true;
    replaceClassItem(e.target, "volume-on", "volume-off");
  }
});
volumeRange.addEventListener("input", (e) => {
  let value = e.target.value;

  if (value == 0) {
    isVolumeOff = true;
    audioEl.volume = 0;
    replaceClassItem(volumeBtn, "volume-on", "volume-off");
  } else {
    audioEl.volume = value / 100;
    isVolumeOff = false;
    replaceClassItem(volumeBtn, "volume-off", "volume-on");
  }
});

audioControllers.nextPlaybtn.addEventListener("click", () =>
  audioEl.nextSong()
);
audioControllers.prePlaybtn.addEventListener("click", () => audioEl.preSong());

audioControllers.btnPlay.addEventListener("click", (e) => {
  if (audioEl.isPlayd) audioEl.pause();
  else audioEl.play();
});

audioControllers.progressBar.addEventListener("input", (e) => {
  let dur = (e.target.value / 100) * audio.duration;
  audio.currentTime = dur;
});

audio.addEventListener("timeupdate", (e) => {
  let ct = e.target.currentTime;
  let dur = (ct / audio.duration) * 100;
  audioControllers.progressBar.value = isNaN(dur) ? 0 : dur;
  currentDuraction.textContent = `${ct / 60 < 1 ? "0" : Math.floor(ct / 60)}:${
    ct / 60 > 1
      ? (ct / 60).toFixed(2).split(".")[1]
      : ct.toFixed(0) < 10
      ? "0" + ct.toFixed(0)
      : ct.toFixed(0)
  }`;
  if (dur === 100) audioEl.nextSong();
});

// * settings
iKeyword.addEventListener("change", (e) => {
  photo.length = 0;
  localStorage.setItem("keyword", e.target.value);
  loadBg();
});

settingsUnlockBtn.addEventListener("click", (e) => {
  settings.classList.toggle("fixed-height");
});

languageS.querySelector("select#language").addEventListener("change", (e) => {
  language = e.target.value;
  localStorage.setItem("lng", e.target.value);
  changeLanguage();
});

photoSettings.querySelectorAll("fieldset input").forEach((el) => {
  el.addEventListener("change", (e) => {
    bgCollection = e.target.id;
    localStorage.setItem("bgCollection", e.target.id);
    loadBg();
  });
});

function showElemenetById(id) {
  document.getElementById(id).style.opacity = "1";
}

function hideElemenetById(id) {
  document.getElementById(id).style.opacity = "0";
}

let hidenItems = new Object();

generalS.querySelectorAll("ul li label input").forEach((el) => {
  el.addEventListener("change", (e) => {
    if (e.target.checked) {
      showElemenetById(e.target.value);
      delete hidenItems[e.target.value];
    } else {
      hideElemenetById(e.target.value);
      hidenItems[e.target.value] = {
        hidingElParentId: el.parentElement.parentElement.id,
      };
    }
    localStorage.setItem("hidenItems", JSON.stringify(hidenItems));
  });
});

window.addEventListener("click", (e) => {
  if (
    !hasChildren(e.composedPath(), settings) &&
    e.target != settingsUnlockBtn
  ) {
    settings.classList.remove("fixed-height");
  }

  if (!e.target.matches(".dropbtn")) {
    let dropdowns = document.getElementsByClassName("dropdown-content");

    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }

  if (
    !e.target.matches("#myDropdown") &&
    !hasChildren(e.composedPath(), dropbtn)
  ) {
    document.getElementById("myDropdown").classList.remove("dropdown-hover");
  }

  if (!e.target.matches(".buttons") && e.target.className != "menu") {
    document.querySelectorAll(".todo-body div.buttons").forEach((el) => {
      if (el.classList.contains("dropdown-hover"))
        el.classList.remove("dropdown-hover");
    });
  }
});

window.onload = () => {
  dayPeriod.setHours(0);

  loadLocalStorage();
  iKeyword.value = localStorage.getItem("keyword") || null;

  loadBg();
  changeLanguage();
  reloadTime();
  fillPlayList();
  addListenerToSongBtn();
  audioEl.setSong();
};
