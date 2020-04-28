export interface Language {
  text: string;
  code: LanguageCode;
  img: string;
}

export enum LanguageCode {
  ENGLISH = 'en',
  RUSSIAN = 'ru',
}
