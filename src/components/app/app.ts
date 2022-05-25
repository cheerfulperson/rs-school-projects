import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { SourcesResp, NewsResp } from '../interfaces/interfaces';

class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        document
            .querySelector('.sources')
            ?.addEventListener('click', (e: Event) =>
                this.controller.getNews(e, (data: NewsResp): void => this.view.drawNews(data))
            );

        this.controller.getSources((data: SourcesResp): void => this.view.drawSources(data));
    }
}

export default App;
