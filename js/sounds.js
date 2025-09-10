// Звуковая система
class SoundManager {
    constructor() {
        this.sounds = {};
        this.audioContext = null;
        this.volume = 0.5;
        this.enabled = true;
        
        this.initAudioContext();
        this.loadSounds();
    }

    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.log('Web Audio API не поддерживается');
        }
    }

    loadSounds() {
        // Создание звуков с помощью Web Audio API
        this.sounds = {
            click: this.createBeepSound(800, 0.1),
            coin: this.createBeepSound(1000, 0.2),
            gem: this.createBeepSound(1500, 0.3),
            purchase: this.createBeepSound(1200, 0.15),
            packopen: this.createBeepSound(600, 0.5),
            levelup: this.createBeepSound(400, 0.8)
        };
    }

    createBeepSound(frequency, duration) {
        if (!this.audioContext) return null;

        return () => {
            if (!this.enabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    setVolume(volume) {
        this.volume = volume / 100;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }
}

// Глобальная функция для воспроизведения звуков
function playSound(soundName) {
    if (window.soundManager) {
        window.soundManager.play(soundName);
    }
}

// Инициализация звукового менеджера
document.addEventListener('DOMContentLoaded', () => {
    window.soundManager = new SoundManager();
});