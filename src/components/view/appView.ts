import News from './news/news';
import Sources from './sources/sources';
import { SourcesResp, NewsResp, NewsInfoObject, SourcesObj } from '../interfaces/interfaces';

export class AppView {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: NewsResp): void {
        const values: NewsInfoObject[] = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: SourcesResp): void {
        const values: SourcesObj[] = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
