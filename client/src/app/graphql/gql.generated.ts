import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Firebase timestamp */
  FirebaseTimestamp: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};



export type ClubSearchOutput = {
  __typename?: 'ClubSearchOutput';
  createdBy: Scalars['ID'];
  updatedBy: Scalars['ID'];
  createdAt: Scalars['FirebaseTimestamp'];
  updatedAt: Scalars['FirebaseTimestamp'];
  id: Scalars['ID'];
  admin: Scalars['ID'];
  avatar?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  public: Scalars['Boolean'];
  confidants: Array<Scalars['ID']>;
  members: Array<Scalars['ID']>;
};


export type ClubOutput = {
  __typename?: 'ClubOutput';
  createdBy: Scalars['ID'];
  updatedBy: Scalars['ID'];
  createdAt: Scalars['FirebaseTimestamp'];
  updatedAt: Scalars['FirebaseTimestamp'];
  id: Scalars['ID'];
  admin: Scalars['ID'];
  avatar?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  public: Scalars['Boolean'];
  confidants: Array<Scalars['ID']>;
  members: Array<Scalars['ID']>;
  role?: Maybe<ClubRole>;
};

export enum ClubRole {
  Admin = 'ADMIN',
  Confidant = 'CONFIDANT',
  Member = 'MEMBER'
}

export type PlayerOutput = {
  __typename?: 'PlayerOutput';
  uid: Scalars['ID'];
  nickname: Scalars['String'];
  number?: Maybe<Scalars['Int']>;
  isGuest: Scalars['Boolean'];
};

export type GameOutput = {
  __typename?: 'GameOutput';
  createdBy: Scalars['ID'];
  updatedBy: Scalars['ID'];
  createdAt: Scalars['FirebaseTimestamp'];
  updatedAt: Scalars['FirebaseTimestamp'];
  id: Scalars['ID'];
  club?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  date: Scalars['FirebaseTimestamp'];
  won?: Maybe<Scalars['Boolean']>;
  host: PlayerOutput;
  triple: Array<Scalars['String']>;
  result: GameResult;
  players: Array<PlayerOutput>;
  falls?: Maybe<Scalars['JSONObject']>;
  quitPhases: Scalars['JSONObject'];
  /** Record<string, number[]>[]; <candidatePlayerId, votesNumber>[] */
  votes?: Maybe<Array<Scalars['JSONObject']>>;
  roles: Scalars['JSONObject'];
  donChecks?: Maybe<Array<Scalars['String']>>;
  sheriffChecks?: Maybe<Array<Scalars['String']>>;
};

export enum GameResult {
  Mafia = 'MAFIA',
  Civilians = 'CIVILIANS',
  Tie = 'TIE'
}


export type JoinRequestOutput = {
  __typename?: 'JoinRequestOutput';
  createdBy: Scalars['ID'];
  updatedBy: Scalars['ID'];
  createdAt: Scalars['FirebaseTimestamp'];
  updatedAt: Scalars['FirebaseTimestamp'];
  id: Scalars['ID'];
  clubId: Scalars['ID'];
  playerId: Scalars['ID'];
  status: InvitationStatus;
};

export enum InvitationStatus {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED'
}

export type UserOutput = {
  __typename?: 'UserOutput';
  createdBy: Scalars['ID'];
  updatedBy: Scalars['ID'];
  createdAt: Scalars['FirebaseTimestamp'];
  updatedAt: Scalars['FirebaseTimestamp'];
  uid: Scalars['ID'];
  nickname: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  club: ClubOutput;
  currentPlayerClubs: Array<ClubOutput>;
  searchClubs: Array<ClubSearchOutput>;
  lastGamesByUserId: Array<GameOutput>;
  clubJoinRequests: Array<JoinRequestOutput>;
  user: UserOutput;
  users: Array<UserOutput>;
  usersByClub: Array<UserOutput>;
};


export type QueryClubArgs = {
  id: Scalars['String'];
};


export type QuerySearchClubsArgs = {
  query: Scalars['String'];
  limit?: Maybe<Scalars['Float']>;
};


export type QueryLastGamesByUserIdArgs = {
  userId: Scalars['String'];
};


export type QueryClubJoinRequestsArgs = {
  joinRequest: JoinRequest;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
};


export type QueryUsersArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
  nicknames?: Maybe<Array<Scalars['String']>>;
};


export type QueryUsersByClubArgs = {
  clubId: Scalars['String'];
};

export type JoinRequest = {
  clubId: Scalars['ID'];
  statuses?: Maybe<Array<InvitationStatus>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createClub: ClubOutput;
  leaveClub: Scalars['ID'];
  joinPublicClub: Scalars['ID'];
  resign: ClubOutput;
  deleteClub: ClubOutput;
  createGame: Scalars['ID'];
  createJoinRequest: JoinRequestOutput;
  revokeJoinRequest: JoinRequestOutput;
};


export type MutationCreateClubArgs = {
  club: Club;
};


export type MutationLeaveClubArgs = {
  clubId: Scalars['String'];
};


export type MutationJoinPublicClubArgs = {
  clubId: Scalars['String'];
};


export type MutationResignArgs = {
  successorId: Scalars['String'];
  clubId: Scalars['String'];
};


export type MutationDeleteClubArgs = {
  clubId: Scalars['String'];
};


export type MutationCreateGameArgs = {
  game: Game;
};


export type MutationCreateJoinRequestArgs = {
  clubId: Scalars['String'];
};


export type MutationRevokeJoinRequestArgs = {
  id: Scalars['String'];
};

export type Club = {
  title: Scalars['String'];
  location?: Maybe<Scalars['String']>;
};

export type Game = {
  club?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  date: Scalars['FirebaseTimestamp'];
  host: PlayerInput;
  triple: Array<Scalars['String']>;
  result: GameResult;
  players: Array<PlayerInput>;
  falls: Scalars['JSONObject'];
  quitPhases: Scalars['JSONObject'];
  votes: Scalars['JSONObject'];
  roles: Scalars['JSONObject'];
  donChecks: Array<Scalars['String']>;
  sheriffChecks: Array<Scalars['String']>;
};

export type PlayerInput = {
  uid: Scalars['ID'];
  nickname: Scalars['String'];
  number?: Maybe<Scalars['Int']>;
  isGuest: Scalars['Boolean'];
};

export type CreateClubMutationVariables = Exact<{
  club: Club;
}>;


export type CreateClubMutation = (
  { __typename?: 'Mutation' }
  & { createClub: (
    { __typename?: 'ClubOutput' }
    & Pick<ClubOutput, 'id' | 'avatar' | 'title' | 'role' | 'location'>
  ) }
);

export type CreateGameMutationVariables = Exact<{
  game: Game;
}>;


export type CreateGameMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createGame'>
);

export type DeleteClubMutationVariables = Exact<{
  clubId: Scalars['String'];
}>;


export type DeleteClubMutation = (
  { __typename?: 'Mutation' }
  & { deleteClub: (
    { __typename?: 'ClubOutput' }
    & Pick<ClubOutput, 'id'>
  ) }
);

export type JoinPublicClubMutationVariables = Exact<{
  clubId: Scalars['String'];
}>;


export type JoinPublicClubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'joinPublicClub'>
);

export type LeaveClubMutationVariables = Exact<{
  clubId: Scalars['String'];
}>;


export type LeaveClubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'leaveClub'>
);

export type ClubAdminPageQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ClubAdminPageQuery = (
  { __typename?: 'Query' }
  & { club: (
    { __typename?: 'ClubOutput' }
    & Pick<ClubOutput, 'id' | 'title' | 'location' | 'avatar' | 'admin' | 'role' | 'members'>
  ) }
);

export type ClubDetailsPageQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ClubDetailsPageQuery = (
  { __typename?: 'Query' }
  & { club: (
    { __typename?: 'ClubOutput' }
    & Pick<ClubOutput, 'id' | 'title' | 'location' | 'avatar' | 'admin' | 'role' | 'members'>
  ) }
);

export type CurrentPlayerClubsQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentPlayerClubsQuery = (
  { __typename?: 'Query' }
  & { currentPlayerClubs: Array<(
    { __typename?: 'ClubOutput' }
    & Pick<ClubOutput, 'id' | 'avatar' | 'title' | 'role' | 'location'>
  )> }
);

export type PlayerSuggestionsQueryVariables = Exact<{
  clubId: Scalars['String'];
}>;


export type PlayerSuggestionsQuery = (
  { __typename?: 'Query' }
  & { usersByClub: Array<(
    { __typename?: 'UserOutput' }
    & Pick<UserOutput, 'uid' | 'nickname' | 'avatar'>
  )> }
);

export type ProfilePageQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ProfilePageQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'UserOutput' }
    & Pick<UserOutput, 'uid' | 'nickname' | 'avatar'>
  ), lastGamesByUserId: Array<(
    { __typename?: 'GameOutput' }
    & Pick<GameOutput, 'createdAt' | 'id' | 'result' | 'roles' | 'won'>
  )> }
);

export type SearchClubsQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchClubsQuery = (
  { __typename?: 'Query' }
  & { searchClubs: Array<(
    { __typename?: 'ClubSearchOutput' }
    & Pick<ClubSearchOutput, 'id' | 'title' | 'avatar' | 'location'>
  )> }
);

export const CreateClubDocument = gql`
    mutation createClub($club: club!) {
  createClub(club: $club) {
    id
    avatar
    title
    role
    location
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateClubGQL extends Apollo.Mutation<CreateClubMutation, CreateClubMutationVariables> {
    document = CreateClubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateGameDocument = gql`
    mutation createGame($game: game!) {
  createGame(game: $game)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateGameGQL extends Apollo.Mutation<CreateGameMutation, CreateGameMutationVariables> {
    document = CreateGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteClubDocument = gql`
    mutation deleteClub($clubId: String!) {
  deleteClub(clubId: $clubId) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteClubGQL extends Apollo.Mutation<DeleteClubMutation, DeleteClubMutationVariables> {
    document = DeleteClubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JoinPublicClubDocument = gql`
    mutation joinPublicClub($clubId: String!) {
  joinPublicClub(clubId: $clubId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JoinPublicClubGQL extends Apollo.Mutation<JoinPublicClubMutation, JoinPublicClubMutationVariables> {
    document = JoinPublicClubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LeaveClubDocument = gql`
    mutation leaveClub($clubId: String!) {
  leaveClub(clubId: $clubId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LeaveClubGQL extends Apollo.Mutation<LeaveClubMutation, LeaveClubMutationVariables> {
    document = LeaveClubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ClubAdminPageDocument = gql`
    query clubAdminPage($id: String!) {
  club(id: $id) {
    id
    title
    location
    avatar
    admin
    role
    members
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClubAdminPageGQL extends Apollo.Query<ClubAdminPageQuery, ClubAdminPageQueryVariables> {
    document = ClubAdminPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ClubDetailsPageDocument = gql`
    query clubDetailsPage($id: String!) {
  club(id: $id) {
    id
    title
    location
    avatar
    admin
    role
    members
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClubDetailsPageGQL extends Apollo.Query<ClubDetailsPageQuery, ClubDetailsPageQueryVariables> {
    document = ClubDetailsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CurrentPlayerClubsDocument = gql`
    query currentPlayerClubs {
  currentPlayerClubs {
    id
    avatar
    title
    role
    location
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CurrentPlayerClubsGQL extends Apollo.Query<CurrentPlayerClubsQuery, CurrentPlayerClubsQueryVariables> {
    document = CurrentPlayerClubsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PlayerSuggestionsDocument = gql`
    query playerSuggestions($clubId: String!) {
  usersByClub(clubId: $clubId) {
    uid
    nickname
    avatar
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PlayerSuggestionsGQL extends Apollo.Query<PlayerSuggestionsQuery, PlayerSuggestionsQueryVariables> {
    document = PlayerSuggestionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ProfilePageDocument = gql`
    query profilePage($id: String!) {
  user(id: $id) {
    uid
    nickname
    avatar
  }
  lastGamesByUserId(userId: $id) {
    createdAt
    id
    result
    roles
    won
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ProfilePageGQL extends Apollo.Query<ProfilePageQuery, ProfilePageQueryVariables> {
    document = ProfilePageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SearchClubsDocument = gql`
    query searchClubs($query: String!) {
  searchClubs(query: $query) {
    id
    title
    avatar
    location
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchClubsGQL extends Apollo.Query<SearchClubsQuery, SearchClubsQueryVariables> {
    document = SearchClubsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }