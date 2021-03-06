import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

import {
  CurrentPlayerClubsDocument,
  CreateClubGQL,
  CreateClubMutation,
  CreateClubMutationVariables,
} from '@/graphql/gql.generated';

@Component({
  selector: 'app-create-club',
  templateUrl: './create-club.component.html',
  styleUrls: ['./create-club.component.scss'],
})
export class CreateClubComponent {
  @Output() create = new EventEmitter<CreateClubMutation['createClub']>();

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

  get formTitle(): string {
    return this.errorMessage || this.startingTitle;
  }

  get title(): AbstractControl | null {
    return this.clubForm.get('title');
  }

  get location(): AbstractControl | null {
    return this.clubForm.get('location');
  }

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private createClubGQL: CreateClubGQL,
  ) { }

  createClub(): void {
    if (!this.location || !this.title) throw new Error('Location or title inputs are missing');

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
        refetchQueries: [{ query: CurrentPlayerClubsDocument }],
      },
    ).subscribe(({ data }) => {
      this.create.emit(data?.createClub);

      this.store.dispatch(new Navigate(
        [data?.createClub.id],
        undefined,
        { relativeTo: this.activatedRoute },
      ));
    });
  }

  submitOnEnterKey({ key }: KeyboardEvent): void {
    if (key !== 'Enter') return;

    this.createClub();
  }
}
