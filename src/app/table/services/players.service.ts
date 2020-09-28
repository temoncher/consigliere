import { Injectable } from '@angular/core';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';

import { QuitPhase } from '@/shared/models/quit-phase.interface';
import { Role } from '@/shared/models/role.enum';

import { RoundPhase } from '../models/day-phase.enum';
import { GameResult } from '../models/game-result.enum';
import { ResetPlayer, KillPlayer, AssignFall, SkipSpeech } from '../store/players/players.actions';
import { PlayersState } from '../store/players/players.state';
import { ResetPlayerTimer, SetPlayerTimer } from '../store/round/current-day/current-day.actions';
import { ResetKickedPlayer, KickPlayer } from '../store/round/round.actions';
import { EndGame } from '../store/table.actions';
import { TableState } from '../store/table.state';

import { TimersService } from './timers.service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  constructor(
    private store: Store,
    private timersService: TimersService,
    private actions$: Actions,
  ) {
    this.catchFallAssignment();
    this.catchPlayerMurder();
    this.catchPlayerReset();
  }

  getQuitPhase() {
    const rounds = this.store.selectSnapshot(TableState.getRounds);
    const currentStage = this.store.selectSnapshot(TableState.getCurrentGameStage);

    const quitPhase: QuitPhase = {
      stage: currentStage.roundPhase,
      number: rounds.length,
    };

    return quitPhase;
  }

  stopSpeech(playerId: string) {
    const playerTimer = this.timersService.getPlayerTimer(playerId);

    playerTimer.endSpeech();
    const timeLeft = playerTimer.time;

    this.store.dispatch(new SetPlayerTimer(playerId, timeLeft));
  }

  private catchPlayerReset() {
    this.actions$.pipe(
      ofActionSuccessful(ResetPlayer),
    ).subscribe(({ playerId }: ResetPlayer) => {
      this.store.dispatch([
        new ResetPlayerTimer(playerId),
        new ResetKickedPlayer(playerId),
      ]);
    });
  }

  private catchPlayerMurder() {
    this.actions$.pipe(
      ofActionSuccessful(KillPlayer),
    ).subscribe(({ playerId, quitPhase }: KillPlayer) => {
      if (quitPhase.stage === RoundPhase.DAY) {
        this.stopSpeech(playerId);
      }

      this.checkGameEndingConditions();
    });
  }

  private catchFallAssignment() {
    this.actions$.pipe(
      ofActionSuccessful(AssignFall),
    ).subscribe(({ playerId }: AssignFall) => {
      const currentDayNumber = this.store.selectSnapshot(TableState.getRoundNumber);
      const fallsNumber = this.store.selectSnapshot(PlayersState.getPlayerFalls(playerId));
      const playerTimer = this.timersService.getPlayerTimer(playerId);

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

  private checkGameEndingConditions() {
    const alivePlayers = this.store.selectSnapshot(PlayersState.getAlivePlayers);
    const mafiaPlayers = this.store.selectSnapshot(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON]));
    const qutiPhases = this.store.selectSnapshot(PlayersState.getQuitPhases);
    const aliveMafia = mafiaPlayers.filter(({ user: { uid: id } }) => !qutiPhases.has(id));
    let gameResult: GameResult;

    if (aliveMafia.length >= alivePlayers.length / 2) {
      gameResult = GameResult.MAFIA;
    }

    if (!aliveMafia.length) {
      gameResult = GameResult.CIVILIANS;
    }

    if (gameResult) {
      this.store.dispatch(new EndGame(gameResult));
    }
  }
}
