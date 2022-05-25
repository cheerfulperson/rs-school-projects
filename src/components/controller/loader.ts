import { Options, UrlOptions, SourcesResp, NewsResp } from '../interfaces/interfaces';

function getError<Type>(data: Type): void {
    console.error('No callback for GET response. Data = ', data);
}

class Loader {
    constructor(private baseLink: string, private options: UrlOptions) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp(optionsObj: Options, callback: (data: SourcesResp | NewsResp) => void = getError): void {
        const { endpoint, options } = optionsObj;
        this.load('GET', endpoint, callback, options);
    }

    public errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    public makeUrl(options?: Partial<UrlOptions>, endpoint?: string): string {
        const urlOptions = <UrlOptions>{ ...this.options, ...options };
        let url = `${this.baseLink}${endpoint || ''}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key] || ''}&`;
        });

        return url.slice(0, -1);
    }

    public load(
        method: string,
        endpoint: string,
        callback: (data: SourcesResp | NewsResp) => void = getError,
        options?: UrlOptions
    ): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then((res: Response) => this.errorHandler(res))
            .then((res: Response) => res.json())
            .then((data: SourcesResp | NewsResp): void => callback(data))
            .catch((err: Error) => console.error(err));
    }
}

export default Loader;
