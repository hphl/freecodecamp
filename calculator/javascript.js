(function () {
    function ResultOperation(lastOperation) {
        var _parentOperation = null;
        var _lastOperation = lastOperation;
        this.mergeOperation = function (curr) {
            if (curr.checkPriority() > _lastOperation.checkPriority()) {
                _lastOperation.addItem(curr);
                if (_parentOperation === null)
                    _parentOperation = _lastOperation;
                else {
                    _parentOperation.removeSecondNumber();
                    _parentOperation.addItem(_lastOperation);
                }
            } else {
                _lastOperation.addItem(curr.removeFirstNumber());
                curr.addItem(_lastOperation);
                if (_parentOperation !== null) {
                    _parentOperation.removeSecondNumber();
                    if (curr.checkPriority() <= _parentOperation.checkPriority()) {
                        _parentOperation.addItem(curr.removeFirstNumber());
                        curr.addItem(_parentOperation);
                        _parentOperation = null;
                    } else
                        _parentOperation.addItem(curr);
                }
            }
            _lastOperation = curr;
        }
        this.getResult = function () {
            if (_parentOperation === null)
                return _lastOperation.DoOperation();
            return _parentOperation.DoOperation();
        }
    }
    function MemoryManager() {
        var _elements = [];
        this.calculateResult = function () {
            if (_elements.length === 1)
                return _elements[0].DoOperation();
            var resultOperation = new ResultOperation(_elements.shift());
            resultOperation = _elements.reduce(function (prev, curr) {
                prev.mergeOperation(curr);
                return prev;
            }, resultOperation);
            return resultOperation.getResult();
        }
        this.reset = function () {
            _elements = [];
        }
        this.hasOperations = function () {
            return (_elements.length > 0);
        }
        this.strLastItem = function () {
            if (_elements.length === 0)
                return '0';
            return _elements[_elements.length - 1].getSymbol();
        }
        this.removeLastItem = function () {
            if (_elements.length > 0)
                return _elements.pop().getNumberOne();
            return '0';
        }
        this.addItem = function (item) {
            if (isNaN(item))
                _elements.push(item);
            else
                _elements[_elements.length - 1].addItem(item);
        }
        this.strElements = function () {
            if (_elements.length === 0)
                return '';
            if (_elements.length === 1)
                return _elements[0];
            return _elements.reduce(function (prev, curr) {
                return (prev.toString() + curr.toString());
            });
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

    function MathOperator(priority, symbol) {
        var _priority = priority;
        var _numberOne = null;
        var _numberTwo = null;
        var _symbol = symbol;
        this.addItem = function (number) {
            if (_numberOne === null)
                _numberOne = number;
            else if (_numberTwo === null)
                _numberTwo = number;
        }
        this.removeFirstNumber = function () {
            var valueNumber = _numberOne;
            _numberOne = null;
            return valueNumber;
        }
        this.removeSecondNumber = function () {
            var valueNumber = _numberTwo;
            _numberTwo = null;
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
        this.displayOperation = function () {
            var result = _numberOne + _symbol;
            if (_numberTwo !== null)
                result += _numberTwo;
            return result;
        }
        this.getSymbol = function () {
            return _symbol;
        }
    }
    MathOperator.prototype.toString = function operatorToString() {
        return this.displayOperation();
    }

    function Summatory() {
        MathOperator.call(this, 0, '+');
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

    function Division() {
        MathOperator.call(this, 1, '/');
        this.DoOperation = function () {
            var _numberOne = this.getNumberOne();
            var _numberTwo = this.getNumberTwo();
            if (isNaN(_numberOne))
                _numberOne = _numberOne.DoOperation();
            if (isNaN(_numberTwo))
                _numberTwo = _numberTwo.DoOperation();
            if (_numberTwo === null)
                _numberTwo = '1';
            return Number(_numberOne) / Number(_numberTwo);
        }
    }

    Division.prototype = Object.create(MathOperator.prototype);

    function Multiplication() {
        MathOperator.call(this, 1, '*');
        this.DoOperation = function () {
            var _numberOne = this.getNumberOne();
            var _numberTwo = this.getNumberTwo();
            if (isNaN(_numberOne))
                _numberOne = _numberOne.DoOperation();
            if (isNaN(_numberTwo))
                _numberTwo = _numberTwo.DoOperation();
            if (_numberTwo === null)
                _numberTwo = '1';
            return Number(_numberOne) * Number(_numberTwo);
        }
    }

    Multiplication.prototype = Object.create(MathOperator.prototype);

    function Sustraction() {
        MathOperator.call(this, 0, '-');
        this.DoOperation = function () {
            var _numberOne = this.getNumberOne();
            var _numberTwo = this.getNumberTwo();
            if (isNaN(_numberOne))
                _numberOne = _numberOne.DoOperation();
            if (isNaN(_numberTwo))
                _numberTwo = _numberTwo.DoOperation();
            return Number(_numberOne) - Number(_numberTwo);
        }
    }

    Sustraction.prototype = Object.create(MathOperator.prototype);

    function Calculator() {
        var _memory = new MemoryManager();
        var _lastItem = '0';
        var _mathOperations = new FactoryMathOperations();
        var _precision = 8;
        var selectBasicOperation = function (item) {
            switch (item) {
                case "ac":
                    _memory.reset();
                    _lastItem = '0';
                    return _lastItem;
                case "ce":
                    if (isNaN(_lastItem))
                        _lastItem = _memory.removeLastItem();
                    else {
                        if (_lastItem.length === 1)
                            _lastItem = _memory.strLastItem();
                        else {
                            _lastItem = _lastItem.substring(0, _lastItem.length - 1);
                            if (_lastItem === '-')
                                _lastItem = '0';
                        }
                    }
                    return _lastItem;
                case ".":
                    if (_lastItem.length < _precision && !_lastItem.match(/\./ig))
                        _lastItem += item;
                    return _lastItem;
                case "=":
                    if (!_memory.hasOperations())
                        return _lastItem;
                    if (!isNaN(_lastItem))
                        _memory.addItem(_lastItem);
                    _lastItem = roundNumber(_memory.calculateResult()).toString();
                    _memory.reset();
                    return _lastItem;
                default:
                    if (isNaN(_lastItem))
                        return item;
                    var mathOperation = _mathOperations.selectOperation(item);
                    mathOperation.addItem(_lastItem);
                    _memory.addItem(mathOperation);
                    _lastItem = item;
                    return item;
            }
        }
        this.introduceItem = function (item) {
            if (_lastItem === '/' && item === '0')
                return _lastItem;
            if (isNaN(parseInt(item)))
                return selectBasicOperation(item);
            if (_lastItem.length > _precision - 1 || _lastItem === '0' || isNaN(_lastItem))
                _lastItem = '';
            _lastItem += item;
            return _lastItem;
        }
        var roundNumber = function (number) {
            if (number.toString().length > _precision)
                return number.toPrecision(_precision);
            return number;
        }
        this.getHistory = function () {
            if (isNaN(_lastItem))
                return _memory.strElements();
            return _memory.strElements() + _lastItem;
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
