import { ObjectType, Field, ID } from '@nestjs/graphql';

import { IFireStoreClub } from '@/interfaces/club.interface';
import { IFireStoreDocumentMeta } from '@/interfaces/document-meta.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';

import { ClubRole } from '~types/enums/club-role.enum';

@ObjectType()
export class ClubSearchOutput extends DocumentMeta implements IFireStoreClub, IFireStoreDocumentMeta {
  @Field(() => ID)
  id: string;
  @Field(() => ID)
  admin: string;
  @Field({ nullable: true })
  avatar?: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  location?: string;
  @Field()
  public: boolean;
  @Field(() => [ID])
  confidants: string[];
  @Field(() => [ID])
  members: string[];
}

@ObjectType()
export class ClubOutput extends ClubSearchOutput {
  @Field(() => ClubRole, { nullable: true })
  role?: ClubRole;
}

