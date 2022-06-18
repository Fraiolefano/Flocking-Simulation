InputManager={};

InputManager.r1Coh;
InputManager.r2Ali;
InputManager.r3Sep;

InputManager.lCoh;
InputManager.lAli;
InputManager.lSep;

InputManager.viewerCoh;
InputManager.viewerAli;
InputManager.viewerSep;
InputManager.viewerSense;

InputManager.shapeButtons;
InputManager.colorButtons;
InputManager.colorPickers;

InputManager.obstacleButtons;
InputManager.creatureButtons;

InputManager.audioButton;
InputManager.downloader;


InputManager.cohFactor=0.05;
InputManager.aliFactor=0.05;
InputManager.sepFactor=2;

InputManager.shapeSelected=0; //birds



InputManager.colorationMode=2; //mono

InputManager.gradients=[];


InputManager.init=function()
{
    this.r1Coh=document.getElementById("cohesion");
    this.r2Ali=document.getElementById("alignment");
    this.r3Sep=document.getElementById("separation");

    this.r1Coh.value=this.cohFactor;
    this.r2Ali.value=this.aliFactor;
    this.r3Sep.value=this.sepFactor;

    this.lCoh=document.getElementById("lCoh");
    this.lAli=document.getElementById("lAli");
    this.lSep=document.getElementById("lSep");

    this.lCoh.value=this.cohFactor;
    this.lAli.value=this.aliFactor;
    this.lSep.value=this.sepFactor;

    this.viewerCoh=document.getElementById("viewerCoh");
    this.viewerAli=document.getElementById("viewerAli");
    this.viewerSep=document.getElementById("viewerSep");
    this.viewerSense=document.getElementById("viewerSense");

    this.viewerCoh.checked=false;
    this.viewerAli.checked=false;
    this.viewerSep.checked=false;
    this.viewerSense.checked=false;
    
    this.shapeButtons=document.getElementsByName("shapeButton");
    this.shapeButtons[0].checked=true;

    this.colorButtons=document.getElementsByName("colorButton");
    this.colorButtons[2].checked=true;
    this.colorPickers=document.getElementsByName("colorPick");
    this.colorPickers[0].value="#00FFA7";
    this.colorPickers[1].value="#729FCF";
    this.colorPickers[2].value="#00FF83";
    this.colorPickers[3].value="#ffffff";
    this.colorPickers[4].value="#00FFA7";


    this.changeColoration(2);
    
    this.obstacleButtons=document.getElementsByClassName("obstacleButton");
    this.obstacleButtons[0].checked=false;
    this.obstacleButtons[1].checked=false;
    this.obstacleButtons[2].checked=false;

    this.creatureButtons=document.getElementsByClassName("creatureButton");
    this.creatureButtons[0].checked=false;
    this.creatureButtons[1].checked=false;

    this.audioButton=document.getElementById("audioButton");
    this.audioButton.checked=false;
}

InputManager.saveShot=function(imgName)
{
    nowTime=year()+"_"+month()+"_"+day()+"-"+hour()+"-"+minute()+"-"+second();
    imageName="./imgs/"+imgName+"_"+nowTime+".png";
    save(imageName);
    console.log("Saved : "+imageName);
}

InputManager.generateButtons=function()
{
  buttonDiv=document.getElementById("colorButtons");
  for(let c=0;c<3;c++)
  {
    divEl=document.createElement("DIV");
    divEl.style="width:31%;display:inline-block;height:50px;";//border:white solid
    radioB=document.createElement("input");
    radioB.setAttribute("type","radio");
    radioB.name="colorations";
    radioB.value=c;
    radioB.onclick=function(){InputManager.changeColoration(c)};
    radioB.style="width:50px;height:50px;accent-color:orange;";
    if (c==0){radioB.setAttribute("checked",true); }
    divEl.append(radioB);
    buttonDiv.append(divEl);
  }
}

InputManager.changeColoration=function(colorIndex)
{
    switch (colorIndex)
    {
        case 0:
            this.showColorOptions(0);
            this.colorationMode=0;

            for(b of boids)
            {
                if (b instanceof Predator==true)
                {
                    col=invertColor(this.colorPickers[0].value)

                    let colR=red(col);
                    let colG=green(col);
                    let colB=blue(col);
                    colR+=random(-80,80);
                    colG+=random(-80,80);
                    colB+=random(-80,80);
                    col=color(colR,colG,colB);
                    b.color=color(col);
                }
            }

            break;

        case 1:
            this.showColorOptions(1);
            InputManager.gradients[0]=color(this.colorPickers[1].value);
            InputManager.gradients[1]=color(this.colorPickers[2].value);
            this.colorationMode=1;

            for(b of boids)
            {
                if (b instanceof Predator==true)
                {
                    col=invertColor(this.colorPickers[1].value)

                    let colR=red(col);
                    let colG=green(col);
                    let colB=blue(col);
                    colR+=random(-80,80);
                    colG+=random(-80,80);
                    colB+=random(-80,80);
                    col=color(colR,colG,colB);
                    b.color=color(col);
                }
            }

            break;
        case 2:
            this.showColorOptions(2);
            this.colorationMode=2;
            for(b of boids)
            {
                if (b instanceof Predator==false)
                {
                    b.color=color(this.colorPickers[3].value);
                }
                else
                {
                    b.color=color(invertColor(this.colorPickers[3].value));
                }
            }
            break;
        case 3:
            this.showColorOptions(3);
            this.colorationMode=3;
            for(b of boids)
            {
                let col=color(this.colorPickers[4].value);
                
                if (b instanceof Predator==true)
                {
                    col=invertColor(this.colorPickers[4].value)
                }
                let colR=red(col);
                let colG=green(col);
                let colB=blue(col);
                colR+=random(-80,80);
                colG+=random(-80,80);
                colB+=random(-80,80);
                col=color(colR,colG,colB);

                b.color=color(col);
            }
            break;
    }
}

InputManager.showColorOptions=function(pickIndex)
{
    switch(pickIndex)
    {
        case 0:
            this.colorPickers[0].hidden=false;
            this.colorPickers[1].hidden=true;
            this.colorPickers[2].hidden=true;
            this.colorPickers[3].hidden=true;
            this.colorPickers[4].hidden=true;
            break;
        case 1:
            this.colorPickers[0].hidden=true;
            this.colorPickers[1].hidden=false;
            this.colorPickers[2].hidden=false;
            this.colorPickers[3].hidden=true;
            this.colorPickers[4].hidden=true;
            break;

        case 2:
            this.colorPickers[0].hidden=true;
            this.colorPickers[1].hidden=true;
            this.colorPickers[2].hidden=true;
            this.colorPickers[3].hidden=false;
            this.colorPickers[4].hidden=true;
            break;

        case 3:
            this.colorPickers[0].hidden=true;
            this.colorPickers[1].hidden=true;
            this.colorPickers[2].hidden=true;
            this.colorPickers[3].hidden=true;
            this.colorPickers[4].hidden=false;
            break;
    }
}

InputManager.mouseObstacle=function()
{
    if (this.obstacleButtons[0].checked)
    {
        obstacles.push(new Obstacle(mouseX,mouseY));
    }
    else
    {
        for (o in obstacles)
        {
            if (obstacles[o].id==0)
            {
                obstacles[o]=null;
                obstacles.splice(o);
            }
        }
    }
}

InputManager.createPointObstacle=function()
{

    if (this.obstacleButtons[2].checked)
    {
        let o=new Obstacle(mouseX,mouseY);
        o.id=2;

        for (ob of obstacles)
        {
            if (p5.Vector.dist(o.position,ob.position)<(o.size*0.75) && ob.id!=0)
            {
                return null;
            }
        }
        obstacles.push(o);
    }

}

InputManager.clearObstacles=function()
{
    for (let c=obstacles.length-1;c>=0;c--)
    {
        if (obstacles[c].id!=0)
        {
            obstacles[c]=null;
            obstacles.splice(c);
        }
    }
}

InputManager.createPrey=function()
{
    if (this.creatureButtons[0].checked)
    {
        if (boids.length<nBoids+10)
        {
            let p=new Boid(mouseX,mouseY);
            p.coloration();
            boids.push(p);
            this.changeColoration(this.colorationMode);
        }
        else
        {
            alert("Non puoi creare più di "+int(nBoids+10)+" prede");
        }
    }
}
InputManager.createPredator=function()
{
    if (this.creatureButtons[1].checked)
    {
        if (predators.length<10)
        {
            let p=new Predator(mouseX,mouseY);
            p.coloration();
            boids.push(p);
            this.changeColoration(this.colorationMode);
            predators.push(1);
        }
        else
        {
            alert("Non puoi creare più di 10 predatori");
        }
    }
}

InputManager.clearPredators=function()
{
    for (b in boids)
    {
        if (boids[b] instanceof Predator)
        {
            boids[b]=null;
            boids.splice(b);
        }
    }
    predators=[];
    if (InputManager.audioButton.checked)
    {
        audio[1].stop();
    }
}
InputManager.avoidBehavior=function()
{
    return obstacles.length>0 || this.obstacleButtons[1].checked;
    //return this.obstacleButtons[0].checked || this.obstacleButtons[1].checked || this.obstacleButtons[2].checked;
}

InputManager.manageCheckedDrawers=function(lastPressed)
{
    let buttonsToControl=[this.obstacleButtons[2],this.creatureButtons[0],this.creatureButtons[1]]
    for( let bt of buttonsToControl)
    {
        if (bt!=lastPressed)
        {
            bt.checked=false;
        }
    }

}

InputManager.manageAudio=function()
{
    if (audioButton.checked)
    {
        audio[0].loop();

        //audio[0].play();
        if (predators.length>0)
        {
            audio[1].loop();
          //  audio[1].play();
        }
    }
    else
    {
        audio[0].stop();
        audio[1].stop();
    }
}