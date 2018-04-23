(function () {
    function MemoryManager() {
        var _elements = [];
        this.calculateResult = function () {
            if (_elements.length === 1)
                return _getLastItem();
            var parentOperation = null;
            var resultOperation = _elements.reduce(function (prev, curr) {
                if (isNaN(prev)) {
                    if (isNaN(curr)) {
                        if (curr.checkPriority() > prev.checkPriority()) {
                            curr.addItem(prev.removeNumber());
                            prev.addItem(curr);
                            parentOperation = prev;
                        } else {
                            if (parentOperation === null)
                                curr.addItem(prev);
                            else {
                                if (curr.checkPriority() > parentOperation.checkPriority()) {
                                    curr.addItem(prev.removeNumber());
                                    prev.addItem(curr);
                                } else {
                                    curr.addItem(parentOperation);
                                    parentOperation = null;
                                }
                            }
                        }
                    } else {
                        prev.addItem(curr);
                        return prev;
                    }
                } else
                    curr.addItem(prev);
                return curr;
            });
            if (parentOperation === null)
                return resultOperation.DoOperation();
            return parentOperation.DoOperation();
        }
        this.reset = function () {
            _elements = [];
        }
        this.hasOperations = function () {
            return (_elements.length > 0);
        }
        var _getLastItem = function () {
            return _elements[_elements.length - 1];
        }
        this.removeLastItem = function () {
            if (_elements.length > 0)
                return _elements.pop();
            return '0';
        }
        this.addItem = function (item) {
            if (_elements.length > 0) {
                if (isNaN(_getLastItem())) {
                    if (!isNaN(item))
                        _elements.push(item);
                } else {
                    if (isNaN(item))
                        _elements.push(item);
                }
            } else
                _elements.push(item);
        }
        this.strElements = function () {
            if (_elements.length === 0)
                return '0';
            if (_elements.length === 1)
                return _elements[0];
            return _elements.reduce(function (prev, curr) {
                return (prev.toString() + curr.toString());
            });
        }
        this.updateLastDigit = function (item) {
            if (_elements.length > 0) {
                if (!isNaN(_getLastItem())) {
                    _elements[_elements.length - 1] = item;
                    return;
                }
            }
            _elements.push(item);
        }
    }
    function FactoryMathOperations() {
        this.selectOperation = function (strOperation) {
            switch (strOperation) {
                case "/":
                    return new Division();
                case "*":
                    return new Multiplication();
                case "+":
                    return new Summatory();
                case "-":
                    return new Sustraction();
                default:
                    return "Error";
            }
        }
    }

    function MathOperator(priority) {
        var _priority = priority;
        var _numberOne = null;
        var _numberTwo = null;

        this.addItem = function (number) {
            if (_numberOne === null)
                _numberOne = number;
            else if (_numberTwo === null)
                _numberTwo = number;
        }
        this.removeNumber = function () {
            var valueNumber;
            if (_numberTwo === null) {
                valueNumber = _numberOne;
                _numberOne = null;
            } else {
                valueNumber = _numberTwo;
                _numberTwo = null;
            }
            return valueNumber;
        }
        this.checkPriority = function () {
            return _priority;
        }
        this.getNumberOne = function () {
            return _numberOne;
        }
        this.getNumberTwo = function () {
            return _numberTwo;
        }
    }
    function Summatory() {
        MathOperator.call(this, 0);
        this.DoOperation = function () {
            var _numberOne = this.getNumberOne();
            var _numberTwo = this.getNumberTwo();
            if (isNaN(_numberOne))
                _numberOne = _numberOne.DoOperation();
            if (isNaN(_numberTwo))
                _numberTwo = _numberTwo.DoOperation();
            return Number(_numberOne) + Number(_numberTwo);
        }
    }

    Summatory.prototype = Object.create(MathOperator.prototype);
    //Summatory.prototype = new MathOperator();

    Summatory.prototype.toString = function sumOperatorToString() {
        return '+';
    }

    function Division() {
        MathOperator.call(this, 1);
        this.DoOperation = function () {
            var _numberOne = this.getNumberOne();
            var _numberTwo = this.getNumberTwo();
            if (isNaN(_numberOne))
                _numberOne = _numberOne.DoOperation();
            if (isNaN(_numberTwo))
                _numberTwo = _numberTwo.DoOperation();
            return Number(_numberOne) / Number(_numberTwo);
        }
    }

    Division.prototype = Object.create(MathOperator.prototype);

    Division.prototype.toString = function divOperatorToString() {
        return '/';
    }

    function Multiplication() {
        MathOperator.call(this, 1);
        this.DoOperation = function () {
            var _numberOne = this.getNumberOne();
            var _numberTwo = this.getNumberTwo();
            if (isNaN(_numberOne))
                _numberOne = _numberOne.DoOperation();
            if (isNaN(_numberTwo))
                _numberTwo = _numberTwo.DoOperation();
            return Number(_numberOne) * Number(_numberTwo);
        }
    }

    Multiplication.prototype = Object.create(MathOperator.prototype);

    Multiplication.prototype.toString = function MultOperatorToString() {
        return '*';
    }
    function Sustraction() {
        MathOperator.call(this, 0);
        this.DoOperation = function () {
            var _numberOne = this.getNumberOne();
            var _numberTwo = this.getNumberTwo();
            console.log(_numberOne);
            console.log(_numberTwo);

            if (isNaN(_numberOne))
                _numberOne = _numberOne.DoOperation();
            if (isNaN(_numberTwo))
                _numberTwo = _numberTwo.DoOperation();
            return Number(_numberOne) - Number(_numberTwo);
        }
    }

    Sustraction.prototype = Object.create(MathOperator.prototype);

    Sustraction.prototype.toString = function SustToString() {
        return '-';
    }
    function Calculator() {
        var _memory = new MemoryManager();
        var _currentItem = "0";
        var _mathOperations = new FactoryMathOperations();
        var _precision = 8;
        var selectBasicOperation = function (item) {
            switch (item) {
                case "ac":
                    _memory.reset();
                    _currentItem = '0';
                    return _currentItem;
                case "ce":
                    _memory.removeLastItem();
                    _currentItem = '0';
                    return _currentItem;
                case ".":
                    if (_currentItem.length < _precision && !_currentItem.match(/\./ig))
                        _currentItem += item;
                    _memory.updateLastDigit(_currentItem);
                    return _currentItem;
                case "=":
                    _currentItem = roundNumber(_memory.calculateResult());
                    _memory.reset();
                    _memory.addItem(_currentItem);
                    return _currentItem;
                default:
                    _memory.addItem(_mathOperations.selectOperation(item));
                    _currentItem = '0';
                    return item;
            }
        }
        this.introduceItem = function (item) {
            if (isNaN(parseInt(item))) {
                return (selectBasicOperation(item));
            } else {
                if (_currentItem.length > _precision - 1 || _currentItem === '0')
                    _currentItem = item;
                else
                    _currentItem += item;
                _memory.updateLastDigit(_currentItem);
                return _currentItem;
            }
        }
        var roundNumber = function (number) {
            if (number.toString().length > _precision)
                return number.toPrecision(_precision);
            return number;
        }
        this.getHistory = function () {
            return _memory.strElements();
        }
    }
    var calculator = new Calculator();
    var allBtns = document.getElementsByTagName('button');
    for (let index = 0; index < allBtns.length; index++) {
        allBtns[index].addEventListener("click", function (event) {
            document.getElementById("answer").textContent = calculator.introduceItem(this.value);
            document.getElementById("history").textContent = calculator.getHistory();
        });
    }
})();
