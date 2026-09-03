/**
 * Sister Sneak 3D - Gujarati & Hindi Voice Soundboard & Audio Engine
 * Manages tactical voice reaction cues, synthesized Indian fusion beats, and alert SFX.
 */

export class VoiceSoundboard {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Gujarati / Hindi Voice Lines & Synthesized Dialogue Reactions
  playVoiceLine(lineKey) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    if (lineKey === "MUMMY_AAVI") {
      this.synthesizeShout(440, 660, 0.4, "sawtooth"); // "Mummy Aavi!"
    } else if (lineKey === "PAKDI_GAYI") {
      this.synthesizeShout(330, 220, 0.5, "square");   // "Pakdi Gayi!"
    } else if (lineKey === "CHAPPAL_SLAP") {
      this.playChappalSlap();
    } else if (lineKey === "SUSPICIOUS") {
      this.synthesizeShout(280, 350, 0.35, "sine");
    }
  }

  playChappalSlap() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  synthesizeShout(freq1, freq2, duration, type = "sawtooth") {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq1, t);
    osc.frequency.linearRampToValueAtTime(freq2, t + duration * 0.7);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }
}
