
export class AudioService {
  private ctx: AudioContext | null = null;
  private oscillators: Map<string, OscillatorNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();

  constructor() {
    // Lazy init on first user interaction
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playNote(noteName: string, frequency: number, duration: number) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Oscillator
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth'; // Sawtooth is closer to strings than sine
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // Filter to soften the sawtooth (simulate wood body resonance slightly)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.ctx.currentTime);

    // Gain (Envelope)
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration); // Decay

    // Connect
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.1);
  }

  // Map note names to frequencies (Simplified for the demo range)
  // G3(196) to E6 range
  public static getFreq(note: string): number {
    // This would ideally use a proper library or map. 
    // Using a simplified lookup for the demo song notes.
    const map: Record<string, number> = {
      'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
      'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
      'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
      'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
      'G#5': 830.61, 'A5': 880.00
    };
    return map[note] || 440;
  }
}

export const audioService = new AudioService();
