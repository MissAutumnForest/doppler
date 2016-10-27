var Visuals = function(primaryTone, freqWindow) {
	var spectrumCanvas = document.getElementById('spectrum');
	var zoomedSpectrumCanvas = document.getElementById('spectrum-zoom');
	var ballCanvas = document.getElementById('ball');

	var spectrumCtx = spectrumCanvas.getContext('2d');
	var zoomedCtx = zoomedSpectrumCanvas.getContext('2d');
	var ballContext = ballCanvas.getContext('2d');

	var drawBall = function(ctx, pos) {
	  ballContext.clearRect(0, 0, ballContext.canvas.width, ballContext.canvas.height);
	  ballContext.fillStyle = "#000000";

	  var normalizedX = Math.floor( 0.5 * ballContext.canvas.width );
	  var normalizedY = Math.floor( 0.5 * ballContext.canvas.height );
	  var maxSize = 100;
	  var normalizedSize = maxSize/2 + Math.floor( pos/30 * maxSize );

	  ballContext.fillRect(
		  normalizedX - normalizedSize/2,
		  ballContext.canvas.height - normalizedY - normalizedSize/2,
		  normalizedSize,
		  normalizedSize
	  );
	};

	var drawFrequencies = function(ctx, audioData, startFreq, endFreq) {
	  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	  ctx.fillStyle = "#000000";

	  var primaryVolume = audioData[primaryTone];
	  if (primaryVolume == 0) { primaryVolume = 255; }

	  for (var i = 0; i < (endFreq-startFreq); i++) {
		var volume = audioData[startFreq+i];
		var normalizedX = Math.floor( i/(endFreq-startFreq) * ctx.canvas.width );
		var normalizedY = Math.floor( 0.9 * volume/primaryVolume * ctx.canvas.height );

		ctx.fillRect(normalizedX, ctx.canvas.height - normalizedY - 5, 5, 5);
	  }
	};

	var render = function(audioData, band, freqIndex) {
		var from = primaryTone - freqWindow;
		var to   = primaryTone + freqWindow;

		drawFrequencies(spectrumCtx, audioData, 0, freqIndex);
		drawFrequencies(zoomedCtx, audioData, from, to);
		drawBall(ballContext, band[0] - band[1]);
	}

	return {
		render: render
	}
}



