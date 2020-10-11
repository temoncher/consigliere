import { IClub } from '@/interfaces/club.interface';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { IGame } from '@/interfaces/game.interface';
import { IJoinRequest } from '@/interfaces/join-request.interface';
import { IUser } from '@/interfaces/user.interface';

export type GamesCollection = FirebaseFirestore.CollectionReference<IGame & IDocumentMeta>;
export type ClubsCollection = FirebaseFirestore.CollectionReference<IClub & IDocumentMeta>;
export type UsersCollection = FirebaseFirestore.CollectionReference<IUser & IDocumentMeta>;
export type JoinRequestsCollection = FirebaseFirestore.CollectionReference<IJoinRequest & IDocumentMeta>;
