
const uiButton = document.querySelector('.switch-ui');

modes = ["classic", "modern"];
activeMode = 0;

const all = document.querySelector('*');
const body = document.querySelector(`.body-${modes[activeMode]}`);
const screen = document.querySelector(`.screen-${modes[activeMode]}`);
const buttonContainer = document.querySelector(`.buttons-container-${modes[activeMode]}`);
const buttons = document.querySelectorAll(`.button-${modes[activeMode]}`);
const operandButtons = document.querySelectorAll(`.operand-${modes[activeMode]}`);

uiButton.addEventListener('click', () => {
    RemoveMode(modes[activeMode]);
    activeMode ^= 1;
    AddMode(modes[activeMode]);
});

function AddMode(mode){
    body.classList.add(`body-${mode}`);
    screen.classList.add(`screen-${mode}`);
    buttonContainer.classList.add(`buttons-container-${mode}`);
    buttons.forEach((button) => button.classList.add(`button-${mode}`)); 
    operandButtons.forEach((button) => button.classList.add(`operand-${mode}`)); 
    
}

function RemoveMode(mode){
    body.classList.remove(`body-${mode}`);
    screen.classList.remove(`screen-${mode}`);
    buttonContainer.classList.remove(`buttons-container-${mode}`);
    buttons.forEach((button) => button.classList.remove(`button-${mode}`)); 
    operandButtons.forEach((button) => button.classList.remove(`operand-${mode}`)); 
}

let num1;
let operand;
let num2;

let processingFP = false;
let dotClicked = false;
let decimal = "";

let history = [];

let numbers = /[0-9]+|π/i;
let operands = /\+|-|x|%|\//i;
let screenContents = document.createElement('div');
screenContents.style.fontSize = "8vh";
screenContents.style.paddingRight = "8px";
screenContents.textContent = GetDisplayText();


screen.appendChild(screenContents ?? "0");

buttons.forEach((button) => {
    button.addEventListener('mousedown', () => {
        button.classList.add(`button-clicked-${modes[activeMode]}`);
    });

    button.addEventListener('mouseup', () => {
        button.classList.remove(`button-clicked-${modes[activeMode]}`);
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
            case "C":
                Undo();
                screenContents.textContent = GetDisplayText();
                return;
        }

        if (/\./.test(button.textContent)){
            if (dotClicked || history.length === 0 || operands.test(history[history.length-1]))
                return;

            dotClicked = true;
        }

        if (operands.test(button.textContent)){
            dotClicked = false;

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
    processingFP = false;
    dotClicked = false;
    decimal = "";
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

        if (/\./.test(item)){
            processingFP = true;
            prevItem = item;
            return;
        }

        if (numbers.test(item)){
            if (processingFP){
                console.log("Appending to decimal side", decimal);
                decimal += item;
                prevItem = item;
                return;
            }

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

            if(processingFP){
                console.log(`${num1}.${decimal}`);
                
                if (operand == null){
                    num1 = +`${num1}.${decimal}`;
                    decimal = "";
                }
                else {
                    num2 = +`${num2}.${decimal}`;
                    decimal = "";
                }

                processingFP = false;
            }

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

    if (processingFP){
        num2 = +`${num2}.${decimal}`;
        decimal = "";
        processingFP = false;
    }

    history = [Operate(+num1, operand, +num2)];
    num1 = null;
    operand = null;
    num2 = null;
}

function GetDisplayText(){  
    return history.join('');
}