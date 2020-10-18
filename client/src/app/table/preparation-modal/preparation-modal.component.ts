import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { CurrentPlayerClubsQuery } from '@/graphql/gql.generated';
import { consigliereLogo } from '@/shared/constants/avatars';

import { ClubSuggestionsModalComponent } from './club-suggestions-modal/club-suggestions-modal.component';

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
  styleUrls: ['./preparation-modal.component.scss'],
})
export class PreparationModalComponent {
  openTableForm: FormGroup = this.formBuilder.group({
    title: [
      'Стол 1, Игра 1',
      [
        Validators.required,
        Validators.maxLength(24),
        Validators.minLength(2),
      ],
    ],
    date: [
      new Date().toISOString(),
      [Validators.required],
    ],
  });
  club?: CurrentPlayerClubsQuery['currentPlayerClubs'][0];

  consigliereLogo = consigliereLogo;

  get title(): AbstractControl | null {
    return this.openTableForm.get('title');
  }

  get date(): AbstractControl | null {
    return this.openTableForm.get('date');
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) { }

  async presentClubSuggestionsModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: ClubSuggestionsModalComponent,
      swipeToClose: true,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss<{ club: CurrentPlayerClubsQuery['currentPlayerClubs'][0] }>();

    if (role === 'choose') {
      this.club = data?.club;
    }
  }

  openTable(): void {
    if (!this.title || !this.date) throw new Error('Title or date input is missing');

    const data = {
      title: this.title.value,
      date: this.date.value,
      club: this.club?.id,
    };

    this.modalController.dismiss(data, 'start');
  }

  close(): void {
    this.modalController.dismiss(undefined, 'cancel');
  }

  changeDate(event: { detail: { value: string } }): void {
    const { detail: { value } } = event;

    if (!this.date) throw new Error('Date input is missing');

    this.date.setValue(value);
  }

  submitOnEnterKey({ key }: KeyboardEvent): void {
    if (key !== 'Enter') return;

    this.openTable();
  }
}
