import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { CurrentPlayerClubsQuery } from '@/graphql/gql.generated';
import { consigliereLogo } from '@/shared/constants/avatars';

import { ClubSuggestionsModalComponent } from './club-suggestions-modal/club-suggestions-modal.component';

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
  styleUrls: ['./preparation-modal.component.scss'],
})
export class PreparationModalComponent implements OnInit {
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

  get title() {
    return this.openTableForm.get('title');
  }

  get date() {
    return this.openTableForm.get('date');
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  async presentClubSuggestionsModal() {
    const modal = await this.modalController.create({
      component: ClubSuggestionsModalComponent,
      swipeToClose: true,
    });

    await modal.present();

    const { data: { club }, role } = await modal.onWillDismiss();

    if (role === 'choose') {
      this.club = club;
    }
  }

  openTable() {
    const data = {
      title: this.title.value,
      date: this.date.value,
      club: this.club?.id,
    };

    this.modalController.dismiss(data, 'start');
  }

  close() {
    this.modalController.dismiss(undefined, 'cancel');
  }

  changeDate(event: { detail: { value: string } }) {
    const { detail: { value } } = event;

    this.date.setValue(value);
  }

  submitOnEnterKey({ key }: KeyboardEvent) {
    if (key !== 'Enter') return;

    this.openTable();
  }
}
