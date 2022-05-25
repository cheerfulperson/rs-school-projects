class AudioTag {
    constructor(audioBlock, playList, controllers = {}) {
        this.audio = audioBlock;
        this.playList = playList;
        this.controllers = controllers;
        this.currentSong = 0;
        this.isPlayd = false;
    }

    setSong() {
        this.audio.src = this.playList[this.currentSong].src;
        this.controllers.songName.textContent = `${this.currentSong + 1}. ${this.playList[this.currentSong].title}`
        this.controllers.allDurText.textContent = this.playList[this.currentSong].duration;
        for (let el of this.controllers.playList.children)
            el.classList.remove('item-active');
        this.controllers.playList.querySelector('#song' + this.currentSong).classList.add('item-active');

    }

    play() {
        this.isPlayd = true;
        this.audio.play();
        if(this.controllers.btnPlay.classList.contains('play')){
            this.controllers.btnPlay.classList.remove('play');
            if(!this.controllers.btnPlay.classList.contains('pause'))
                this.controllers.btnPlay.classList.add('pause');
        }
        let playSongBtn = this.controllers.playList.querySelector(`button#songBtn${this.currentSong}`);
        this.controllers.playList.querySelectorAll(`button`).forEach((el, i) => {
            if(el.classList.contains('pause'))
                el.classList.remove('pause');
            if(!el.classList.contains('play'))
                el.classList.add('play');
            if(el.getAttribute('active'))
                el.removeAttribute('active');
        });
        if(playSongBtn.classList.contains('play')){
            playSongBtn.setAttribute('active', 'true');
            playSongBtn.classList.remove('play');
            if(!playSongBtn.classList.contains('pause'))
                playSongBtn.classList.add('pause');
        }
    }

    pause() {
        let playSongBtn = this.controllers.playList.querySelector(`button#songBtn${this.currentSong}`);
        if(this.controllers.btnPlay.classList.contains('pause')){
            this.controllers.btnPlay.classList.remove('pause');
            if(!this.controllers.btnPlay.classList.contains('play'))
                this.controllers.btnPlay.classList.add('play');
        }

        if(playSongBtn.classList.contains('pause')){
            playSongBtn.removeAttribute('active');
            playSongBtn.classList.remove('pause');
            if(!playSongBtn.classList.contains('play'))
                playSongBtn.classList.add('play');
        }
        this.isPlayd = false;
        this.audio.pause();
    }

    nextSong() {
        this.currentSong++;
        if (this.currentSong >= this.playList.length) this.currentSong = 0;
        this.setSong();
        if(this.isPlayd){
            this.play();
        }
    }

    preSong() {
        this.currentSong--;
        if (this.currentSong < 0) this.currentSong = this.playList.length - 1;
        this.setSong();
        if(this.isPlayd){
            this.play();
        }
    }

    autoPlay() {
        this.audio.addEventListener('ended', (e) => {
            console.log('end')
            this.nextSong();
        })
    }
    get volume(){
        return this.audio.volume;
    }
    set volume(v){
        this.audio.volume = v;
    }
    get currentDuraction(){
        return this.audio.currentTime;
    }

    set currentDuraction(time){
        this.audio.currentTime = time;
    }
    
    get currentSongNumber(){
        return this.currentSong;
    }

    set currentSongNumber(num){
        this.currentSong = num;
    }
}



export default AudioTag;