var Doppler = function (freq, freqWindow, sampleRate, fftSize) {
	var freqToIndex = function(freqToConvert) {
		return Math.round(freqToConvert / (sampleRate / 2) * fftSize / 2);
	};

	var indexToFreq = function(index) {
		return (sampleRate / 2) / (fftSize / 2) * index;
	};

	var getPrimaryTone = function() {
		return freqToIndex(freq);
	};

	var startSoundGeneration = function(context, freq) {
		var dopplerGain = context.createGain();
		dopplerGain.gain.value = 1;
		dopplerGain.connect(context.destination);

		var osc = context.createOscillator();
		osc.frequency.value = freq;
		osc.type = "sine";
		osc.start(0);
		osc.connect(dopplerGain);
	};

	var getBandwidth = function(audioData) {
		var primaryTone = getPrimaryTone(freq);
		var primaryVolume = audioData[primaryTone];
		var maxVolumeRatio = 0.001;
		var leftBandwidth = 0;
		var rightBandwidth = 0;

		do {
			leftBandwidth++;
			var volume = audioData[primaryTone - leftBandwidth];
			var normalizedVolume = volume / primaryVolume;
		} while (normalizedVolume > maxVolumeRatio && leftBandwidth < freqWindow);

		do {
			rightBandwidth++;
			var volume = audioData[primaryTone + rightBandwidth];
			var normalizedVolume = volume / primaryVolume;
		} while (normalizedVolume > maxVolumeRatio && rightBandwidth < freqWindow);

		return [ leftBandwidth, rightBandwidth ];
	};

	return {
		freqToIndex: freqToIndex,
		indexToFreq: indexToFreq,
		getPrimaryTone: getPrimaryTone,
		startSoundGeneration: startSoundGeneration,
		getBandwidth: getBandwidth
	};
}
