import { Component } from '@angular/core';

import { LanguageCode, ILanguage } from '@/shared/models/language.interface';
import { LanguageService } from '@/shared/services/language.service';

@Component({
  selector: 'app-settings-menu',
  template: `
    <ion-list>
      <ion-item
        *ngFor="let language of supportedLanguages"
        button
        lines="none"
        (click)="switchLanguage(language.code)"
      >
        {{ language.text }}
      </ion-item>
    </ion-list>
  `,
})
export class SettingsMenuComponent {
  supportedLanguages: ILanguage[] = [];

  constructor(private languageService: LanguageService) {
    this.supportedLanguages = this.languageService.supportedLanguages;
  }

  switchLanguage(code: LanguageCode): void {
    this.languageService.setLanguage(code);
  }
}
