// Shloka data structure with audio paths
const shlokaData = {
    "shloka1": {
        sanskrit: "अगजानन-पद्मार्कं गजाननम्-अहर्निशम्।\nअनेकदंतं भक्तानाम् एकदंतम् उपास्महे ॥१॥",
        telugu: {
            text: "అగజానన పద్మార్కం గజాననం అహర్నిశం\nఅనేకదంతం భక్తానాం ఏకదంతం ఉపాస్మహే ॥",
            translation: "భక్తులకు అనేక రూపాలలో కనిపించే ఏకదంతుడైన గణేశుని సేవిస్తున్నాము...",
            explanation: "ఈ శ్లోకంలో గణపతి యొక్క వివిధ గుణాలను వర్ణించడం జరిగింది...",
            audio: {
                male: 'audio/shloka1_telugu_male.mp3',
                female: 'audio/shloka1_telugu_female.mp3'
            }
        },
        english: {
            text: "We worship the one-tusked Lord Ganesha...",
            translation: "We meditate upon the elephant-faced Lord...",
            explanation: "This shloka describes various attributes...",
            audio: {
                male: 'audio/shloka1_english_male.mp3',
                female: 'audio/shloka1_english_female.mp3'
            }
        },
        malayalam: {
            text: "അഗജാനന പദ്മാർക്കം ഗജാനനം...",
            translation: "ഭക്തർക്ക് അനേകം രൂപങ്ങളിൽ...",
            explanation: "ഈ ശ്ലോകത്തിൽ ഗണപതിയുടെ...",
            audio: {
                male: 'audio/shloka1_malayalam_male.mp3',
                female: 'audio/shloka1_malayalam_female.mp3'
            }
        }
    }
    // Add more shlokas
};

document.addEventListener('DOMContentLoaded', function() {
    // State management
    let currentState = {
        shloka: 'shloka1',
        language: 'telugu',
        isFemaleVoice: false,
        speed: 1.0,
        volume: 1.0,
        isPlaying: false,
        currentTime: 0,
        lastVolume: 1.0
    };

    // Settings history for undo
    const settingsHistory = {
        stack: [],
        maxSize: 10,
        
        push(state) {
            if (this.stack.length >= this.maxSize) {
                this.stack.shift();
            }
            this.stack.push({...state});
        },
        
        undo() {
            if (this.stack.length > 1) {
                this.stack.pop();
                return {...this.stack[this.stack.length - 1]};
            }
            return null;
        }
    };

    // Initialize elements
    const elements = {
        langButtons: document.querySelectorAll('.lang-btn'),
        shlokaButtons: document.querySelectorAll('.shloka-btn'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        meaningPanels: document.querySelectorAll('.meaning-panel'),
        voiceToggle: document.querySelector('.voice-toggle'),
        speedButtons: document.querySelectorAll('.speed-options button'),
        playBtn: document.querySelector('.play-btn'),
        undoBtn: document.querySelector('.undo-btn'),
        volumeSlider: document.querySelector('.volume-slider'),
        volumeBtn: document.querySelector('.volume-btn'),
        volumePercentage: document.querySelector('.volume-percentage'),
        timeDisplay: document.querySelector('.time-display'),
        sanskritText: document.querySelector('.sanskrit-text'),
        translationText: document.querySelector('.translation-text'),
        explanationText: document.querySelector('.explanation-text')
    };

    // Save initial state
    settingsHistory.push(currentState);

    // Update content based on language
    function updateContent(language) {
        const shloka = shlokaData[currentState.shloka];
        
        // Update Sanskrit text (always visible)
        elements.sanskritText.innerHTML = `
            <div class="original-sanskrit">${shloka.sanskrit}</div>
            <div class="transliteration">${shloka[language].text}</div>
        `;

        // Update translation and explanation
        elements.translationText.innerHTML = shloka[language].translation;
        elements.explanationText.innerHTML = shloka[language].explanation;

        // Update audio source
        updateAudioSource();
    }

    // Audio functionality
    let currentAudio = new Audio();
    
    function updateAudioSource() {
        const shloka = shlokaData[currentState.shloka];
        const gender = currentState.isFemaleVoice ? 'female' : 'male';
        const newSource = shloka[currentState.language].audio[gender];
        
        if (currentAudio.src !== newSource) {
            const wasPlaying = !currentAudio.paused;
            currentAudio.src = newSource;
            currentAudio.playbackRate = currentState.speed;
            currentAudio.volume = currentState.volume;
            if (wasPlaying) {
                currentAudio.play();
            }
        }
    }

    // Event Listeners for all buttons
    
    // 1. Language Buttons
    elements.langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newLanguage = button.dataset.lang;
            settingsHistory.push({...currentState});
            
            elements.langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentState.language = newLanguage;
            updateContent(newLanguage);
        });
    });

    // 2. Shloka Buttons
    elements.shlokaButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newShloka = 'shloka' + button.dataset.shloka;
            settingsHistory.push({...currentState});
            
            elements.shlokaButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentState.shloka = newShloka;
            updateContent(currentState.language);
        });
    });

    // 3. Tab Buttons
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            elements.tabButtons.forEach(btn => btn.classList.remove('active'));
            elements.meaningPanels.forEach(panel => panel.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // 4. Voice Toggle
    elements.voiceToggle.addEventListener('click', () => {
        settingsHistory.push({...currentState});
        currentState.isFemaleVoice = !currentState.isFemaleVoice;
        elements.voiceToggle.classList.toggle('female');
        updateAudioSource();
    });

    // 5. Speed Buttons
    elements.speedButtons.forEach(button => {
        button.addEventListener('click', () => {
            settingsHistory.push({...currentState});
            
            elements.speedButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentState.speed = parseFloat(button.dataset.speed);
            currentAudio.playbackRate = currentState.speed;
        });
    });

    // 6. Play Button
    elements.playBtn.addEventListener('click', () => {
        currentState.isPlaying = !currentState.isPlaying;
        
        if (currentState.isPlaying) {
            elements.playBtn.innerHTML = '<span class="play-icon">।।</span>';
            currentAudio.play();
        } else {
            elements.playBtn.innerHTML = '<span class="play-icon">॥</span>';
            currentAudio.pause();
        }
    });

    // 7. Volume Controls
    elements.volumeSlider.addEventListener('input', (e) => {
        settingsHistory.push({...currentState});
        const value = e.target.value / 100;
        
        currentState.volume = value;
        currentAudio.volume = value;
        elements.volumePercentage.textContent = Math.round(value * 100) + '%';
        
        updateVolumeIcon(value);
    });

    elements.volumeBtn.addEventListener('click', () => {
        settingsHistory.push({...currentState});
        
        if (currentState.volume > 0) {
            currentState.lastVolume = currentState.volume;
            currentState.volume = 0;
        } else {
            currentState.volume = currentState.lastVolume || 1;
        }
        
        currentAudio.volume = currentState.volume;
        elements.volumeSlider.value = currentState.volume * 100;
        elements.volumePercentage.textContent = Math.round(currentState.volume * 100) + '%';
        
        updateVolumeIcon(currentState.volume);
    });

    // 8. Undo Button
    elements.undoBtn.addEventListener('click', () => {
        const previousState = settingsHistory.undo();
        if (previousState) {
            currentState = {...previousState};
            updateContent(currentState.language);
        }
    });

    // Initialize with default state
    updateContent(currentState.language);
}); 