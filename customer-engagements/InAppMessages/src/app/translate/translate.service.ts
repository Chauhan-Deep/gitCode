import { Injectable, Inject } from '@angular/core';
import { TRANSLATIONS } from './translations';

@Injectable()
export class TranslateService {
    private _currentLanguage: string;

    constructor(@Inject(TRANSLATIONS) private translations: any) {
    }

    public use(language: string): void {
        this._currentLanguage = language;
    }

    get currentLanguage(): string {
        return this._currentLanguage;
    }

    private translate(key: string): string {
        const translation = key;

        if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
            return this.translations[this.currentLanguage][key];
        }

        // Fallback to 'en-US' for string not found in other language.
        const fallbackLanguage = 'en-US';
        return this.translations[fallbackLanguage][key] ? this.translations[fallbackLanguage][key] : translation;
    }

    public localize(key: string) {
        return this.translate(key);
    }
}
