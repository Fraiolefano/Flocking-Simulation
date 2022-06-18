var boids=[];
var leaders=[];
var obstacles=[];
var predators=[];

var nBoids=100;

var cohFactor=0;
var aliFactor=0;
var sepFactor=0;
let maxDC=200;

let audio=[];

let nPrey=0;

isMobile=false;


// let debugTimers=[];
// let fcycle=0;  // se si desidera migliorare le prestazioni precaricando i valori del calcolo alare
function preload()
{
    audio.push(loadSound("audio/prey0.mp3"));
    audio.push(loadSound("audio/predator0.mp3"));
}
function setup()
{
    p5.disableFriendlyErrors=true;
    InputManager.init();
    pixelDensity(1);
    isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if(isMobile)
    {
        createCanvas(613,1020);
        document.getElementById("defaultCanvas0").style="width:100%;height:"+document.getElementById("l").offsetHeight+"px;";
    }
    else
    {
        createCanvas(window.innerWidth*0.75,page.window_size*0.9);
    }
    
    for (let b=0;b<nBoids;b++)
    {
        boids[b]=new Boid(random(0,width),random(0,height));
    }

    noFill();
    // preloadWingLines();

    // textSize(32);
    // textAlign(CENTER);

    document.getElementById("loadingText").remove();

    noSmooth();
    frameRate(60);
}

function draw()
{
    background(0);
    // fcycle++;
    // if (fcycle>359){fcycle=0;}

    // let startDebug=performance.now();
    
    for (let b=boids.length-1;b>=0;b--)
    {
        if (!boids[b].death)
        {
            boids[b].update();
        }
        else
        {
            boids[b].die();
            if (boids[b].deathTime>3000)
            {
                boids.splice(b,1);
                continue;
            }
        }
        boids[b].draw();
    }
    for (o of obstacles)
    {
        o.draw();
    }

    if (InputManager.obstacleButtons[1].checked)
    {
        stroke(255,0,0);
        rect(width-10,0,10,height);
        rect(0,0,10,height);

        rect(0,0,width,10);
        rect(0,height-10,width,10);
    }
    // fill(color(255));
    // text("Framerate : "+int(frameRate()),width/2.0,height/2.0);  // per il debug delle prestazioni
    // noFill();

    drawCohesion();
    cohesionData=[];

    // let endDebug=performance.now();
    // debugTime(endDebug-startDebug);

}

function mouseClicked()
{
    if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height)
    {
        InputManager.createPointObstacle();
        InputManager.createPrey();
        InputManager.createPredator();
    }
}

function mouseDragged()
{
    if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height)
    {
        if (isMobile)
        {
            if (InputManager.obstacleButtons[0].checked || InputManager.obstacleButtons[2].checked)
            {
                document.getElementsByTagName("body")[0].style.overflowX="hidden";
                document.getElementsByTagName("body")[0].style.overflowY="hidden";
            }
        }
        InputManager.createPointObstacle();
    }
}
function mouseReleased()
{
    if(isMobile)
    {
        document.getElementsByTagName("body")[0].style.overflowX="auto";
        document.getElementsByTagName("body")[0].style.overflowY="auto";
    }
}

function invertColor(colorToInvert)
{
    colorMode(HSB,360);
    let h=hue(colorToInvert);
    let s=saturation(colorToInvert);
    let b=brightness(colorToInvert);


    if (h==0 && s==0 && b==360)
    {
        colorMode(RGB,255);
        return color(255,0,0);
    }
    h+=180;
    if (h>360)
    {
        h-=360;
    }

    let colToRet=color(h,s,b);
    colorMode(RGB,255);
    return colToRet;
}

function debugTime(diffTimer)  //semplice timer per provare alla buona l'ottimizzazione delle funzioni
{
    debugTimers.push(diffTimer);
    if (debugTimers.length==300)
    {
        let midPerformance=0;
        for (d of debugTimers)
        {
            midPerformance+=d
        }
        midPerformance/=300;
        console.log(midPerformance);
        debugTimers=[];
    }
}