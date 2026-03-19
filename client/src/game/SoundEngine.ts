type OscType = OscillatorType;

interface NoteEvent {
  freq: number;
  duration: number;
  delay: number;
  type?: OscType;
  gain?: number;
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private musicNodes: AudioNode[] = [];
  private musicPlaying = false;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  get isMuted(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopMusic();
    } else if (this.musicPlaying) {
      this.startMusic();
    }
    return this.muted;
  }

  private playTone(
    freq: number,
    duration: number,
    delay = 0,
    type: OscType = 'square',
    gainVal = 0.15,
  ): void {
    if (this.muted) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  private playSequence(notes: NoteEvent[]): void {
    for (const n of notes) {
      this.playTone(n.freq, n.duration, n.delay, n.type ?? 'square', n.gain ?? 0.15);
    }
  }

  playMove(): void {
    this.playTone(220, 0.05, 0, 'square', 0.08);
  }

  playRotate(): void {
    this.playTone(330, 0.07, 0, 'sine', 0.1);
    this.playTone(440, 0.05, 0.04, 'sine', 0.07);
  }

  playHardDrop(): void {
    this.playTone(150, 0.12, 0, 'sawtooth', 0.2);
    this.playTone(80, 0.1, 0.06, 'square', 0.15);
  }

  playLineClear(lines: number): void {
    if (lines >= 4) {
      this.playTetris();
      return;
    }
    const base = [523, 659, 784];
    for (let i = 0; i < lines; i++) {
      this.playTone(base[i] ?? 880, 0.1, i * 0.08, 'sine', 0.18);
    }
  }

  private playTetris(): void {
    const fanfare: NoteEvent[] = [
      { freq: 523, duration: 0.1, delay: 0, type: 'square', gain: 0.2 },
      { freq: 659, duration: 0.1, delay: 0.1, type: 'square', gain: 0.2 },
      { freq: 784, duration: 0.1, delay: 0.2, type: 'square', gain: 0.2 },
      { freq: 1047, duration: 0.25, delay: 0.3, type: 'square', gain: 0.25 },
      { freq: 784, duration: 0.1, delay: 0.55, type: 'square', gain: 0.15 },
      { freq: 1047, duration: 0.4, delay: 0.65, type: 'square', gain: 0.25 },
    ];
    this.playSequence(fanfare);
  }

  playLevelUp(): void {
    const arpeggio: NoteEvent[] = [
      { freq: 262, duration: 0.1, delay: 0, type: 'square', gain: 0.2 },
      { freq: 330, duration: 0.1, delay: 0.1, type: 'square', gain: 0.2 },
      { freq: 392, duration: 0.1, delay: 0.2, type: 'square', gain: 0.2 },
      { freq: 523, duration: 0.1, delay: 0.3, type: 'square', gain: 0.22 },
      { freq: 659, duration: 0.1, delay: 0.4, type: 'square', gain: 0.22 },
      { freq: 784, duration: 0.2, delay: 0.5, type: 'square', gain: 0.25 },
    ];
    this.playSequence(arpeggio);
  }

  playGameOver(): void {
    const descent: NoteEvent[] = [
      { freq: 494, duration: 0.18, delay: 0, type: 'sawtooth', gain: 0.2 },
      { freq: 392, duration: 0.18, delay: 0.2, type: 'sawtooth', gain: 0.2 },
      { freq: 330, duration: 0.18, delay: 0.4, type: 'sawtooth', gain: 0.2 },
      { freq: 262, duration: 0.18, delay: 0.6, type: 'sawtooth', gain: 0.2 },
      { freq: 196, duration: 0.35, delay: 0.8, type: 'sawtooth', gain: 0.22 },
    ];
    this.playSequence(descent);
  }

  startMusic(): void {
    this.musicPlaying = true;
    if (this.muted) return;
    this.scheduleMusic();
  }

  stopMusic(): void {
    this.musicPlaying = false;
    for (const node of this.musicNodes) {
      try {
        (node as OscillatorNode).stop?.();
      } catch (_) {
        // already stopped
      }
    }
    this.musicNodes = [];
  }

  private scheduleMusic(): void {
    if (this.muted || !this.musicPlaying) return;
    const ctx = this.getCtx();

    // Classic Tetris-inspired looping melody (Korobeiniki-style, 8-bit)
    const bpm = 160;
    const beat = 60 / bpm;

    const melody: Array<[number, number]> = [
      [659, 1], [494, 0.5], [523, 0.5], [587, 1], [523, 0.5], [494, 0.5],
      [440, 1], [440, 0.5], [523, 0.5], [659, 1], [587, 0.5], [523, 0.5],
      [494, 1.5], [523, 0.5], [587, 1], [659, 1],
      [523, 1], [440, 1], [440, 2],
      [0, 0.5], [587, 1], [698, 0.5], [880, 1], [784, 0.5], [698, 0.5],
      [659, 1.5], [523, 0.5], [659, 1], [587, 0.5], [523, 0.5],
      [494, 1], [494, 0.5], [523, 0.5], [587, 1], [659, 1],
      [523, 1], [440, 1], [440, 2],
    ];

    let t = ctx.currentTime + 0.1;
    const loopDuration = melody.reduce((s, [, d]) => s + d * beat, 0);

    for (const [freq, dur] of melody) {
      if (freq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * beat * 0.9);
        osc.start(t);
        osc.stop(t + dur * beat);
        this.musicNodes.push(osc);
      }
      t += dur * beat;
    }

    // Loop
    setTimeout(
      () => {
        this.musicNodes = [];
        if (this.musicPlaying && !this.muted) {
          this.scheduleMusic();
        }
      },
      loopDuration * 1000,
    );
  }
}
