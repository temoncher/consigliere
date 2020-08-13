import { Injectable } from '@angular/core';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';

import { GameState } from '@shared/store/game/game.state';
import { PlayersState } from '@shared/store/game/players/players.state';
import {
  SkipSpeech, AssignFall, KillPlayer, ResetPlayer,
} from '@shared/store/game/players/players.actions';
import { KickPlayer, ResetKickedPlayer } from '@shared/store/game/round/round.actions';
import { QuitPhase } from '@shared/models/quit-phase.interface';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { ResetPlayerTimer, SetPlayerTimer } from '@shared/store/game/round/current-day/current-day.actions';
import { Role } from '@shared/models/role.enum';
import { EndGame } from '@shared/store/game/game.actions';
import { GameResult } from '@shared/models/table/game-result.enum';
import { Navigate } from '@ngxs/router-plugin';
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
    const rounds = this.store.selectSnapshot(GameState.getRounds);
    const currentStage = this.store.selectSnapshot(GameState.getCurrentGameStage);

    const quitPhase: QuitPhase = {
      stage: currentStage.roundPhase,
      number: rounds.length,
    };

    return quitPhase;
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
      const currentDayNumber = this.store.selectSnapshot(GameState.getRoundNumber);
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

  stopSpeech(playerId: string) {
    const playerTimer = this.timersService.getPlayerTimer(playerId);

    playerTimer.endSpeech();
    const timeLeft = playerTimer.time;

    this.store.dispatch(new SetPlayerTimer(playerId, timeLeft));
  }

  private checkGameEndingConditions() {
    const alivePlayers = this.store.selectSnapshot(PlayersState.getAlivePlayers);
    const mafiaPlayers = this.store.selectSnapshot(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON]));
    const qutiPhases = this.store.selectSnapshot(PlayersState.getQuitPhases);
    const aliveMafia = mafiaPlayers.filter(({ user: { id } }) => !qutiPhases.has(id));
    let gameResult: GameResult;

    if (aliveMafia.length >= alivePlayers.length / 2) {
      gameResult = GameResult.MAFIA;
    }

    if (!aliveMafia.length) {
      gameResult = GameResult.CIVILIANS;
    }

    if (gameResult) {
      this.store.dispatch([
        new EndGame(GameResult.MAFIA),
        new Navigate(['tabs', 'table', 'game', 'result']),
      ]);
    }
  }
}
