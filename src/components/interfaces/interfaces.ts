export type UrlOptions = {
    [key: string]: string | undefined;
    sources?: string;
    apiKey?: string;
};

export type Options = {
    endpoint: string;
    options?: UrlOptions;
};

export interface NewsInfoObject {
    source: {
        id: string;
        name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface SourcesObj {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

interface RequiredData {
    status: string;
    totalResults?: number | string;
    articles?: NewsInfoObject[];
    sources?: SourcesObj[];
}

export type SourcesResp = Pick<RequiredData, 'status' | 'totalResults' | 'sources'>;

export type NewsResp = Pick<RequiredData, 'status' | 'totalResults' | 'articles'>;
