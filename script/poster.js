const POSTERS_BLOCK = document.querySelector('#poster');
const SLIDER_COUNT_BOX = document.querySelector('div.slider__boxes');

const speed = 25;

let imgWidth = 1000;
let interval, timeStap, preX = 0;

POSTERS_BLOCK.scrollLeft = imgWidth;

function activeNavPosterBar(i) {
    for (let e of SLIDER_COUNT_BOX.children) {
        if (e.classList.contains('active'))
            e.classList.remove('active')
    }
    SLIDER_COUNT_BOX.children[i].classList.toggle('active');
}

function initScrollPoster() {
    imgWidth = POSTERS_BLOCK.querySelector('img').offsetWidth;
    POSTERS_BLOCK.scrollLeft = imgWidth;
}

function setOpacityToPosters() {
    for (let el of POSTERS_BLOCK.children) {
        el.style.cssText = 'opacity: 0.3;'
    }
    POSTERS_BLOCK.children[1].style.opacity = '1';
}

function movePoster(dir = 1) {
    interval = setTimeout(() => {
        if (dir === 1 && Math.round(POSTERS_BLOCK.scrollLeft) <= 2 * imgWidth - 2 * speed) {
            POSTERS_BLOCK.scrollLeft += speed;
            movePoster(dir);
        } else if (dir === -1 && Math.round(POSTERS_BLOCK.scrollLeft) > speed * 1.5) {
            POSTERS_BLOCK.scrollLeft -= speed;
            movePoster(dir);
        } else {
            clearTimeout(interval);
            POSTERS_BLOCK.scrollLeft = dir === 1 ? 2 * imgWidth - 10 : 10;

        }
    }, 10)
}

SLIDER_COUNT_BOX.childNodes.forEach(ch => {
    ch.addEventListener('click', e => {
        let span = e.target.getAttribute('span'),
            imgNum = POSTERS_BLOCK.children[1].getAttribute('alt');


        timeStap = setInterval(() => {
            if (span != POSTERS_BLOCK.children[1].getAttribute('alt')) {
                if (span - imgNum > 0) POSTERS_BLOCK.scrollLeft += speed * 3;
                else POSTERS_BLOCK.scrollLeft -= speed * 3;
            } else {
                clearInterval(timeStap)
            }
        }, 10)
    })
})

POSTERS_BLOCK.addEventListener('mousedown', e => {
    preX = e.layerX;
})

POSTERS_BLOCK.addEventListener('mouseup', e => {
    clearTimeout(interval);
    if (e.layerX - preX > 0) movePoster(1);
    else movePoster(-1);
})

// POSTERS_BLOCK.addEventListener('touchstart', e => {
//     preX = e.layerX;
// })

// POSTERS_BLOCK.addEventListener('touchstop', e => {
//     clearTimeout(interval);
//     if (e.layerX - preX > 0) movePoster(1);
//     else movePoster(-1);
// })

POSTERS_BLOCK.addEventListener('scroll', e => {
    let index = 0,
        firstChild = POSTERS_BLOCK.children[0],
        middleChild = POSTERS_BLOCK.children[1],
        thirdChild = POSTERS_BLOCK.children[2],
        img = document.createElement('img');


    if (POSTERS_BLOCK.scrollLeft >= 2 * imgWidth - speed) {
        index = parseInt(thirdChild.getAttribute('alt'));

        document.querySelector('span#counter').innerHTML = `0${index + 1}`;
        activeNavPosterBar(index)
        img.src = `./assets/img/welcome-slider/${index == 4 ? 1 : index + 2}.jpg`;
        img.setAttribute('alt', index == 4 ? 0 : index + 1);
        POSTERS_BLOCK.insertAdjacentElement('beforeend', img);
        firstChild.remove();
        POSTERS_BLOCK.scrollLeft = imgWidth;
    } else if (POSTERS_BLOCK.scrollLeft <= speed) {
        index = parseInt(firstChild.getAttribute('alt'));

        document.querySelector('span#counter').innerHTML = `0${index + 1}`;
        activeNavPosterBar(index);

        setTimeout(() => {
            img.src = `./assets/img/welcome-slider/${index == 0 ? 5 : index}.jpg`;
            img.setAttribute('alt', index == 0 ? 4 : index - 1);
            POSTERS_BLOCK.insertAdjacentElement('afterbegin', img);
            thirdChild.remove();
            POSTERS_BLOCK.scrollLeft = imgWidth;
        }, 8)
    }
    setOpacityToPosters()
})
