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
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};



export type Player = {
  __typename?: 'Player';
  uid: Scalars['ID'];
  nickname: Scalars['String'];
  number?: Maybe<Scalars['Int']>;
  isGuest: Scalars['Boolean'];
};

export type Round = {
  __typename?: 'Round';
  /** Kicked player id */
  kickedPlayers?: Maybe<Array<Scalars['ID']>>;
  /** Mafia shots, Record<string, string>; // { [mafiaId]: playerId } */
  shots?: Maybe<Scalars['JSONObject']>;
  murderedPlayer?: Maybe<Scalars['ID']>;
  donCheck?: Maybe<Scalars['ID']>;
  sheriffCheck?: Maybe<Scalars['ID']>;
  /** Players' timers, Record<string, number>; // { [playerId]: timeElapsed } */
  timers?: Maybe<Scalars['JSONObject']>;
  /** Proposed players, Record<string, string>; // { [candidateId]: playerId } */
  proposedPlayers?: Maybe<Scalars['JSONObject']>;
  isVoteDisabled?: Maybe<Scalars['Boolean']>;
  /** Votes, Record<string, string[]>; // { [candidatePlayerId]: votePlayerId[] } */
  votes?: Maybe<Scalars['JSONObject']>;
  /** Votes, Record<string, boolean>; // { [playerId]: isAgreed } */
  eliminateAllVote?: Maybe<Scalars['JSONObject']>;
  voteResult: VoteResult;
};


export enum VoteResult {
  NoCandidates = 'NO_CANDIDATES',
  SingleCandidateAndZeroDay = 'SINGLE_CANDIDATE_AND_ZERO_DAY',
  VoteIsDisabled = 'VOTE_IS_DISABLED',
  PlayersEliminated = 'PLAYERS_ELIMINATED',
  PlayersKeptAlive = 'PLAYERS_KEPT_ALIVE'
}

export type Game = {
  __typename?: 'Game';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  id: Scalars['ID'];
  participants: Array<Scalars['ID']>;
  creatorId: Scalars['ID'];
  rounds: Array<Round>;
  result: Scalars['String'];
  players: Array<Player>;
  roles: Scalars['JSONObject'];
  host: Player;
  falls?: Maybe<Scalars['JSONObject']>;
  quitPhases: Scalars['JSONObject'];
  speechSkips?: Maybe<Scalars['JSONObject']>;
};


export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  uid: Scalars['ID'];
  nickname: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  game: Game;
  lastGames: Array<Game>;
  user: User;
  users: Array<User>;
};


export type QueryGameArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryLastGamesArgs = {
  playerId: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
};


export type QueryUsersArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
  nicknames?: Maybe<Array<Scalars['String']>>;
};

export type ProfilePageQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ProfilePageQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'uid' | 'nickname' | 'avatar'>
  ), lastGames: Array<(
    { __typename?: 'Game' }
    & Pick<Game, 'createdAt' | 'id' | 'result' | 'roles'>
  )> }
);

export const ProfilePageDocument = gql`
    query profilePage($id: String!) {
  user(id: $id) {
    uid
    nickname
    avatar
  }
  lastGames(playerId: $id) {
    createdAt
    id
    result
    roles
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