import { timer, Subscription } from 'rxjs';

export class Timer {
  private timeLeft: number;
  interval: Subscription = Subscription.EMPTY;
  isStarted = false;
  isSpeechEnded = false;
  isPaused = true;

  get time(): number {
    return Math.round(this.timeLeft / 1000);
  }

  constructor(partialTimer?: Partial<Timer>) {
    this.timeLeft = (partialTimer?.time || 60) * 1000;
    this.isSpeechEnded = partialTimer?.isSpeechEnded || false;
    this.isPaused = partialTimer?.isPaused === undefined || Boolean(partialTimer.isSpeechEnded);
  }

  switchTimer(): void {
    this.isStarted = true;

    if (this.isSpeechEnded) {
      return;
    }

    if (!this.isPaused) {
      this.pauseTimer();

      return;
    }

    this.isPaused = false;

    this.interval = timer(100, 100).subscribe(() => {
      if (this.timeLeft === 0) {
        this.pauseTimer();

        return;
      }

      this.timeLeft -= 100;
    });
  }

  pauseTimer(): void {
    this.isPaused = true;

    this.interval.unsubscribe();
  }

  resetTimer(time: number): void {
    this.isPaused = true;
    this.isSpeechEnded = false;
    this.timeLeft = time * 1000;

    this.interval.unsubscribe();
  }

  endSpeech(): void {
    this.isPaused = true;
    this.isSpeechEnded = true;

    this.interval.unsubscribe();
  }
}
