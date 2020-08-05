/* global p5 */

// DO NOT EDIT THE FOLLOWING LINE
const p = new p5(() => {});

/*
App goal: 
Make a painting app that can customize 
saturation 
brightness 
stroke weight 


*/

let backgroundColor,
  canvasWidth,
  width,
  height,
  paint,
  n,
  priorX,
  priorY,
  weight,
  eraserOn,
  hue;
let white;
let colorArray;
let s, b, t;
let sSlider, bSlider, weightSlider, tSlider;
let button;

p.setup = function() {
  //setup width and height of total window (width/height) and canvas
  canvasWidth = 1000;
  width = 1250;
  height = 596;

  //initialize stroke weight
  weight = 10;

  // set colors
  p.colorMode(p.HSB, 360, 100, 100);

  //saturation and brightness
  s = 100;
  b = 100;
  t = 1;

  //create saturation and brightness and strokeWeight sliders
  sSlider = p.createSlider(0, 100, 80, 1);
  sSlider.position(canvasWidth + 80, 191);
  sSlider.style("width", "150px");

  bSlider = p.createSlider(0, 100, 90, 1);
  bSlider.position(canvasWidth + 80, 235);
  bSlider.style("width", "150px");

  tSlider = p.createSlider(0, 1, 1, 0.001);
  tSlider.position(canvasWidth + 80, 279);
  tSlider.style("width", "150px");

  weightSlider = p.createSlider(0, 100, 5);
  weightSlider.position(canvasWidth + 80, 430);
  weightSlider.style("width", "150px");

  weight = weightSlider.value();
  s = sSlider.value();
  b = bSlider.value();
  t = tSlider.value();

  // number of colors
  n = 1;

  //create all the colors
  white = p.color(0, 0, 100);
  colorArray = [white];
  colorArray = [];
  var j;
  for (j = 0; j < 360; j += 1) {
    colorArray.push(p.color(j, s, b, t));
    n++;
  }

  //default paint color
  paint = white;

  // Canvas & color settings
  p.createCanvas(width, height);
  p.noStroke();
  //BG
  backgroundColor = p.color(200);
  p.background(backgroundColor);

  eraserOn = false;
  /**
  button = p.createButton("eraser");
  button.position(canvasWidth + 100, 350);
  //button.mousePressed(callEraser());
  **/
};

p.draw = function() {
  //change saturation or brightness and opacity
  s = sSlider.value();
  b = bSlider.value();
  t = tSlider.value();

  //set new saturation and brightness  and opacity
  handleColor();
  //reset chosen paint color to new brightness, sat, and opacity
  handlePaintColor(s, b, t);

  //change strokeWeight
  weight = weightSlider.value();
  p.strokeWeight(weight);

  p.noStroke();
  //draw the toolbox
  p.fill(30);
  p.rect(canvasWidth, 0, width - canvasWidth, height);

  //draw the paintbox
  p.fill(80);
  p.rect(0, 0, canvasWidth, 52);

  //callEraser: sets paint to white if eraserOn is true
  //eraserOn is a boolean variable that toggles the eraser: it is changed under the p.mousePressed() function
  callEraser();

  // make paint pallette
  p.noStroke();
  handlePaint();

  //draw all the instructions in the toolbox
  p.fill(paint);
  p.textSize(50);
  p.text("color", canvasWidth + 75, 100);
  p.fill(white);
  p.textSize(30);
  p.text("toolbox", canvasWidth + 75, 40);
  p.textSize(15);
  p.text("saturation: " + s, canvasWidth + 55, 146);
  p.text("brightness: " + b, canvasWidth + 55, 190);
  p.text("opacity: " + t, canvasWidth + 55, 234);
  p.text("eraser on: " + eraserOn, canvasWidth + 73, 348);

  //display a circle that represents the brush weight

  p.text("brush weight", canvasWidth + 55, 390);
  p.stroke(white);
  p.line(canvasWidth + 125, 500, canvasWidth + 125, 500.2);
  //the previous 2 lines makes sure opacity is displayed as on a white background not dark grey
  //it draws a white circle of the same size as the colored one underneath the colored circle
  //important so that artists can accurately visualize color transparency
  p.stroke(paint);
  p.line(canvasWidth + 125, 500, canvasWidth + 125, 500.2);
  p.noStroke();

  //create eraser
  p.fill(357, 100, 83);
  p.rect(canvasWidth + 75, 300, 100, 30);
  p.fill(white);
  p.text("eraser", canvasWidth + 100, 320);

  //store priorX and Y for line drawing
  priorX = p.mouseX;
  priorY = p.mouseY;
};

//if mouse is dragged draw a line
p.mouseDragged = function() {
  p.stroke(paint);
  p.strokeWeight(weight);
  p.line(priorX, priorY, p.mouseX, p.mouseY);
  p.strokeWeight(0);
};

//if mouse is pressed over the eraserButton (change the value of the boolean eraserOn to the opposite of what it is)
p.mousePressed = function() {
  if (
    canvasWidth + 75 < p.mouseX &&
    p.mouseX < canvasWidth + 175 &&
    300 < p.mouseY &&
    p.mouseY < 330
  ) {
    eraserOn = !eraserOn;
  }
};

//change the color values is saturation or brightness or opacity is changed
function handleColor() {
  var j;
  for (j = 0; j < 360; j++) {
    colorArray[j] = p.color(j, s, b, t);
  }
}

//make paint pallete at the top of the screen
// check to see if the user has selected a different color
//if so, call changecolor()
function handlePaint() {
  var i;
  for (i = 0; i < colorArray.length; i++) {
    p.fill(colorArray[i]);
    p.noStroke();
    p.rect((i * canvasWidth) / n, 0, canvasWidth / n, 50);
    if (p.mouseY < 48 && p.mouseX > (i * canvasWidth) / n) {
      changeColor(colorArray[i]);
    }
  }
}

//change the paint color to the selected color
function changeColor(color) {
  paint = color;
  hue = p.hue(paint);
  console.log(hue);
}

//ensures that the current paint color changes when the slider is moved, not just the
// paint options up top in the "paint pallete"
function handlePaintColor(sat, brightness, opacity) {
  paint = p.color(hue, sat, brightness, opacity);
}

//  if eraserOn is true (make the paint color white)
function callEraser() {
  if (eraserOn == true) {
    paint = white;
  }
}
