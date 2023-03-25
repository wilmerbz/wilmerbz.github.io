// Get canvas and context
const canvas = document.getElementById('mainCanvas');
const context = canvas.getContext('2d');

// Frames per second
const fps = 60;
// Font size
const fontSize = 20;

// Gradient colors inside to out
const color1 = '#0aff0a';
//const color3 = 'orange';
const color3 = 'red';
const color2 = 'blue';

// Characters
const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz♔♕♖♗♘♙♚♛♜♝♞♟☀☁❆❅❄♪♫'
// const characters = 'アァカサタナハマヤャラワLUCELLYlucellyWILMERwilmer';
//const characters = 'modularisMODULARIS';

let gradient = null;

function initializeCanvas(params) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create Radial gradiente First circle: x1, y1, r1, Second circle: x2, y2, r2
    const x1 = canvas.width / 2; // Center
    const y1 = canvas.height / 2; // Center
    const r1 = canvas.height / 3;

    const x2 = canvas.width / 2;
    const y2 = canvas.height / 2;
    const r2 = canvas.height;

    gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);

    gradient.addColorStop(0, color1);
    gradient.addColorStop(0.5, color2);
    gradient.addColorStop(1, color3);

    // Create Linear Gradient from start x/y and end x/y
    // From to top-left to bottom-right.
    // let gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);

    // From bottom-left to top-right.
    // let gradient = context.createLinearGradient(0, canvas.height, canvas.width, 0);

    //Define colors for the gradient:
    // Start to end
    // gradient.addColorStop(0,'red');
    // gradient.addColorStop(0.2,'yellow');
    // gradient.addColorStop(0.4,'green');
    // gradient.addColorStop(0.6,'cyan');
    // gradient.addColorStop(0.8,'blue');
    // gradient.addColorStop(1,'magenta');
}

initializeCanvas();

class Symbol {
    constructor(x, y, fontSize, canvasHeight) {
        this.characters = characters;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.canvasHeight = canvasHeight;
    }
    draw(context) {
        // Ramdomize characters and draw on the canvas at a specific position
        var characterIndex = Math.floor(Math.random() * this.characters.length);
        this.text = this.characters.charAt(characterIndex);
        var currentX = this.x * this.fontSize;
        var currentY = this.y * this.fontSize;
        context.fillText(this.text, currentX, currentY);

        // Reset the Y position ramdomly to create the effect for diferent column speed.
        if (currentY > this.canvasHeight && Math.random() > 0.98) {
            this.y = 0;
        } else {
            this.y += 1;
        }

    }
}

class Effect {
    constructor(canvasWidth, canvasHeight) {
        this.fontSize = fontSize;

        this.resize(canvasWidth, canvasHeight);
    }
    #initialize() {
        for (let index = 0; index < this.columns; index++) {
            this.symbols[index] = new Symbol(index, 0, this.fontSize, this.canvasHeight);
        }
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
}

const effect = new Effect(canvas.width, canvas.height);

// Control frames per second (FPS) to make the animation slower.
let lastTime = 0;

const nextFrame = 1000 / fps;
let animationTime = 0;

function animate(timestamp) {

    var deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (animationTime > nextFrame) {
        // Every frame will dra a semi transparent rectangle that will create the fade out effect
        context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //Set color for all elements 
        //context.fillStyle = '#0aff0a';
        //context.fillStyle = 'gray';

        // With gradient each element will have a diferent color based on their current positiion
        context.fillStyle = gradient;

        // Set font
        context.font = effect.fontSize + 'px monospace';

        // Fix alignment for chinese characters
        context.textAlign = 'center';

        // Draw each symbol
        effect.symbols.forEach(symbol => symbol.draw(context));

        // Reset animation time
        animationTime = 0;
    } else {
        // Increase animation time with the current delta
        animationTime += deltaTime;
    }

    // Send function to the canvas animation frame that is requested every time a new frame is needed
    requestAnimationFrame(animate);
}

animate(0);

window.addEventListener('resize', function () {
    initializeCanvas();
    effect.resize(canvas.width, canvas.height);
});