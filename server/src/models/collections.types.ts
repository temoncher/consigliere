import { IFireStoreClub } from '@/interfaces/club.interface';
import { IFireStoreDocumentMeta } from '@/interfaces/document-meta.interface';
import { IFireStoreGame } from '@/interfaces/game.interface';
import { IFireStoreJoinRequest } from '@/interfaces/join-request.interface';
import { IFireStoreUser } from '@/interfaces/user.interface';

export type GamesCollection = FirebaseFirestore.CollectionReference<IFireStoreGame & IFireStoreDocumentMeta>;
export type ClubsCollection = FirebaseFirestore.CollectionReference<IFireStoreClub & IFireStoreDocumentMeta>;
export type UsersCollection = FirebaseFirestore.CollectionReference<IFireStoreUser & IFireStoreDocumentMeta>;
export type JoinRequestsCollection = FirebaseFirestore.CollectionReference<IFireStoreJoinRequest & IFireStoreDocumentMeta>;
