import './sources.css';
import { SourcesObj } from '../../interfaces/interfaces';

class Sources {
    public draw(data: Required<SourcesObj[]>): void {
        const sources = <HTMLElement>document.querySelector('.sources');
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = <HTMLTemplateElement>document.querySelector('#sourceItemTemp');

        data.forEach((item: SourcesObj) => {
            const sourceClone = <HTMLElement>sourceItemTemp.content.cloneNode(true);
            (sourceClone.querySelector('.source__item-name') as Element).textContent = item.name;
            (sourceClone.querySelector('.source__item') as HTMLElement).setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        sources.innerHTML = '';
        sources.append(fragment);

        sources.children.item(0)?.dispatchEvent(
            new Event('click', {
                bubbles: true,
            })
        );
        this.search(data);
    }

    private search(data: Readonly<SourcesObj[]>): void {
        const searchSources = <HTMLInputElement>document.getElementById('searchSources');

        searchSources.addEventListener('input', (): void => {
            const value: string = searchSources.value;
            const regExp = new RegExp(`${value}`, 'i');

            data.forEach((item: SourcesObj) => {
                const sourceElem = <HTMLDivElement>document.querySelector(`.source__item[data-source-id="${item.id}"]`);

                if (regExp.test(item.name)) sourceElem.classList.remove('source__item-hide');
                else sourceElem.classList.add('source__item-hide');
            });
        });
    }
}

export default Sources;
