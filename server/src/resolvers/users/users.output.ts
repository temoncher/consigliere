import { ObjectType, Field, ID } from '@nestjs/graphql';

import { IFireStoreDocumentMeta } from '@/interfaces/document-meta.interface';
import { IFireStoreUser } from '@/interfaces/user.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';

@ObjectType()
export class UserOutput extends DocumentMeta implements IFireStoreUser, IFireStoreDocumentMeta {
  @Field(() => ID)
  uid: string;

  @Field()
  nickname: string;

  @Field({ nullable: true })
  avatar?: string;
}
