// Web Audio API procedural synthesizer for Matrix spatial soundscapes
// Zero external assets or MP3s — 100% procedurally synthesized in real-time

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initContext();
      this.startAmbientDrone();
      this.playChime(587.33); // D5 welcome chime
    } else {
      this.stopAmbientDrone();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play a soft futuristic UI chime (pentatonic scale notes)
  public playChime(freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.6) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      // Exponential decay
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext fallback
    }
  }

  // Play subtle micro-switch mechanical click
  public playTick() {
    if (this.isMuted) return;
    this.playChime(820, 'sine', 0.06);
  }

  // Play tactile tone blip with custom pitch
  public playBlip(freq: number = 640) {
    if (this.isMuted) return;
    this.playChime(freq, 'sine', 0.08);
  }

  // Play multi-tone telemetry uplink confirmation sequence
  public playUplinkSuccess() {
    if (this.isMuted) return;
    this.playChime(523.25, 'sine', 0.15); // C5
    setTimeout(() => this.playChime(659.25, 'sine', 0.18), 90); // E5
    setTimeout(() => this.playChime(783.99, 'sine', 0.22), 180); // G5
    setTimeout(() => this.playChime(1046.50, 'sine', 0.45), 280); // C6
  }

  // Play a dramatic sub-bass morph whoosh when changing 3D formations
  public playMorphSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Pitch drop from 180Hz to 45Hz
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 1.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);

      // Complementary high harmonic chime
      this.playChime(880, 'sine', 0.8);
      setTimeout(() => this.playChime(1174.66, 'sine', 0.6), 120);
    } catch {
      // AudioContext fallback
    }
  }

  // Continuous subtle deep-space subharmonic ambient drone
  private startAmbientDrone() {
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.025, now);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, now); // A1 sub-bass

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(110, now); // A2 harmonic

      this.ambientOsc1.connect(this.ambientGain);
      this.ambientOsc2.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
    } catch {
      // Audio fallback
    }
  }

  private stopAmbientDrone() {
    try {
      if (this.ambientOsc1) {
        this.ambientOsc1.stop();
        this.ambientOsc1.disconnect();
        this.ambientOsc1 = null;
      }
      if (this.ambientOsc2) {
        this.ambientOsc2.stop();
        this.ambientOsc2.disconnect();
        this.ambientOsc2 = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
    } catch {
      // Audio cleanup
    }
  }
}

export const soundEngine = new SoundEngine();
