let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const VIDEO_IFRAMES_BLOCK = document.getElementById('videoIframes');
const BULLET_VIDEO_LOADER = document.getElementById('sliderCircles');
const MAIN_VIDEO = document.getElementById('mainVideo');

const VIDEO_CONTAINER = document.getElementById('videoContainer');
const MAIN_VIDEO_BTN = document.querySelector('#mainPLayBtn');
const PLAY_BTN = document.querySelector('#playBtn');
const INPUT_PROGRESS_VIDEO = document.querySelector('#progressVideo');
const BTN_VOLUME_TOGGLER = document.querySelector('#offVolume');
const INPUT_SOUND_VOLUME = document.querySelector('#soundLevel');
const BTN_FULL_SCREEN = document.getElementById('fullScreenBtn');

// Objects and arrays
let playerArr = [];

// Numbers
let opacityTimeOut, intervalVideo,
    activeBul = 0,
    speedV = 10;

// Boolen
let isFocused = false,
    isVideoPlayed = false,
    isVolumeOff = false,
    hasFullScreen = false;

const inputs = document.getElementsByTagName('input');
for (let input of inputs) {
    input.addEventListener('focus', () => {isFocused = true});
    input.addEventListener('blur', () => {isFocused = false});
}

class Video {
    constructor(block, mainPlayBtn, playBtn, volumeBtn, container, fullscreenBtn) {
        this.block = block;
        this.mainPlayBtn = mainPlayBtn;
        this.playBtn = playBtn;
        this.volumeBtn = volumeBtn;
        this.container = container;
        this.fullscreenBtn = fullscreenBtn;
    }

    async play() {
        isVideoPlayed = !isVideoPlayed;
        this.mainPlayBtn.style.display = 'none';
        this.playBtn.querySelector('img').src = "./assets/svg/videoPause.svg";
        return this.block.play();
    }

    async pause() {
        isVideoPlayed = !isVideoPlayed;
        this.mainPlayBtn.style.display = 'block';
        this.playBtn.querySelector('img').src = "./assets/svg/play.svg";
        return this.block.pause();
    }

    setVolume(volume) {
        if (volume == 0) {
            this.volumeBtn.querySelector('img').src = './assets/svg/volumeOff.svg';
            isVolumeOff = true;
        } else {
            isVolumeOff = false;
            this.volumeBtn.querySelector('img').src = './assets/svg/volume.svg';
        }

        this.block.volume = volume;
    }

    setTime(time) {
        this.block.currentTime = time;
    }

    getDuraction() {
        return this.block.duration;
    }

    setFullScreen() {
        document.body.style.overflow = 'hidden';
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
          } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
          }
        hasFullScreen = true;
        this.fullscreenBtn.querySelector('img').src = "./assets/svg/FrameOff.svg";
        if (!this.container.classList.contains('fullscreen'))
            this.container.classList.add('fullscreen');
    }

    removeFullScreen() {
        document.body.style.overflow = 'auto';
        if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
          }
        hasFullScreen = false;
        this.fullscreenBtn.querySelector('img').src = "./assets/svg/Frame.svg";
        if (this.container.classList.contains('fullscreen'))
            this.container.classList.remove('fullscreen');
    }

    changeSpeed(num = 0.25) {
        clearTimeout(opacityTimeOut);

        if (this.block.playbackRate + num > 2) this.block.playbackRate = 1.75;
        else if (this.block.playbackRate + num < 0) this.block.playbackRate = 0.25;

        this.block.playbackRate += num;

        this.container.querySelector('#videoSpeedAlert').innerHTML = `${this.block.playbackRate}x`;
        this.container.querySelector('#videoSpeedAlert').style.display = 'block';
        opacityTimeOut = setTimeout(() => {
            this.container.querySelector('#videoSpeedAlert').style.display = 'none';
        }, 1500)
    }
}
// Init Classs Video
let mainVideo = new Video(MAIN_VIDEO, MAIN_VIDEO_BTN, PLAY_BTN, BTN_VOLUME_TOGGLER, VIDEO_CONTAINER, BTN_FULL_SCREEN);


// ? ----> Iframes
function onYouTubeIframeAPIReady() {
    let videoChildren = VIDEO_IFRAMES_BLOCK.children;

    function pushVideo() {
        for (let el of videoChildren) {
            playerArr.push(new YT.Player(el.id, {
                origin: location.origin,
                width: "452px",
                height: "254px",
                videoId: el.getAttribute('videoId'),
                events: {
                    'onStateChange': onPlayerStateChange
                }
            }))
        }
    }
    pushVideo();
    // Init function which change video frame content
    initVideoSlidersMove();
}

function onPlayerStateChange(e) {
    if (e.data == '1') {
        for (let el of playerArr) {
            if (el.h.id != e.target.h.id) {
                el.pauseVideo();
            }
        }
    }
}

function initVideoSlidersMove() {
    let defoldScrollLeft = VIDEO_IFRAMES_BLOCK.children[0].offsetWidth + parseInt(getComputedStyle(VIDEO_IFRAMES_BLOCK.children[1]).marginLeft);

    VIDEO_IFRAMES_BLOCK.scrollTo(defoldScrollLeft, 0);

    let iframeWidth = VIDEO_IFRAMES_BLOCK.children[0].offsetWidth,
        scrollLeft, iframe;

    VIDEO_IFRAMES_BLOCK.addEventListener('scroll', e => {
        scrollLeft = e.target.scrollLeft;
        if (scrollLeft > iframeWidth * 2 + 15) {

            VIDEO_IFRAMES_BLOCK.appendChild(VIDEO_IFRAMES_BLOCK.children[0]);

            VIDEO_IFRAMES_BLOCK.scrollTo(defoldScrollLeft, 0);
            setActiveBullet(1)

        } else if (scrollLeft < 15) {

            VIDEO_IFRAMES_BLOCK.prepend(VIDEO_IFRAMES_BLOCK.children[VIDEO_IFRAMES_BLOCK.children.length - 1])

            VIDEO_IFRAMES_BLOCK.scrollTo(defoldScrollLeft, 0);
            setActiveBullet(-1)
        }

    })

    function moveVideoContent(dir) {
        intervalVideo = setTimeout(() => {
            if (dir === 1 && Math.round(VIDEO_IFRAMES_BLOCK.scrollLeft) <= 2 * iframeWidth - 1.5 * speedV) {
                VIDEO_IFRAMES_BLOCK.scrollLeft += speedV;
                moveVideoContent(dir);
            } else if (dir === -1 && Math.round(VIDEO_IFRAMES_BLOCK.scrollLeft) > 20) {
                VIDEO_IFRAMES_BLOCK.scrollLeft -= speedV;
                moveVideoContent(dir);
            } else {
                clearTimeout(intervalVideo);
                for (let el of playerArr) {
                    el.pauseVideo();
                }
                VIDEO_IFRAMES_BLOCK.scrollLeft = dir === 1 ? defoldScrollLeft * 2 + 16 : 0;
            }
        }, 5)
    }
    document.getElementById('preVideoBtn').addEventListener('click', e => {
        moveVideoContent(-1)
    })
    document.getElementById('postVideoBtn').addEventListener('click', e => {
        moveVideoContent(1)
    })

    let moveVideoInterval;

    function moveSlidersByBullets(el, index) {
        moveVideoInterval = setInterval(() => {
            if (index - activeBul > 0) {
                VIDEO_IFRAMES_BLOCK.scrollLeft += speedV;
            } else if (index - activeBul < 0) {
                VIDEO_IFRAMES_BLOCK.scrollLeft -= speedV;
            } else {
                clearInterval(moveVideoInterval);
                for (let el of playerArr) {
                    el.pauseVideo();
                }
            }
        }, 5)
    }

    BULLET_VIDEO_LOADER.querySelectorAll('div.slider__circle').forEach((el, i) => {
        el.addEventListener('click', e => {
            moveSlidersByBullets(el, i);
        })
    })
}

function setActiveBullet(num) {
    activeBul += num;

    let children = BULLET_VIDEO_LOADER.querySelectorAll('div.slider__circle');
    for (let el of children) {
        if (el.classList.contains('active'))
            el.classList.remove('active')
    }

    if (activeBul >= children.length) activeBul = 0;
    else if (activeBul < 0) activeBul = children.length - 1;

    children[activeBul].classList.add('active');
    setActiveVideo(activeBul)
}

function setActiveVideo(i) {
    MAIN_VIDEO.src = `./assets/video/video${i}.mp4`;
    MAIN_VIDEO.poster = `./assets/video/poster${i}.jpg`;
    mainVideo.setTime(0);
    mainVideo.pause();
}

// ? ---------> Events

// * Play btns 
function playOrPauseVideo() {
    if (!isVideoPlayed) mainVideo.play();
    else mainVideo.pause();
}

MAIN_VIDEO_BTN.addEventListener('click', playOrPauseVideo)
PLAY_BTN.addEventListener('click', playOrPauseVideo)

// * Main video events 
MAIN_VIDEO.addEventListener('click', playOrPauseVideo)

MAIN_VIDEO.addEventListener('timeupdate', e => {
    let time = (e.target.currentTime / e.target.duration * 100).toFixed(2);

    INPUT_PROGRESS_VIDEO.value = time && !isNaN(time) ? time : 0;
    INPUT_PROGRESS_VIDEO.style.cssText = `background: linear-gradient(to right, #710707 0%, #710707 ${+time < 30 ? +time + 0.5 : +time > 70 ? +time - 0.4 : +time}%, #C4C4C4 ${+time < 30 ? +time + 0.5 : +time > 70 ? +time - 0.4 : +time}%, #C4C4C4 100%);`;
    if (time == 100) {
        e.target.currentTime = 0;
        isVideoPlayed = true;
        mainVideo.pause();
    }
}, false);

// * Video progress input
INPUT_PROGRESS_VIDEO.addEventListener('input', e => {
    let timer = e.target.value / 100 * mainVideo.getDuraction();
    mainVideo.setTime(timer);
})

// * Volume inputes
function toggleVolum() {
    let volume = isVolumeOff ? 30 : 0;

    INPUT_SOUND_VOLUME.style.cssText = `background: linear-gradient(to right, #710707 0%, #710707 ${volume}%, #C4C4C4 ${volume}%, #C4C4C4 100%);`;
    INPUT_SOUND_VOLUME.value = volume;
    mainVideo.setVolume(volume / 100);
}
BTN_VOLUME_TOGGLER.addEventListener('click', toggleVolum);

INPUT_SOUND_VOLUME.addEventListener('input', e => {
    let volume = e.target.value / 100;
    mainVideo.setVolume(volume);
})

// * FullScreen Events
function setFullScreeen() {
    if (!hasFullScreen) mainVideo.setFullScreen();
    else mainVideo.removeFullScreen();
}

BTN_FULL_SCREEN.addEventListener('click', setFullScreeen)


function runOnKeys(cb, ...codes) {
    let pressed = new Set();

    document.addEventListener('keydown', (e) => {
        pressed.add(e.code);
        if(isFocused) return;

        for (let code of codes) {
            if (!pressed.has(code)) {
                return;
            }

        }

        e.preventDefault()
        cb(e);
    });

    document.addEventListener('keyup', (e) => {
        pressed.delete(e.code);
    });

}

runOnKeys(playOrPauseVideo, 'Space');
runOnKeys(toggleVolum, 'KeyM');
runOnKeys(setFullScreeen, 'KeyF');
runOnKeys(() => {
    mainVideo.changeSpeed(-0.25);
}, 'ShiftLeft', 'Comma');
runOnKeys(() => {
    mainVideo.changeSpeed(-0.25);
}, 'ShiftRight', 'Comma');
runOnKeys(() => {
    mainVideo.changeSpeed(0.25);
}, 'ShiftLeft', 'Period');
runOnKeys(() => {
    mainVideo.changeSpeed(0.25);
}, 'ShiftRight', 'Period');