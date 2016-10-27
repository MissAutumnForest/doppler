var Mic = function(stream, context) {
	var micInput = context.createMediaStreamSource(stream);
	var analyser = context.createAnalyser();

	analyser.smoothingTimeConstant = 0.2;
	analyser.fftSize = 2048;
	micInput.connect(analyser);

	var updateAudioData = function() {
		audioData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(audioData);
	};

	var getFftSize = function() {
		return analyser.fftSize;
	};

	var getSampleRate = function() {
		return context.sampleRate;
	};

	var getAudioData = function() {
		return audioData;
	};

	var getAnalyser = function() {
		return analyser;
	};

	var read = function(callback) {
		setInterval(function() {
			updateAudioData();
			callback();
		});
	};

	return {
		getFftSize: getFftSize,
		getSampleRate: getSampleRate,
		getAudioData: getAudioData,
		getAnalyser: getAnalyser,
		read: read
	};
}
