import { ObjectType, Field, ID } from '@nestjs/graphql';

import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { IUser } from '@/interfaces/user.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';

@ObjectType()
export class UserOutput extends DocumentMeta implements IUser, IDocumentMeta {
  @Field(() => ID)
  uid: string;

  @Field()
  nickname: string;

  @Field({ nullable: true })
  avatar?: string;
}
