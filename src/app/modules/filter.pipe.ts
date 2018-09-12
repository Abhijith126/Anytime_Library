import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, filterText: boolean): any[] {
        if (!items) { return []; }
        if (!searchText) { return items; }
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            if (filterText === true) {
                return it.title.toLowerCase().includes(searchText);
            } else {
                return it.author.toLowerCase().includes(searchText);
            }
        });
    }
}
