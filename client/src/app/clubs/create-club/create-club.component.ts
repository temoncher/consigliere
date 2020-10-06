import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ClubRole, ClubsPageDocument, CreateClubGQL, CreateClubMutationVariables } from '@/graphql/gql.generated';

@Component({
  selector: 'app-create-club',
  templateUrl: './create-club.component.html',
  styleUrls: ['./create-club.component.scss'],
})
export class CreateClubComponent implements OnInit {
  clubForm: FormGroup = this.formBuilder.group({
    title: [
      '',
      [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.pattern(/^[а-яА-Яa-zA-Z0-9\s-]*/),
      ],
    ],
    location: [
      '',
      [
        Validators.maxLength(20),
        Validators.minLength(3),
      ],
    ],
  });

  startingTitle = 'Новый клуб!';
  errorMessage = '';

  get formTitle() {
    return this.errorMessage || this.startingTitle;
  }

  get title() {
    return this.clubForm.get('title');
  }

  get location() {
    return this.clubForm.get('location');
  }

  constructor(
    private formBuilder: FormBuilder,
    private createClubGQL: CreateClubGQL,
  ) { }

  ngOnInit() { }

  create() {
    const location = this.location.value.trim();
    const title = this.title.value.trim();
    const club: CreateClubMutationVariables['club'] = {
      title,
    };

    if (location) {
      club.location = location;
    }

    this.createClubGQL.mutate(
      { club },
      {
        refetchQueries: [{ query: ClubsPageDocument }],
      },
    ).subscribe();
  }

  submitOnEnterKey({ key }: KeyboardEvent) {
    if (key !== 'Enter') return;

    this.create();
  }
}
