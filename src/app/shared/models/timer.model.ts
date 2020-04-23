import { timer, Subscription } from 'rxjs';

export class Timer {
    private timeLeft: number;
    interval: Subscription = Subscription.EMPTY;
    isSpeechEnded = false;
    isTimerPaused = true;

    get time() {
        return Math.round(this.timeLeft / 1000);
    }

    constructor(obj?: any) {
        this.timeLeft = (obj?.time || 60) * 1000;
        this.isSpeechEnded = typeof obj?.isSpeechEnded === 'undefined' ? false : obj.isSpeechEnded;
        this.isTimerPaused = typeof obj?.isTimerPaused === 'undefined' ? true : obj.isSpeechEnded;
    }

    switchTimer() {
        if (this.isSpeechEnded) {
            return;
        }

        if (!this.isTimerPaused) {
            return this.pauseTimer();
        }

        this.isTimerPaused = false;
        return this.interval = timer(100, 100).subscribe(() => {
            if (this.timeLeft === 0) {
                return this.pauseTimer();
            }

            this.timeLeft -= 100;
        });
    }

    pauseTimer() {
        this.isTimerPaused = true;
        return this.interval.unsubscribe();
    }

    resetTimer(time: number) {
        this.isTimerPaused = true;
        this.isSpeechEnded = false;
        this.timeLeft = time * 1000;
        return this.interval.unsubscribe();
    }

    endSpeech() {
        this.isTimerPaused = true;
        this.isSpeechEnded = true;
        return this.interval.unsubscribe();
    }
}
