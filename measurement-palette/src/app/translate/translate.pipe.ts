import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
    name: 'translate',
    pure: false // impure pipe, update value when we change language
})

export class TranslatePipe implements PipeTransform {

    constructor(private translate: TranslateService) { }

    transform(value: string, args?: any[]): any {
        let translation = '';
        if (value) {
            translation = this.translate.localize(value);
        }
        return translation;
    }
}
