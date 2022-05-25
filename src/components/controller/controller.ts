import AppLoader from './appLoader';
import { Options, SourcesResp, NewsResp } from '../interfaces/interfaces';

class AppController extends AppLoader {
    public getSources(callback: (data: SourcesResp) => void) {
        const options: Options = {
            endpoint: 'sources',
        };
        super.getResp(options, callback);
    }

    public getNews(e: Event, callback: (data: NewsResp) => void) {
        let target = <HTMLElement>e.target;
        const newsContainer = <HTMLElement>e.currentTarget;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = <string>target.getAttribute('data-source-id');
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    const options: Options = {
                        endpoint: 'everything',
                        options: {
                            sources: sourceId,
                        },
                    };
                    super.getResp(options, callback);
                }
                return;
            }
            target = <HTMLElement>target.parentNode;
        }
    }
}

export default AppController;
