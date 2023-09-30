const buttons = document.querySelectorAll('button');
const screen = document.querySelector('.screen');

let num1;
let operand;
let num2;

let history = [];

let numbers = /[0-9]+|π/i;
let operands = /\+|-|x|\.|%|\//i;
let screenContents = document.createElement('div');
screenContents.style.fontSize = "8vh";
screenContents.textContent = GetDisplayText();


screen.appendChild(screenContents ?? "0");

buttons.forEach((button) => {
    button.addEventListener('mousedown', () => {
        button.classList.add('button-clicked');
    });

    button.addEventListener('mouseup', () => {
        button.classList.remove('button-clicked');
    });

    button.addEventListener('click', () => {
        switch (button.textContent){
            case "AC":
                Reset();
                screenContents.textContent = GetDisplayText();
                return;
            case "=":
                Evaluate();
                screenContents.textContent = GetDisplayText();
                return;
            case "<-":
                Undo();
                screenContents.textContent = GetDisplayText();
                return;
        }

        if (operands.test(button.textContent)){
            if (history.length == 0){
                return;
            }

            if (operands.test(history[history.length-1])){
                history[history.length-1] = button.textContent;
                screenContents.textContent = GetDisplayText();
                return;
            }
        }

        history.push(button.textContent);
        screenContents.textContent = GetDisplayText();
        
    })
});

function Operate(num1, operand, num2) {
    switch (operand){
        case "+": 
            return Add(num1, num2).toString();
        case "-": 
            return Subtract(num1, num2).toString();
        case "x": 
            return Multiply(num1, num2).toString();
        case "/": 
            return Divide(num1, num2).toString();
        case "%":
            return Modulo(num1, num2).toString();
    }
}

function Add(num1, num2){
    return num1 + num2;
}

function Subtract(num1, num2){
    return num1 - num2;
}

function Multiply(num1, num2){
    return num1 * num2;
}

function Divide(num1, num2){
    if (num2 != 0){
        return (num1 / num2).toFixed(2);
    }
    else {
        return "ERR";
    }

}

function Modulo(num1, num2){
    return num1 % num2;
}

function Reset(){
    initial = true;
    history = [];
}

function Undo(){

    if (history.length == 1){
        Reset();
        return;
    }

    history.pop();

}

function Evaluate() {

    let prevItem;

    history.forEach((item) => {

        if (prevItem == null){
            num1 = item;
            prevItem = item;
            return;
        }

        if (numbers.test(item)){
            if (operand == null){
                num1 += item;
                prevItem = item;
                return;
            }
            
            if (num2 == null){
                num2 = item;
                prevItem = item;
                return;
            }
            else {
                num2 += item;
                prevItem = item;
                return;
            }
        }

        if (operands.test(item)){

            if (num1 != null && operand != null && num2!= null){
                num1 = Operate(+num1, operand, +num2);
                operand = null;
                num2 = null;
            }

            operand = item;
            prevItem = item;
            return;
        }
    });

    history = [Operate(+num1, operand, +num2)];
    num1 = null;
    operand = null;
    num2 = null;
}

function GetDisplayText(){  
    return history.join(' ');
}