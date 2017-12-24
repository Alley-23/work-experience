var lastTime = 0;
var vendors = ['webkit', 'moz'];
var raf = window.requestAnimationFrame;

if (!raf) {
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        raf = window[vendors[x] + 'RequestAnimationFrame'];
    }
}

if (!raf) {
    raf = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}

function easeInOutQuad (t, b, _c, d) {
    var c = _c - b;
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
    } else {
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
}

function scrollProgress (startTime, startPos, endPos) {
    var currentTime = Date.now() - startTime;
    if(currentTime <= 500){
        var nowScrollHeight = easeInOutQuad(currentTime, startPos, endPos, 500);
        window.document.body.scrollTop = nowScrollHeight;
        raf(function () {
            scrollProgress(startTime, startPos, endPos);
        });
    }
}

module.exports = function (n) {
    raf(function () {
		scrollProgress(Date.now(), window.document.body.scrollTop, n);
    });
};