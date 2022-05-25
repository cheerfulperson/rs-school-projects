const progress = document.querySelector('.progress__video');
const sound = document.querySelector('.sound__level');
const spanYear = document.getElementById('year');
const inputBasic18 = document.getElementById('inputBasic18');
const inputSenior65 = document.getElementById('inputSenior65');
const asideMenu = document.getElementById('nav-menu');
const SCROLL_UP_BTN = document.getElementById('scrollBTn');

const SECTION_GALLERY = document.getElementById('gallery');

const TICKETS_TYPES = document.getElementById('ticketsTypes');
const BLOCK_TICKETS_TYPES = document.querySelector("#ticket-select");
const INPUT_BASIC = document.getElementById('inputBasic18');
const INPUT_SENIOR = document.getElementById('inputSenior65');
const INPUT_BASIC_T = document.getElementById('basic18');
const INPUT_SENIOR_T = document.getElementById('senior65');
const INPUT_TICKET_DATE = document.getElementById('inputDate');
const INPUT_TICKET_TIME = document.getElementById('inputTime');
const SNACK_BAR = document.getElementById("snackbar");
const USER_NAME = document.getElementById('usernameT');
const USER_EMAIL = document.getElementById('emailT');
const USER_TEL = document.getElementById('telT');

const MODAL_IMG = document.getElementById('myModal');
const MODAL_IMAGE = document.getElementById('modalImage');
const ZOOM_INPUT = document.getElementById('zoomInput');
const SPEEK_BTN = document.getElementById('speekBtn');

let images = SECTION_GALLERY.querySelectorAll('div.gallery__pict img');

let scrollTop, count = 1,
    typePrice = 20,
    totalPrice = 40,
    offsetGalleryTop = SECTION_GALLERY.offsetTop,
    basicAmount = 0,
    seniorAmount = 0,
    zoom = 2;

let timeOutSnack;



// * -------------> General functions
function hasChildren(path, parent) {
    return path.find(e => e == parent) ? true : false;
}

function replaceUrl(url = '') {
    window.location.assign(url)
}

function getSelectedText() {
    return window.getSelection();
}

SPEEK_BTN.onclick = (e) => {
    const message = new SpeechSynthesisUtterance();
    message.lang = "en-EN";
    message.pitch = 0.75;
    message.text = getSelectedText();
    window.speechSynthesis.speak(message);
};

function openAndClose(id) {
    let btn = document.querySelector('#btnOpenNavMenu');

    if (count % 2 !== 0) {
        document.querySelector('.welcome__info').style.opacity = '0';
        document.getElementById(id).style.width = '100%';
        btn.innerHTML = `
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="33.2755" height="2.07972" transform="matrix(0.707105 0.707109 -0.707105 0.707109 1.4707 0)" fill="white"/>
            <rect width="33.2755" height="2.07972" transform="matrix(0.707105 -0.707109 0.707105 0.707109 0 23.5295)" fill="white"/>
        </svg>

        `
    } else {
        document.querySelector('.welcome__info').style.opacity = '1';
        document.getElementById(id).style.width = '0px';
        btn.innerHTML = `
        <svg width="32" height="18" viewBox="0 0 32 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="2" fill="white" />
            <rect y="8" width="32" height="2" fill="white" />
            <rect y="16" width="32" height="2" fill="white" />
        </svg>
        `
    }
    count++;
}

function setDisplay(el, display = 'block') {
    if (getComputedStyle(el).display == 'none')
        el.style.display = display
    else el.style.display = 'none';
}

function setFullFill(el) {
    el.classList.toggle('fullFill');
}


// * ------------> Tickets calc
function setAmount(el) {
    if (el.id == 'basic18' || el.id == 'inputBasic18') basicAmount = el.value;
    else seniorAmount = el.value;

    calcTotalPrice();
    setTicketAmount();
}

[INPUT_BASIC, INPUT_SENIOR, INPUT_SENIOR_T, INPUT_BASIC_T].forEach(el => {
    el.addEventListener('input', e => {
        setNumberInInput(0, e.target.id);
    })
})

function showBlockMessage(text = '') {
    clearTimeout(timeOutSnack);

    if (!SNACK_BAR.classList.contains('show')) SNACK_BAR.classList.add('show')
    SNACK_BAR.innerHTML = text;
    SNACK_BAR.style.position = 'absolute';
    timeOutSnack = setTimeout(() => {
        if (SNACK_BAR.classList.contains('show')) SNACK_BAR.classList.remove('show')
    }, 5000);
}

function getEuropeDate(date) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate();
}

function getWrongInput(el) {
    clearTimeout(timeOutSnack);
    if (!el.classList.contains('wrong__input'))
        el.classList.add('wrong__input');
    timeOutSnack = setTimeout(() => {
        if (el.classList.contains('wrong__input')) el.classList.remove('wrong__input');
    }, 5000);
}

function initCalcTickets() {
    TICKETS_TYPES.querySelectorAll('.tickets__label input').forEach(el => {
        el.addEventListener('click', (e) => {
            typePrice = +e.target.getAttribute('price');
            setTicketType();
            calcTotalPrice();
        })
    })

    BLOCK_TICKETS_TYPES.addEventListener('change', e => {
        typePrice = +e.target.value;
        setTicketType();
        calcTotalPrice();
    })


    // * -------------> Ticket section inputs
    document.getElementById('tDate').innerHTML = getEuropeDate(new Date());

    INPUT_TICKET_DATE.addEventListener('change', e => {
        let value = new Date(e.target.valueAsDate),
            date = new Date();

        if (value < date) {
            e.target.valueAsDate = date;
            showBlockMessage('Cannot select a date in the past')
        }
        document.getElementById('tDate').innerHTML = getEuropeDate(e.target.valueAsDate);
    });

    INPUT_TICKET_TIME.addEventListener('input', e => {
        let value = e.target.value.split(':');
        if (+value[0] < 9 || +value[0] > 18) {
            e.target.value = `${value[0] == 9 ? 9 : 18}:00`
            showBlockMessage('Time can be selected from 9:00 to 18:00 with an interval of 30 minutes');
        } else if (+value[1] % 30 != 0) {
            e.target.value = `${value[0]}:${+value[1] / 30 >= 0.5 && +value[0] != 18 ? "30" : "00"}`
            showBlockMessage('Time can be selected from 9:00 to 18:00 with an interval of 30 minutes');
        }
        document.getElementById('tTime').innerHTML = e.target.value;
    });

    USER_NAME.addEventListener('keyup', e => {
        e.preventDefault()

        if (!regTest(/^[a-zA-Zа-яА-Я\s]{3,15}$/, e.target.value) && e.target.value.length != 0) {
            getWrongInput(e.target);
            showBlockMessage('Username must contain from 3 to 15 characters, letters of the English or Russian alphabet in lower or upper case and spaces can be used as characters');
        } else {
            if (e.target.classList.contains('wrong__input')) e.target.classList.remove('wrong__input');
        }
    })
    USER_EMAIL.addEventListener('keyup', e => {
        if (!regTest(/^[A-Z0-9._%+-]{3,15}@[A-Z]{4}.[A-Z]{2}$/i, e.target.value) && e.target.value.length != 0) {
            getWrongInput(e.target);
            showBlockMessage('E-mail validation should only allow addresses of the form username@example.com, where: username - username, should contain from 3 to 15 characters (letters, numbers, underscore, hyphen), should not contain spaces; @ is a dog symbol; example - the first level domain consists of at least 4 Latin letters; com - top-level domain, separated from the first-level domain by a dot and consists of at least 2 Latin letters');
        } else {
            if (e.target.classList.contains('wrong__input')) e.target.classList.remove('wrong__input');
        }
    })
    USER_TEL.addEventListener('keyup', e => {
        if (!regTest(/^(\d[- ]?){0,10}$/, e.target.value) && e.target.value.length != 0) {
            getWrongInput(e.target);
            showBlockMessage('The number contains only numbers; without division or with division into two or three digits; separation of numbers can be separated by a hyphen or a space; with a limit on the number of digits no more than 10 digits');
        } else {
            if (e.target.classList.contains('wrong__input')) e.target.classList.remove('wrong__input');
        }
    })
    restoreSession()
}

function regTest(reg, text) {
    return reg.test(text)
}

function setNumberInInput(num = 0, id) {
    let el = document.getElementById(id);
    let count = Number(el.value) + num;

    if (count > 20) el.value = "20";
    else if (count < 0) el.value = "0";
    else el.value = count;

    setAmount(document.getElementById(id));
}

function calcTotalPrice() {
    totalPrice = basicAmount * typePrice + seniorAmount / 2 * typePrice;

    document.querySelectorAll('.total__price').forEach(el => {
        el.innerHTML = totalPrice;
    })
    document.getElementById('totalBPrice').innerHTML = basicAmount * typePrice;
    document.getElementById('totalSPrice').innerHTML = seniorAmount / 2 * typePrice;

    localStorage.setItem('ticketsStore', JSON.stringify({
        basicAmount: basicAmount,
        seniorAmount: seniorAmount,
        typePrice
    }));
}

function setTicketType() {
    TICKETS_TYPES.querySelectorAll('.tickets__label input').forEach(el => {
        if (el.getAttribute('price') == typePrice) el.checked = true;
    })

    for (let el of BLOCK_TICKETS_TYPES.children) {
        if (+el.value == typePrice) {
            el.selected = true;
            document.getElementById('tType').innerHTML = el.innerHTML;
        }
    }
}

function setTicketAmount() {
    INPUT_BASIC.value = basicAmount
    INPUT_BASIC_T.value = basicAmount;

    [INPUT_SENIOR, INPUT_SENIOR_T].forEach(el => {
        el.value = seniorAmount;
    })

    document.getElementById('BasTAmount').innerHTML = basicAmount;
    document.getElementById('SenTAmount').innerHTML = seniorAmount;
}

function restoreSession() {
    try {
        let ticketsStore = localStorage.getItem('ticketsStore') ? JSON.parse(localStorage.getItem('ticketsStore')) : null;
        if (ticketsStore) {
            basicAmount = +ticketsStore.basicAmount;
            seniorAmount = +ticketsStore.seniorAmount;
            typePrice = +ticketsStore.typePrice;

            setTicketAmount();
            setTicketType();
            calcTotalPrice();
        }

    } catch (error) {
        console.error(error)
    }
}
initCalcTickets()


// * ------> Images Slider
function changeImgSlider() {

    let imgWidth = document.querySelector("#explore > div > div.img-comp-container").offsetWidth,
        comparisonImages = document.querySelectorAll('div.img-comp-img img');

    for (i = 0; i < comparisonImages.length; i++) {
        comparisonImages[i].style.width = imgWidth + 'px';
    }
}

function initComparisons() {
    var i,
        x = document.getElementsByClassName("img-comp-overlay");

    changeImgSlider()
    for (i = 0; i < x.length; i++) {
        compareImages(x[i]);
    }

    function compareImages(img) {
        var slider, img, clicked = 0,
            w, h;
        /*get the width and height of the img element*/
        w = img.offsetWidth;
        h = img.offsetHeight;
        /*set the width of the img element to 50%:*/
        img.style.width = (w / 1.63) + "px";
        /*create slider:*/
        slider = document.createElement("DIV");
        slider.setAttribute("class", "img-comp-slider");
        slider.innerHTML = `<svg width="39" height="700" viewBox="0 0 39 700" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 365C27.5081 365 34 358.508 34 350.5C34 342.492 27.5081 336 19.5 336C11.4919 336 5 342.492 5 350.5C5 358.508 11.4919 365 19.5 365ZM19.5 370C30.2696 370 39 361.27 39 350.5C39 339.73 30.2696 331 19.5 331C8.73045 331 0 339.73 0 350.5C0 361.27 8.73045 370 19.5 370Z" fill="white"/>
        <path d="M17 0H22V332H17V0Z" fill="white"/>
        <path d="M17 368H22V700H17V368Z" fill="white"/>
        </svg>
        `
        /*insert slider*/
        img.parentElement.insertBefore(slider, img);
        /*position the slider in the middle:*/
        // slider.style.top = (h / 2) - (slider.offsetHeight / 2) + "px";
        slider.style.left = (w / 1.63) - (slider.offsetWidth / 2) + "px";
        /*execute a function when the mouse button is pressed:*/
        slider.addEventListener("mousedown", slideReady);
        /*and another function when the mouse button is released:*/
        window.addEventListener("mouseup", slideFinish);
        /*or touched (for touch screens:*/
        slider.addEventListener("touchstart", slideReady);
        /*and released (for touch screens:*/
        window.addEventListener("touchstop", slideFinish);

        function slideReady(e) {
            // /*prevent any other actions that may occur when moving over the image:*/
            // e.preventDefault();
            /*the slider is now clicked and ready to move:*/
            clicked = 1;
            /*execute a function when the slider is moved:*/
            window.addEventListener("mousemove", slideMove);
            window.addEventListener("touchmove", slideMove);
        }

        function slideFinish() {
            /*the slider is no longer clicked:*/
            clicked = 0;
        }

        function slideMove(e) {
            var pos;
            /*if the slider is no longer clicked, exit this function:*/
            if (clicked == 0) return false;
            /*get the cursor's x position:*/
            pos = getCursorPos(e)
            /*prevent the slider from being positioned outside the image:*/
            if (pos - 39 / 2 < 0) pos = 39 / 2 ;
            if (pos + 39 / 2  > w ) pos = w - 39 / 2 ;
            /*execute a function that will resize the overlay image according to the cursor:*/
            slide(pos);
        }

        function getCursorPos(e) {
            var a, x = 0;
            e = e || window.event;
            /*get the x positions of the image:*/
            a = img.getBoundingClientRect();
            /*calculate the cursor's x coordinate, relative to the image:*/
            x = e.pageX - a.left;
            /*consider any page scrolling:*/
            x = x - window.pageXOffset;
            return x;
        }

        function slide(x) {
            /*resize the image:*/
            img.style.width = x + "px";
            /*position the slider:*/
            slider.style.left = img.offsetWidth - (slider.offsetWidth / 2) + "px";
        }
    }
}



// * -----------------> Image zoom
function magnify(IMAGE_BLOCK, zoom) {
    let img, glass, w, h, bw;
    img = IMAGE_BLOCK;

    for (let el of img.parentElement.querySelectorAll('div.img-magnifier-glass')) {
        el.remove();
    }
    /*create magnifier glass:*/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");

    /*insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);

    /*set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;

    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);

    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);

    function moveMagnifier(e) {
        let pos, x, y;
        /*prevent any other actions that may occur when moving over the image*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;
        /*prevent the magnifier glass from being positioned outside the image:*/
        if (x > img.width - (w / zoom)) {
            x = img.width - (w / zoom);
        }
        if (x < w / zoom) {
            x = w / zoom;
        }
        if (y > img.height - (h / zoom)) {
            y = img.height - (h / zoom);
        }
        if (y < h / zoom) {
            y = h / zoom;
        }
        /*set the position of the magnifier glass:*/
        glass.style.left = (x - w) + "px";
        glass.style.top = (y - h) + "px";
        /*display what the magnifier glass "sees":*/
        glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }

    function getCursorPos(e) {
        let a, x = 0,
            y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {
            x: x,
            y: y
        };
    }
}

// * ----------------->Mapbox 
mapboxgl.accessToken = 'pk.eyJ1IjoiZWdvcmJvIiwiYSI6ImNrdThvaHpiMjRlbmsycnF0ZTNvcDEyY2wifQ.7curgW_rbZ79h3kHJiZiQw';

const geojson = {
    'type': 'FeatureCollection',
    'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [2.3330, 48.8619]
            },
            'properties': {
                'title': 'Mapbox',
                'description': ''
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [2.3333, 48.8602]
            },
            'properties': {
                'title': 'Mapbox',
                'description': ''
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [2.3397, 48.8607]
            },
            'properties': {
                'title': 'Mapbox',
                'description': ''
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [2.3364, 48.86091]
            },
            'properties': {
                'title': 'Mapbox',
                'description': ''
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [2.3365, 48.8625]
            },
            'properties': {
                'title': 'Mapbox',
                'description': ''
            }
        }
    ]
};
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/egorbo/ckulot98m43hn17q1seh8yrdv'
});


// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// add markers to map
for (const {
        geometry,
        properties
    } of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add it to the map
    new mapboxgl.Marker(el)
        .setLngLat(geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({
                offset: 25
            }) // add popups
            .setHTML(
                `<h3>${properties.title}</h3><p>${properties.description}</p>`
            )
        )
        .addTo(map);
}


// ? -------------> Events

progress.addEventListener('input', function () {
    const value = this.value;
    this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #C4C4C4 ${value}%, #C4C4C4 100%)`
})

sound.addEventListener('input', function () {
    const value = this.value;
    this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #C4C4C4 ${value}%, #C4C4C4 100%)`
})

SCROLL_UP_BTN.addEventListener('click', e => {
    window.scrollTo(0, 0);
})

ZOOM_INPUT.addEventListener('change', e => {
    if (e.target.value < 10) e.target.value = 10;
    zoom = e.target.value / 10;
    document.getElementById('textZoom').innerHTML = zoom;
    magnify(MODAL_IMAGE, zoom);
});

document.querySelector('body').addEventListener('click', e => {
    let btn = document.querySelector('button#btnOpenNavMenu');

    if (!hasChildren(e.composedPath(), asideMenu) && !hasChildren(e.composedPath(), btn)) {
        document.querySelector('.welcome__info').style.opacity = '1';
        document.getElementById('nav-menu').style.width = '0px';
        btn.innerHTML = `
        <svg width="32" height="18" viewBox="0 0 32 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="2" fill="white" />
            <rect y="8" width="32" height="2" fill="white" />
            <rect y="16" width="32" height="2" fill="white" />
        </svg>
        `
        count++;
    }

})

document.getElementById('discoverTheLovre').addEventListener('click', e => {
    replaceUrl('https://www.google.com/maps/@48.8618159,2.3366818,3a,75y,81.55h,73.4t/data=!3m7!1e1!3m5!1sAF1QipOVxZQuSy3Bx9T_HpH_7FtBHDTXvI6SF-A10ocT!2e10!3e12!7i5472!8i2736')
})

window.onresize = () => {
    changeImgSlider()
}

window.addEventListener('scroll', e => {
    scrollTop = window.scrollY + window.innerHeight;
    offsetGalleryTop = SECTION_GALLERY.offsetTop;
    if (scrollTop >= offsetGalleryTop) {

        for (let el of images) {
            if (scrollTop >= offsetGalleryTop + el.offsetTop + el.offsetHeight / 2 && el.getAttribute('animated') != '1') {
                el.setAttribute('animated', '1');
                el.animate([
                    // keyframes
                    {
                        marginTop: '70px',
                        opacity: 0,
                        width: "95%"
                    },
                    {
                        marginTop: '0px',
                        opacity: 1,
                        width: '100%'
                    }
                ], {
                    // timing options
                    duration: 500,
                    iterations: 1
                });
                el.style.opacity = '1';
            } else if (scrollTop <= offsetGalleryTop + el.offsetTop && el.getAttribute('animated') != '0') {
                el.setAttribute('animated', '0');
                el.style.opacity = '0';
            }
        }
    } else {
        for (let el of images) {
            if (scrollTop <= offsetGalleryTop + el.offsetTop && el.getAttribute('animated') != '0') {
                el.setAttribute('animated', '0');
                el.style.opacity = '0';
            }
        }
    }

    if (window.scrollY > 90) {
        SCROLL_UP_BTN.style.display = 'block';
    } else {
        SCROLL_UP_BTN.style.display = 'none';
    }

})

window.onload = () => {
    initScrollPoster();
    spanYear.innerHTML = new Date().getFullYear();
    for (let el of images) {
        el.addEventListener('click', e => {
            setDisplay(MODAL_IMG, 'block');
            MODAL_IMAGE.src = e.target.src;
            magnify(MODAL_IMAGE, zoom);
        })
    }
    console.log(`Дополнительные функции: по кнопке снизу в правом углу при нажатии скролится вверх,
    рядом кнопка(при выделении текста, нажав эту кнопку текст озвучивается), 
    в секции "галерея" при нажатии на картинку открывается модальное окно, 
    где можно посмотреть на эту картинку под увеличением`);
    console.log(`Additional functions: on the button at the bottom in the right corner, when pressed, it will scroll up,
    next to the button (when selecting text by pressing this button, the text is read out),
    in the "gallery" section, when you click on the picture, a modal window opens,
    where can I see this picture under the magnification`);
}




initComparisons();