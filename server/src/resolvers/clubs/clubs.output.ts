import { ObjectType, Field, ID } from '@nestjs/graphql';

import { IClub } from '@/interfaces/club.interface';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';

import { ClubRole } from '~types/enums/club-role.enum';

@ObjectType()
export class ClubOutput extends DocumentMeta implements IClub, IDocumentMeta {
  @Field(() => ID)
  id: string;
  @Field(() => ID)
  admin: string;
  @Field({ nullable: true })
  avatar?: string;
  @Field()
  title: string;
  @Field(() => [ID])
  confidants: string[];
  @Field(() => [ID])
  members: string[];
}

@ObjectType()
export class CurrentPlayerClubsOutput extends ClubOutput {
  @Field(() => ClubRole)
  role: ClubRole;
}
