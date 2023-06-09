class CalcController {

    constructor() {

        this._lastOperator = '';
        this._lastNumber = '';
        this._locale = 'pt-BR'
        this._operation = [];
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this.init();
        this.initButtonsEvents();
    };

    //recupera um valor do HTML
    get displayCalc() { return this._displayCalcEl.innerHTML; };
    //Seta um valor do HTML
    set displayCalc(value) { this._displayCalcEl.innerHTML = value };

    get dataAtual() { return this._currentDate; };
    set dataAtual(value) { this._currentDate = value };

    get displayTime() { return this._timeEl.innerHTML };
    set displayTime(value) { this._timeEl.innerHTML = value };

    get displayDate() { return this._dateEl.innerHTML };
    set displayDate(value) { this._dateEl.innerHTML = value };

    get currentDate() { return new Date() };
    set currentDate(value) { this._currentDate.innerHTML = value };


    init() {
        this.setDisplayDateTime();
        // setInterval(() => {
        //     this.setDisplayDateTime();
        // }, 1000);

    };

    setError() {
        this.displayCalc = 'error'
    };
    getLastOperation() {
        return this._operation[this._operation.length - 1];

    };
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
        console.log(this._operation)
    }


    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    soma(value, lastValue) {

        return value + lastValue;
    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {


            this.calc();

            console.log(this._operation);
        }

    }

    getResult() {
        return eval(this._operation.join(""));
    }
    calc() {

        let lastOperator = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){
            let firstNumber = this._operation[0];
            this._operation = [firstNumber, this._lastOperator,this._lastNumber]
        }

        if (this._operation.length > 3) {

            lastOperator = this._operation.pop();
            this._lastNumber = this.getResult();

        }
        else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
           

        }

        let result = this.getResult()

        if (lastOperator == '%') {
            result /= 100;
            this._operation = [result];
        }
        else {
            this._operation = [result];
            if (lastOperator) this._operation.push(lastOperator);
        }

        this.setLastNumberToDisplay();
        

    }

    getLastItem(isOperator = true) {

        let lastItem;
        for (var i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        } 
        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false)

        if (!lastNumber) {
            lastNumber = 0;
        }
        this.displayCalc = lastNumber;
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {

                this.setLastOperation(value);

            }
            else if (isNaN(value)) {
                console.log('ISNAN');
            }
            else {

                this.pushOperation(value);
                this.setLastNumberToDisplay();


            }
        }
        else {

            if (this.isOperator(value)) {
                this.pushOperation(value);


            }
            else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay();


            }

        }
    }


    clearAll() {
        this._operation = [];
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }
    execBtn(value) {

        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-')
                break;
            case 'divisao':
                this.addOperation('/')
                break;
            case 'multiplicacao':
                this.addOperation('*')
                break;
            case 'porcento':
                this.addOperation('%')
                break;
            case 'igual':
                this.calc()
                break;
            case 'ponto':
                this.addOperation('.')
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons > g , #parts > g');

        buttons.forEach((btn) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn);
            })
            // this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
            //     btn.style.cursor = "pointer";
            // })
        });
    };

    addEventListenerAll(element, events, func) {
        events.split(" ").forEach(event => {
            element.addEventListener(event, func, false);
        })
    }


    setDisplayDateTime() {
        // this.displayDate = this.currentDate.toLocaleDateString(this._locale,{day:'2-digit', month:'short', year:'numeric'});
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
}