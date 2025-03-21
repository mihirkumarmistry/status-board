import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchString: string): any[] {
    if (!items) return [];
    if (!searchString) return items;

    searchString = searchString.toLowerCase();

    return items.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchString)
      );
    });
  }
}
