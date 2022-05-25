import './news.css';
import { NewsInfoObject } from '../../interfaces/interfaces';

class News {
    public draw(data: Readonly<NewsInfoObject[]>): void {
        enum State {
            Start = 'start',
            Play = 'play',
            Pause = 'pause',
        }

        const synth = window.speechSynthesis;
        const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

        const fragment = document.createDocumentFragment();
        const newsBlock = <HTMLElement>document.querySelector('.news');
        const newsItemTemp = <HTMLTemplateElement>document.querySelector('#newsItemTemp');
        const newsTitle = <HTMLElement>document.querySelector('.news-sect__title');

        news.forEach((item: NewsInfoObject, idx: number): void => {
            const newsClone = <HTMLElement>newsItemTemp.content.cloneNode(true);
            let state: State = State.Start;

            if (idx % 2) (newsClone.querySelector('.news__item') as HTMLElement).classList.add('alt');

            (newsClone.querySelector('.news__meta-photo') as HTMLElement).style.backgroundImage = `url(${
                item.urlToImage || 'img/news_placeholder.jpg'
            })`;

            (newsClone.querySelector('.news__meta-author') as HTMLElement).textContent =
                item.author || item.source.name;
            (newsClone.querySelector('.news__meta-date') as HTMLElement).textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            (newsClone.querySelector('.news__description-title') as HTMLElement).textContent = item.title;
            (newsClone.querySelector('.news__description-source') as HTMLElement).textContent = item.source.name;
            (newsClone.querySelector('.news__description-content') as HTMLElement).textContent = item.description;
            (newsClone.querySelector('.news__read-more a') as HTMLElement).setAttribute('href', item.url);

            (newsClone.querySelector('.news__description-button') as HTMLButtonElement).addEventListener(
                'click',
                (e: MouseEvent): void => {
                    const target = <HTMLElement>e.target;
                    const button = <HTMLElement>(target.tagName == 'svg' ? target.parentElement : target);

                    synth.cancel();
                    document.querySelectorAll('.news__description-button').forEach((el: Element) => {
                        if (el.classList.contains('news__description-button-active'))
                            el.classList.remove('news__description-button-active');
                    });

                    const message = new SpeechSynthesisUtterance();
                    message.lang = 'en-EN';
                    message.pitch = 1;
                    message.text = `${item.title}. ${item.source.name}. ${item.description}`;

                    if (state === 'play') {
                        synth.pause();
                        state = State.Pause;
                    } else if (state === 'pause' || state === 'start') {
                        button.classList.add('news__description-button-active');
                        synth.resume();
                        synth.speak(message);
                        state = State.Play;
                    }
                }
            );

            fragment.append(newsClone);
        });

        newsBlock.innerHTML = '';
        newsBlock.appendChild(fragment);

        newsTitle.textContent = data[0]?.source.name || '';
        this.moveToNews();
    }

    private moveToNews(): void {
        const newsblock = <HTMLElement>document.querySelector('body > main > section.news-sect');
        window.scrollTo(0, newsblock.offsetTop);
    }
}

export default News;
