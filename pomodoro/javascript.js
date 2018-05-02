(function () {
    function Timer(name, time) {
        var _name = name;
        var _totalMinutes = time;
        var _endTime;
        var _leftTime = _totalMinutes * 60 * 1000;
        var _intervalState;
        function createTime() {
            //var days = Math.floor(_leftTime / (1000 * 60 * 60 * 24));
            //var hours = Math.floor((_leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((_leftTime % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((_leftTime % (1000 * 60)) / 1000);
            return minutes + ':' + seconds;
        }
        function stateTimer(displayTimer, resolve) {
            var _startTime = new Date().getTime();
            _leftTime = _endTime - _startTime;
            if (_leftTime <= 0) {
                stopInterval();
                resolve(true);
                return;
            }
            console.log(displayTimer.textContent = createTime());
        }
        function stopInterval() {
            clearInterval(_intervalState);
        }
        return {
            changeTime(time) {
                _totalMinutes += time;
                if (_totalMinutes < 1)
                    _totalMinutes = 1;
                else {
                    _leftTime += (time * 60 * 1000);
                    _endTime = new Date().getTime() + _leftTime;
                }
                return _totalMinutes;
            },
            getTimeLength() {
                return _totalMinutes;
            },
            getLeftTime() {
                return createTime();
            },
            getName() {
                return _name;
            },
            startTimer(displayTimer) {
                return new Promise((resolve, reject) => {
                    _endTime = new Date().getTime() + _leftTime;
                    _intervalState = setInterval(stateTimer, 950, displayTimer, resolve);
                });
            },
            pauseTimer() {
                clearInterval(_intervalState);
            },
            resetTimer() {
                stopInterval();
                _leftTime = _totalMinutes * 60 * 1000;
                return _totalMinutes + ':00';
            }
        }
    }
    function Clock(htmlTimer, htmlName) {
        var _sessionTimer = Timer('session', 25);
        var _breakTimer = Timer('break', 5);
        var _currentTimer = _sessionTimer;
        var _htmlTimer = htmlTimer;
        var _htmlName = htmlName;
        function makeSound() {
            var context = new AudioContext();
            var o = context.createOscillator();
            var g = context.createGain();
            o.connect(g);
            g.connect(context.destination);
            o.start(0);
            g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 10);
        }
        return {
            changeTimer(timer, time) {
                _htmlTimer.textContent = _currentTimer.getLeftTime();
                if (timer === _sessionTimer.getName())
                    return _sessionTimer.changeTime(time);
                if (timer === _breakTimer.getName())
                    return _breakTimer.changeTime(time);
            },
            startTimer() {
                _currentTimer.startTimer(_htmlTimer).then(function (value) {
                    if (_currentTimer === _sessionTimer)
                        _currentTimer = _breakTimer;
                    else if (_currentTimer === _breakTimer)
                        _currentTimer = _sessionTimer;
                    makeSound();
                    this.resetTimer();
                    this.startTimer();
                }.bind(this));
            },
            pauseTimer() {
                _currentTimer.pauseTimer();
            },
            resetTimer() {
                _htmlTimer.textContent = _currentTimer.resetTimer();
                _htmlName.textContent = _currentTimer.getName();
            }
        }
    }
    var _displayClockDom = document.getElementById('clock');
    var _clock = Clock(_displayClockDom.querySelector('.timer'), _displayClockDom.querySelector('.type-time'));
    var _breakSetter = document.getElementById('break-time');
    var _sessionSetter = document.getElementById('session-time');
    _clock.resetTimer();
    _breakSetter.querySelector('.plus').addEventListener("click", function () {
        _breakSetter.querySelector('.time').textContent = _clock.changeTimer('break', 1);
    });
    _breakSetter.querySelector('.minus').addEventListener("click", function () {
        _breakSetter.querySelector('.time').textContent = _clock.changeTimer('break', -1);
    });
    _sessionSetter.querySelector('.plus').addEventListener("click", function () {
        _sessionSetter.querySelector('.time').textContent = _clock.changeTimer('session', 1);
    });
    _sessionSetter.querySelector('.minus').addEventListener("click", function () {
        _sessionSetter.querySelector('.time').textContent = _clock.changeTimer('session', -1);
    });
    document.getElementById("btn-start").addEventListener("click", _clock.startTimer.bind(_clock));
    document.getElementById("btn-pause").addEventListener("click", _clock.pauseTimer);
    document.getElementById("btn-stop").addEventListener("click", _clock.resetTimer);
})();
