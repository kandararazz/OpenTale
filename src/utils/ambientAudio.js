/**
 * Web Audio API Atmospheric Soundscape Generator for OpenTale
 * Generates real-time, procedural ambient audio without external audio file dependencies.
 */

class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.activeTrack = 'none'; // 'none' | 'fireplace' | 'scifi' | 'forest' | 'cafe'
    this.volume = 0.4;
    this.masterGain = null;
    this.nodes = [];
    this.intervalId = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.nodes = [];
    this.activeTrack = 'none';
  }

  playTrack(trackName) {
    this.init();
    if (!this.ctx) return;

    this.stop();
    this.activeTrack = trackName;

    if (trackName === 'fireplace') {
      this.createFireplace();
    } else if (trackName === 'scifi') {
      this.createSciFiDrone();
    } else if (trackName === 'forest') {
      this.createForestRain();
    } else if (trackName === 'cafe') {
      this.createCafeAmbiance();
    }
  }

  // 1. Crackling Fireplace Soundscape 🪵
  createFireplace() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    whiteNoise.connect(filter);
    filter.connect(this.masterGain);
    whiteNoise.start();
    this.nodes.push(whiteNoise);

    // Micro-crackles generator
    this.intervalId = setInterval(() => {
      if (Math.random() > 0.4) {
        this.playPop();
      }
    }, 120);
  }

  playPop() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // 2. Sci-Fi Synth Drone Soundscape 🌌
  createSciFiDrone() {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.value = 65.41; // C2

    osc2.type = 'sine';
    osc2.frequency.value = 130.81; // C3

    filter.type = 'lowpass';
    filter.frequency.value = 350;

    lfo.frequency.value = 0.2; // Slow modulation
    lfoGain.gain.value = 150;

    lfo.connect(filter.frequency);
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.masterGain);

    osc1.start();
    osc2.start();
    lfo.start();

    this.nodes.push(osc1, osc2, lfo);
  }

  // 3. Enchanted Forest Rain 🌧️
  createForestRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const rainNoise = this.ctx.createBufferSource();
    rainNoise.buffer = noiseBuffer;
    rainNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;

    rainNoise.connect(filter);
    filter.connect(this.masterGain);
    rainNoise.start();

    this.nodes.push(rainNoise);

    // Random gentle bird chirps
    this.intervalId = setInterval(() => {
      if (Math.random() > 0.6) {
        this.playBirdChirp();
      }
    }, 4000);
  }

  playBirdChirp() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = 2200 + Math.random() * 600;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 800, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // 4. Cozy Cafe Ambiance ☕
  createCafeAmbiance() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
    }

    const cafeNoise = this.ctx.createBufferSource();
    cafeNoise.buffer = noiseBuffer;
    cafeNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 550;

    cafeNoise.connect(filter);
    filter.connect(this.masterGain);
    cafeNoise.start();

    this.nodes.push(cafeNoise);
  }
}

export const ambientAudio = new AmbientAudioEngine();
