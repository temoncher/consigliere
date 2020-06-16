import { timer, Subscription } from 'rxjs';

export class Timer {
    private timeLeft: number;
    interval: Subscription = Subscription.EMPTY;
    isStarted = false;
    isSpeechEnded = false;
    isPaused = true;

    get time() {
        return Math.round(this.timeLeft / 1000);
    }

    constructor(partialTimer?: Partial<Timer>) {
        this.timeLeft = (partialTimer?.time || 60) * 1000;
        this.isSpeechEnded = partialTimer?.isSpeechEnded || false;
        this.isPaused = typeof partialTimer?.isPaused === 'undefined' ? true : partialTimer.isSpeechEnded;
    }

    switchTimer() {
        this.isStarted = true;

        if (this.isSpeechEnded) {
            return;
        }

        if (!this.isPaused) {
            return this.pauseTimer();
        }

        this.isPaused = false;
        return this.interval = timer(100, 100).subscribe(() => {
            if (this.timeLeft === 0) {
                return this.pauseTimer();
            }

            this.timeLeft -= 100;
        });
    }

    pauseTimer() {
        this.isPaused = true;
        return this.interval.unsubscribe();
    }

    resetTimer(time: number) {
        this.isPaused = true;
        this.isSpeechEnded = false;
        this.timeLeft = time * 1000;
        return this.interval.unsubscribe();
    }

    endSpeech() {
        this.isPaused = true;
        this.isSpeechEnded = true;
        return this.interval.unsubscribe();
    }
}
