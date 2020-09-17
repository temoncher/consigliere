import { Component, OnInit } from '@angular/core';
import { LanguageCode } from '@shared/models/language.interface';
import { LanguageService } from '@shared/services/language.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
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
