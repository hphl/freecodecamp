(function () {
    function Timer (_name, _totalMinutes) {
        var _endTime;
        var _leftTime = convert();
        var _intervalState;
        function createTime () {
            //var days = Math.floor(_leftTime / (1000 * 60 * 60 * 24));
            //var hours = Math.floor((_leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((_leftTime % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((_leftTime % (1000 * 60)) / 1000);
            return twoDigits(minutes) + ':' + twoDigits(seconds);
        }
        function calculateStateTimer (displayTimer, resolve) {
            var _startTime = new Date().getTime();
            _leftTime = _endTime - _startTime;
            if (_leftTime <= 0) {
                stopInterval();
                resolve(true);
                return;
            }
            displayTimer.displayTimer(createTime());
            displayTimer.displayClock(convert(), _leftTime);
        }
        function stopInterval () {
            clearInterval(_intervalState);
        }
        function twoDigits (number) {
            return (number < 10) ? '0' + number.toString() : number.toString();
        }
        function convert () {
            return _totalMinutes * 60 * 1000;
        }
        return {
            changeTime (time) {
                _totalMinutes += time;
                if (_totalMinutes < 1)
                    _totalMinutes = 1;
                else
                    _leftTime += convert();
                return _totalMinutes;
            },
            getName () {
                return _name;
            },
            startTimer (displayTimer) {
                return new Promise((resolve) => {
                    _endTime = new Date().getTime() + _leftTime;
                    _intervalState = setInterval(calculateStateTimer, 550, displayTimer, resolve);
                });
            },
            pauseTimer () {
                clearInterval(_intervalState);
            },
            resetTimer () {
                stopInterval();
                _leftTime = convert();
                return twoDigits(_totalMinutes) + ':00';
            }
        }
    }
    function SoundMaker () {
        var _context = new AudioContext();
        return {
            sineSound (length) {
                var _oscillator = _context.createOscillator();
                var _gain = _context.createGain();
                _oscillator.connect(_gain);
                _oscillator.type = "sine";
                _gain.connect(_context.destination);
                _oscillator.start(0);
                _context.resume();
                _gain.gain.exponentialRampToValueAtTime(0.00001, _context.currentTime + length);
            }
        }
    }
    function ClockDisplayer (_htmlClock) {
        var _htmlTimer = _htmlClock.querySelector('.timer');
        var _htmlName = _htmlClock.querySelector('.type-time');
        var _htmlState = _htmlClock.querySelector('.state');
        return {
            displayTimer (timer) {
                _htmlTimer.textContent = timer;
                //console.log(_htmlTimer.textContent = timer);
            },
            displayName (name) {
                _htmlName.textContent = name;
            },
            displayClock (total, progress) {
                var porcetage = 100 - (100 * progress / total);
                _htmlClock.querySelector('.background-clock').style.height = porcetage + '%';
            },
            displayState (state){
                _htmlState.textContent = state;
            }
        }
    }
    function Clock (_htmlClock, _state) {
        var _currentTimer;
        var _index = 0;
        var _sound = SoundMaker();
        var _timers = [];
        _htmlClock.displayState(_state.getState());
        return {
            changeTimerTime (timer, time) {
                var newTime;
                for (const key in _timers) {
                    if (_timers[key] === timer) {
                        newTime = _timers[key].changeTime(time);
                        break;
                    }
                }
                this.resetClock();
                if (_state.isPlaying())
                    this.startClock();
                return newTime;
            },
            startClock (domElement) {
                if (_state.isPlaying() && domElement !== undefined && domElement !== null)
                    return ;
                _htmlClock.displayState(_state.newState(domElement));
                _currentTimer.startTimer(_htmlClock).then(function (value) {
                    _index++;
                    if (_index === _timers.length)
                        _index = 0;
                    _currentTimer = _timers[_index];
                    _sound.sineSound(2);
                    this.resetClock();
                    this.startClock();
                }.bind(this));
            },
            pauseClock (domElement) {
                _htmlClock.displayState(_state.newState(domElement));
                _currentTimer.pauseTimer();
            },
            resetClock (domElement) {
                _htmlClock.displayState(_state.newState(domElement));
                _htmlClock.displayTimer(_currentTimer.resetTimer());
                _htmlClock.displayName(_currentTimer.getName());
            },
            addTimer (timer) {
                _timers.push(timer);
                if (_timers.length === 1)
                    _currentTimer = _timers[_index];
            }
        }
    }
    function stateManager (initialState) {
        var _currentState = initialState;
        return {
            newState (domElement) {
                if(domElement !== undefined && domElement !== null){
                    _currentState.classList.remove("green-color");
                    _currentState = domElement;
                    _currentState.classList.add("green-color");
                }
                return _currentState.getAttribute('data-state');
            },
            isPlaying () {
                return _currentState.getAttribute('data-state') === 'playing';
            },
            getState(){
                return _currentState.getAttribute('data-state');
            }
        }
    }

    var _btnPlay = document.getElementById("btn-play");
    var _btnPause = document.getElementById("btn-pause");
    var _btnStop = document.getElementById("btn-stop");

    var _clock = Clock(ClockDisplayer(document.getElementById('clock')), stateManager(_btnPause));

    createSetter(document.getElementById('session-time'), 'session', 25);
    createSetter(document.getElementById('break-time'), 'break', 5);

    function createSetter (htmlSetter, name, totalMinutes) {
        var _timer = Timer(name, totalMinutes);
        _clock.addTimer(_timer);
        htmlSetter.querySelector('.plus').addEventListener('click', change.bind(this, 1));
        htmlSetter.querySelector('.minus').addEventListener('click', change.bind(this, -1));
        function change (time) {
            htmlSetter.querySelector('.time').textContent = _clock.changeTimerTime(_timer, time);
        }
    }

    _btnPlay.addEventListener("click", _clock.startClock.bind(this, _btnPlay));
    _btnPause.addEventListener("click", _clock.pauseClock.bind(this, _btnPause));
    _btnStop.addEventListener("click", _clock.resetClock.bind(this, _btnStop));
})();
