var start = function(stream, callback) {
	var freq = 20000;
	var freqWindow = 33;
	var audioContext = new AudioContext();

	var mic = new Mic(stream, audioContext);
	var doppler = new Doppler(freq, freqWindow, mic.getSampleRate(), mic.getFftSize());

	var analyser = mic.getAnalyser();
	var primaryTone = doppler.getPrimaryTone();

	var visuals = new Visuals(primaryTone, freqWindow);

	doppler.startSoundGeneration(audioContext, freq);

	var frame = function() {
		var audioData = mic.getAudioData();
		var band = doppler.getBandwidth(audioData);

		visuals.render(audioData, band, doppler.freqToIndex(22000));
	};

	mic.read(frame);
};

window.addEventListener('load', function(e) {
	navigator.getUserMedia_ = (
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia
	);

	navigator.getUserMedia_({
		audio: {
			optional: [
				{ echoCancellation: false  }
			]
		}

	}, function(stream) {
		start(stream);

	}, function(error) {
		console.log('Error:', error);

	});
});
