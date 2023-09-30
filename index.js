const buttons = document.querySelectorAll('button');
const screen = document.querySelector('.screen');

let num1;
let operand;
let num2;

let buffer = "0";
let initial = true;
let done = false;
let numbers = /[0-9]+/i;
let operands = /\+|-|x|\//i;
let screenContents = document.createElement('div');
screenContents.style.fontSize = "8vh";
screenContents.textContent = buffer;

screen.appendChild(screenContents ?? "0");

buttons.forEach((button) => {
    button.addEventListener('mousedown', () => {
        button.classList.add('button-clicked');
    });

    button.addEventListener('mouseup', () => {
        button.classList.remove('button-clicked');
    });

    button.addEventListener('click', () => {
        if (button.textContent == "AC"){
            Reset();
            return;
        }
        if (numbers.test(button.textContent)){
            if (+buffer > 100000)
                return;

            if (initial == true){
                buffer = button.textContent;
                initial = false;
            }
            else
                buffer += button.textContent;
                
            UpdateScreen();
        }
        else if (operands.test(button.textContent)){

            if (num1 == null){
                num1 = +buffer;
                initial = true;
                buffer = "0";
                operand = button.textContent;
                UpdateScreen()
                return;
            }

            if (operands.test(screenContents.textContent.charAt(screenContents.textContent.length-1))){
                operand = button.textContent;
                UpdateScreen();
                return;
            }

            num1 += +buffer;
            initial = true;
            buffer = "0";
            operand = button.textContent;
            UpdateScreen();
        }
        else if (button.textContent == "="){
            num2 = +buffer;
            buffer = "0";
            try {
                screenContents.textContent += ` = ${Operate(num1, operand, num2)}`;
            }
            catch (e){
                console.log(e);
                screenContents.textContent = e;
            }
            Reset(false);
        }
        
    })
});

function UpdateScreen() {
    screenContents.textContent = `${num1 ?? ""} ${operand ?? ""} ${buffer ?? ""}`;
}

function Operate(num1, operand, num2) {
    if (num1 == null || operand == null || num2 == null)
        throw "ERR";

    switch (operand){
        case "+": 
            return Add(num1, num2);
        case "-": 
            return Subtract(num1, num2);
        case "x": 
            return Multiply(num1, num2);
        case "/": 
            return Divide(num1, num2);
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

function Reset(setToZero = true){
    num1 = null;
    num2 = null;
    operand = null;
    buffer = "0";
    initial = true;
    done = false;
    if (setToZero)
        screenContents.textContent = buffer;
}