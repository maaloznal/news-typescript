enum ResponseStatus {
    OK = 'ok',
    ERROR = 'error',
}

interface INews {
    title: string;
    author: string;
    description: string;
    urlToImage: string | null;
    source: ISource;
}

interface ISource {
    id: string;
    name: string;
}

interface INewsResponse {
    status: ResponseStatus;
    totalResults: number;
    articles: INews[];
}

const apiUrl: string | undefined = process.env.API_URL;
const apiKey: string | undefined = process.env.API_KEY;

class NewsService {
    private newsContainer: HTMLDivElement | null;

    constructor() {
        this.newsContainer = document.querySelector('.news');
    }

    public async fetchNews(): Promise<void> {
        try {
            const url = `${apiUrl}everything?q=apple&from=2024-11-27&to=2024-11-27&sortBy=popularity&apiKey=${apiKey}`;
            console.log('Получение данных с:', url);
            const response: Response = await fetch(url);
            console.log('Статус ответа:', response.status);
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.statusText}`);
            }
            const obj: INewsResponse = await response.json();
            console.log('Данные ответа:', obj);
            this.renderNews(obj.articles);
        } catch (error) {
            console.error('Произошла ошибка при получении данных:', error);
        }
    }

    private renderNews(newsArr: INews[]): void {
        if (!newsArr || newsArr.length === 0) {
            console.error('Нет новостей для отображения');
            return;
        }

        newsArr.forEach((newItem: INews) => {
            if (!newItem.urlToImage) {
                console.warn('Пропуск статьи без изображения:', newItem.title);
                return;
            }

            const listItem: HTMLDivElement = document.createElement('div');
            listItem.className = 'news_item';
            this.newsContainer?.appendChild(listItem);

            const imgItem: HTMLImageElement = document.createElement('img');
            imgItem.src = newItem.urlToImage;
            listItem.appendChild(imgItem);

            const titleItem: HTMLHeadingElement = document.createElement('h2');
            titleItem.innerHTML = newItem.title;
            listItem.appendChild(titleItem);

            const descriptionItem: HTMLParagraphElement = document.createElement('p');
            descriptionItem.innerHTML = newItem.description;
            listItem.appendChild(descriptionItem);

            const authorItem = document.createElement('h3');
            authorItem.innerHTML = newItem.author;
            listItem.appendChild(authorItem);
        });
    }
}

const newsService = new NewsService();
newsService.fetchNews();
