import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { LanguageCode, Language } from '@shared/models/language.interface';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  DEFAULT_LANGUAGE = LanguageCode.RUSSIAN;
  selectedLanguageCode = '';
  supportedLanguages: Language[] = [
    { text: 'English', code: LanguageCode.ENGLISH, img: 'assets/imgs/en.png' },
    { text: 'Русский', code: LanguageCode.RUSSIAN, img: 'assets/imgs/ru.png' },
  ];

  constructor(
    private translate: TranslateService,
    private storage: Storage,
  ) { }

  async setInitialAppLanguage() {
    const browserLanguageCode = this.translate.getBrowserLang();

    if (this.supportedLanguages.find((supportedLanguage) => supportedLanguage.code === browserLanguageCode)) {
      this.translate.setDefaultLang(browserLanguageCode);
      this.selectedLanguageCode = browserLanguageCode;
    } else {
      this.translate.setDefaultLang(this.DEFAULT_LANGUAGE);
      this.selectedLanguageCode = this.DEFAULT_LANGUAGE;
    }

    const storedLanuageCode: LanguageCode = await this.storage.get(LNG_KEY);

    if (storedLanuageCode) {
      this.setLanguage(storedLanuageCode);
      this.selectedLanguageCode = storedLanuageCode;
    }
  }

  getLanguage() {
    return this.supportedLanguages.find((language) => language.code === this.selectedLanguageCode);
  }

  setLanguage(languageKey: LanguageCode) {
    this.translate.use(languageKey);
    this.selectedLanguageCode = languageKey;
    this.storage.set(LNG_KEY, languageKey);
  }
}
