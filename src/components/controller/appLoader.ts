import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://newsapi.org/v2/', {
            apiKey: '510ff2e974f3433bbeb1ff520261ad65', // получите свой ключ https://newsapi.org/
        });
    }
}

export default AppLoader;
