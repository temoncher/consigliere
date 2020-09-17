import { Component, OnInit } from '@angular/core';
import { LanguageCode } from '@shared/models/language.interface';
import { LanguageService } from '@shared/services/language.service';

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
export class SettingsMenuComponent implements OnInit {
  supportedLanguages = [];

  constructor(private languageService: LanguageService) {
    this.supportedLanguages = this.languageService.supportedLanguages;
  }

  ngOnInit() { }

  switchLanguage(code: LanguageCode) {
    this.languageService.setLanguage(code);
  }
}
