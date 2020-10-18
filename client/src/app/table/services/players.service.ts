import { Injectable } from '@angular/core';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';

import { GameResult } from '@/graphql/gql.generated';

import { ResetPlayer, KillPlayer, AssignFall, SkipSpeech } from '../store/players/players.actions';
import { PlayersState } from '../store/players/players.state';
import { ResetPlayerTimer, SetPlayerTimer } from '../store/round/current-day/current-day.actions';
import { ResetKickedPlayer, KickPlayer } from '../store/round/round.actions';
import { EndGame } from '../store/table.actions';
import { TableState } from '../store/table.state';

import { TimersService } from './timers.service';

import { Role } from '~types/enums/role.enum';
import { RoundPhase } from '~types/enums/round-phase.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  constructor(
    private store: Store,
    private timersService: TimersService,
    private actions$: Actions,
  ) {
    this.watchFallAssignment();
    this.watchPlayerMurder();
    this.watchPlayerReset();
  }

  getQuitPhase(): IQuitPhase {
    const rounds = this.store.selectSnapshot(TableState.getRounds);
    const currentStage = this.store.selectSnapshot(TableState.getCurrentGameStage);

    const quitPhase: IQuitPhase = {
      stage: currentStage.roundPhase,
      number: rounds.length,
    };

    return quitPhase;
  }

  stopSpeech(playerId: string): void {
    const playerTimer = this.timersService.getPlayerTimer(playerId);

    if (!playerTimer) throw new Error('Player timer not found');

    playerTimer.endSpeech();
    const timeElapsed = 60 - playerTimer.time;

    this.store.dispatch(new SetPlayerTimer(playerId, timeElapsed));
  }

  private watchPlayerReset(): void {
    this.actions$.pipe(
      ofActionSuccessful(ResetPlayer),
    ).subscribe(({ playerId }: ResetPlayer) => {
      this.store.dispatch([
        new ResetPlayerTimer(playerId),
        new ResetKickedPlayer(playerId),
      ]);
    });
  }

  private watchPlayerMurder(): void {
    this.actions$.pipe(
      ofActionSuccessful(KillPlayer),
    ).subscribe(({ playerId, quitPhase }: KillPlayer) => {
      if (quitPhase.stage === RoundPhase.DAY) {
        this.stopSpeech(playerId);
      }

      this.checkGameEndingConditions();
    });
  }

  private watchFallAssignment(): void {
    this.actions$.pipe(
      ofActionSuccessful(AssignFall),
    ).subscribe(({ playerId }: AssignFall) => {
      const currentDayNumber = this.store.selectSnapshot(TableState.getRoundNumber);
      const fallsNumber = this.store.selectSnapshot(PlayersState.getPlayerFalls(playerId));
      const playerTimer = this.timersService.getPlayerTimer(playerId);

      if (!playerTimer) throw new Error('Player timer not found');

      if (fallsNumber === 3) {
        this.store.dispatch(new SkipSpeech(playerId, playerTimer.isStarted ? currentDayNumber + 1 : currentDayNumber));

        if (!playerTimer.isStarted) {
          this.timersService.setTimer(playerId, 0);
        }

        return;
      }

      if (fallsNumber === 4) {
        this.store.dispatch(new KickPlayer(playerId));
      }
    });
  }

  private checkGameEndingConditions(): void {
    const alivePlayers = this.store.selectSnapshot(PlayersState.getAlivePlayers);
    const mafiaPlayers = this.store.selectSnapshot(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON]));
    const qutiPhases = this.store.selectSnapshot(PlayersState.getQuitPhases);
    const aliveMafia = mafiaPlayers.filter(({ uid }) => !qutiPhases[uid]);
    let gameResult: GameResult | undefined;

    if (aliveMafia.length >= alivePlayers.length / 2) {
      gameResult = GameResult.Mafia;
    }

    if (!aliveMafia.length) {
      gameResult = GameResult.Civilians;
    }

    if (gameResult) {
      this.store.dispatch(new EndGame(gameResult));
    }
  }
}
