let omega=12.5663;//(2*PI)/0.5;
// wingLines=[];
cohesionData=[]; //  *!* = tentativo di migliorare le prestazioni su mobile, purtroppo fallito
function preloadWingLines()  // *!* preload dei valori alari per migliorare leggermente le prestazioni
{
    for (let c=0;c<100;c++)
    {
        let values=[];
        for (let a=0;a<360;a++)
        {
            let wingLine=1.0+(5.0*cos((omega*(0.01666*a))+c));  //0.0166 = 60 fps
            wingLine=int(wingLine);  // *!*
            values.push(wingLine);
        }
        wingLines.push(values);
    }
}

function drawCohesion()  // *!*
{
    if (InputManager.viewerCoh.checked && InputManager.cohFactor!=0)
    {
        stroke(255,0,0);
        beginShape(LINES);
        for (let el of cohesionData)
        {
            vertex(el[0],el[1]);
            vertex(el[2],el[3]);
        }
        endShape();
    }
}
class Boid
{
    constructor(posX,posY)
    {
        this.maxVel=2;
        this.position=new p5.Vector(posX,posY);
        this.velocity=p5.Vector.random2D();
        this.velocity.limit(this.maxVel);
        this.steering=new p5.Vector(0,0);  //forza che fa sterzare il boid
        this.sense=100;
        this.color=color(255);
        this.size=8; //diameter
        this.lifeTime=0;
        this.index=boids.length;
        this.phi=this.index;
        this.isLeader=false;
        this.nConnected=0;
        this.timerLeader=0;
        this.timerAvoiding=0;
        this.colorToChange=this.color;

        this.death=false;
        this.deathTime=0;
        this.avoidingArgs=[false,null,null]; //is avoiding, from velocity, to velocity, mag fromVelocity

        if (this instanceof Predator==false)
        {
            nPrey++;
        }
        if (InputManager.audioButton.checked)
        {
            if (this instanceof Predator)
            {
                if (!audio[1].isPlaying())
                {
                    audio[1].loop();
                }
            }
            else
            {
                let volume=(1.0 * (nPrey/100.0));
                audio[0].setVolume(volume);

                if(!audio[0].isPlaying())
                {
                    audio[0].loop();
                }
            }
        }
    }

    update()
    {

        
        
        // this.separation();
        // this.alignment();
        // this.cohesion();
        this.separationAligmentCohesion();


        
        
        this.velocity.add(this.steering);
        this.position.add(this.velocity);
        
        this.pacmanEffect();

        this.steering=new p5.Vector(0,0);
        this.limitSpeed();


        this.avoid();

        this.setLeader();


        this.timerLeader+=deltaTime;
        this.lifeTime+=deltaTime/1000.0
    }

    draw()
    {
        this.drawSense();
        this.coloration();
        stroke(this.color);
        let angle=this.velocity.heading()+(1.5707);//PI/2
        translate(this.position.x,this.position.y);
        rotate(angle);
        switch(InputManager.shapeSelected)
        {
            case 0:
                
                line(0,-8,0,5);
                let wingLine=int(1.0+(5.0*cos((omega*this.lifeTime)+this.phi)));
                // line(0,1,-7,wingLines[this.index][fcycle]);
                // line(0,1,7,wingLines[this.index][fcycle]);

                line(0,1,-7,wingLine);
                line(0,1,7,wingLine);
                break;
            case 1:
                triangle(0,-5,-2,5,+2,5);
                break;
            case 2:
                circle(0,0,this.size);
                break;
            case 3:
                line(0,-5,0,5);
                break;
        }
        rotate(-angle);
        translate(-this.position.x,-this.position.y);
    }
    cohesion()
    {
        let midPosition=new p5.Vector(0,0);
        let detected=0;
        for(let b of boids)
        {
            if (this.position.dist(b.position)<this.sense)
            {
                midPosition.add(b.position);
                detected++;
            }
        }

        if (detected>1)
        {
            midPosition.div(detected);
            this.drawCohesion(midPosition);
            let aimed=midPosition.sub(this.position);
            //aimed.limit(InputManager.cohFactor);
            aimed.setMag(InputManager.cohFactor);
            this.steering.add(aimed);
        }

    }

    alignment()
    {
        let midVel=new p5.Vector(0,0);
        let detected=0;
        for(let b of boids)
        {
            if(this!=b && this.position.dist(b.position)<this.sense)
            {
                midVel.add(b.velocity);
                detected++;
            }
        }

        if(detected>0)
        {
            this.nConnected=detected;
            midVel.div(detected);
            midVel.setMag(InputManager.aliFactor);
            this.steering.add(midVel);
            this.drawAlignment(midVel);
        }
        else
        {
            this.nConnected=0;
        }
    }

    separation()
    {

        let detected=0;
        let aimedDirection=new p5.Vector(0,0);
        for(let b of boids)
        {
            if(this!=b && this.position.dist(b.position)<25)
            {
                aimedDirection.add(p5.Vector.sub(this.position,b.position));
                detected++;
            }
        }

        if(detected>0)
        {
            aimedDirection.div(detected);
            this.drawSeparation(aimedDirection);
            aimedDirection.setMag(InputManager.sepFactor/sqrt(aimedDirection.mag()));
            this.steering.add(aimedDirection);

        }
    }



    separationAligmentCohesion()  // *!*
    {
        let detectedSeparation=0;
        let detectedAlignment=0;
        let detectedCohesion=0;
        let aimedDirection=new p5.Vector(0,0);
        let aimedDirection2=new p5.Vector(0,0);

        let midPosition=new p5.Vector(0,0);
        let aimedDirection3=new p5.Vector(0,0);

        for(let b of boids)
        {
            if(this!=b)
            {
                if (this.position.dist(b.position)<25)
                {
                    aimedDirection.add(p5.Vector.sub(this.position,b.position));
                    detectedSeparation++;
                }
                if(this.position.dist(b.position)<this.sense)
                {
                    aimedDirection2.add(b.velocity);
                    midPosition.add(b.position);
                    detectedAlignment++;
                    detectedCohesion++;
                }
            }
            else
            {
                if (this.position.dist(b.position)<this.sense)
                {
                    midPosition.add(b.position);
                    detectedCohesion++;
                }
            }
        }

        if(detectedSeparation>0)
        {
            aimedDirection.div(detectedSeparation);
            this.drawSeparation(aimedDirection);
            aimedDirection.setMag(InputManager.sepFactor/sqrt(aimedDirection.mag()));
            this.steering.add(aimedDirection);

        }

        if(detectedAlignment>0)
        {
            this.nConnected=detectedAlignment;
            aimedDirection2.div(detectedAlignment);
            aimedDirection2.setMag(InputManager.aliFactor);
            this.steering.add(aimedDirection2);
            this.drawAlignment(aimedDirection2);
        }
        else
        {
            this.nConnected=0;
        }

        if (detectedCohesion>1)
        {
            midPosition.div(detectedCohesion);
            this.drawCohesion(midPosition);
            aimedDirection3=midPosition.sub(this.position);
            aimedDirection3.setMag(InputManager.cohFactor);
            this.steering.add(aimedDirection3);
        }
    }


    limitSpeed()
    {
        if (this.velocity.mag()>this.maxVel)
        {
            this.velocity.limit(this.maxVel);
        }
    }
    pacmanEffect()
    {
        if (this.position.x>width)
        {
            this.position.x=0;
        }
        else if(this.position.x<0)
        {
            this.position.x=width;
        }

        if(this.position.y>height)
        {
            this.position.y=0;
        }
        else if(this.position.y<0)
        {
            this.position.y=height;
        }
    }

    setLeader()
    {
        if (this.timerLeader<1000)
        {return;}

        this.timerLeader=0;
        if(InputManager.colorationMode==0)
        {
            let leaderPosCenter=p5.Vector.add(this.position,this.velocity.copy().setMag(10));
            let leaderPosRight=p5.Vector.add(leaderPosCenter,this.velocity.copy().setMag(10).rotate(PI/2.0).mult(3));
            let leaderPosLeft=p5.Vector.add(leaderPosCenter,this.velocity.copy().setMag(10).rotate(-PI/2.0).mult(3));

            let leaderPosRight2=p5.Vector.add(leaderPosRight,this.velocity.copy().setMag(30));
            let leaderPosLeft2=p5.Vector.add(leaderPosLeft,this.velocity.copy().setMag(30));

            this.isLeader=true;
            for(let b of boids)
            {
                if (this!=b)
                {
                    if (this.nConnected>0)
                    {
                        if(b.position.dist(leaderPosLeft)<63.20 && b.position.dist(leaderPosRight)<63.20 && b.position.dist(leaderPosLeft2)<63.20 && b.position.dist(leaderPosRight2)<63.20 )
                        {
                            this.isLeader=false;
                            break;
                        }
                    }
                    else
                    {
                        this.isLeader=false;
                        break;
                    }

                }

            }
            if (this.isLeader)
            {
                let toAdd=true;

                this.color=color(InputManager.colorPickers[0].value);

                for (let l in leaders)
                {
                    if (this==leaders[l])
                    {
                        toAdd=false;
                        break;
                    }
                }
                if (toAdd)
                {
                    leaders.push(this);
                }
            }
            else
            {
                

                for (let l in leaders)
                {
                    if (this==leaders[l])
                    {
                        leaders.splice(l);
                    }
                }

            }
        }
    }
    
    coloration()
    {
        switch(InputManager.colorationMode)
        {
            case 0:
                if (!this.isLeader)
                {
                    let leaderDist=1000;
                    let leaderIndex=1000;
                    for (let li in leaders)
                    {
                        let tmpDist=this.position.dist(leaders[li].position);
                        if (tmpDist<leaderDist)
                        {
                            leaderDist=tmpDist;
                            leaderIndex=li;
                        }
                    }
                    if (leaders.length>0 && leaderIndex!=1000)
                    {
                        let r=red(leaders[leaderIndex].color);
                        let g=green(leaders[leaderIndex].color);
                        let b=blue(leaders[leaderIndex].color);
                        
                        if (r<50){r=50;}
                        if (g<50){g=50;}
                        if (b<50){b=50;}


                        if (r>=g && r>=b)
                        {
                            
                            r=(r*(maxDC-leaderDist))/maxDC;
                            g=(g*(leaderDist))/30;
                        }
                        else if(g >r && g>b)
                        {
                            g=(g*(maxDC-leaderDist))/maxDC;
                            r=(r*(leaderDist))/30;
                        }
                        else if(b>r && b>g)
                        {
                            b=(b*(maxDC-leaderDist))/maxDC;
                            g=(g*(leaderDist))/25;
                        }

                        if (r<50){r=50;}
                        if (g<50){g=50;}
                        if (b<50){b=50;}
                        this.colorToChange=color(r,g,b);
                        this.color=lerpColor(this.color,this.colorToChange,0.1);
                    }

                }
                break;
            case 1:
                if (!this.death)
                {
                    let gradientH=height;
                    let r=red(InputManager.gradients[0])*(this.position.y/gradientH)+(red(InputManager.gradients[1])*((gradientH-this.position.y)/gradientH));
                    let g=green(InputManager.gradients[0])*(this.position.y/gradientH)+(green(InputManager.gradients[1])*((gradientH-this.position.y)/gradientH));
                    let b=blue(InputManager.gradients[0])*(this.position.y/gradientH)+(blue(InputManager.gradients[1])*((gradientH-this.position.y)/gradientH));

                    this.color=color(r,g,b);
                }
                break;
        }
    }

    avoid()
    {
        if (InputManager.avoidBehavior())
        {
        
            if (!this.avoidingArgs[0])
            {
                if(this.checkCollision())
                {
                    this.avoidingArgs[0]=true;
                    this.avoidingArgs[2]=this.velocity.copy().reflect(this.avoidingArgs[2]);
                    this.velocity.reflect(this.avoidingArgs[2]);
                }
            }
            else
            {
                this.velocity.setMag(this.avoidingArgs[1]);
                this.timerAvoiding+=deltaTime/1000;
                if (this.timerAvoiding>=0.1)
                {
                    this.timerAvoiding=0;
                    this.avoidingArgs[0]=false;
                }
            }

            if (InputManager.obstacleButtons[1].checked)
            {
                if ((this.velocity.x>0 && this.position.x>(width-50)) || (this.velocity.x<0 && this.position.x<(50)) )
                {
                    this.velocity.x=-this.velocity.x;
                }

                if ((this.velocity.y<0 && this.position.y<50) || (this.velocity.y>0 && this.position.y>(height-50)) )
                {
                    this.velocity.y=-this.velocity.y;
                }
            }
        }
    }

    checkCollision()
    {

        stroke(0,255,0);
        let visionVelRight=this.velocity.copy().setMag(100);
        let visionVelLeft=this.velocity.copy().setMag(100);
        visionVelRight.rotate(0.348);
        visionVelLeft.rotate(-0.348);
        for (let o of obstacles)
        {
            if (this.position.dist(o.position)-o.r < 100)
            {
                let angle=this.velocity.angleBetween(p5.Vector.sub(o.position,this.position));

                if (angle>=-0.348 && angle <0) // PI/4
                {
                    stroke(255,0,0);
                    let nor=p5.Vector.sub(this.position,o.position).rotate(-1.78);
                    this.avoidingArgs[1]=this.velocity.mag();

                    this.avoidingArgs[2]=nor;
                    return true;
                }
                else if (angle>=0 && angle<=0.348)
                {
                    stroke(255,0,0);
                    let nor=p5.Vector.sub(this.position,o.position).rotate(1.78);
                    this.avoidingArgs[1]=this.velocity.mag();

                    this.avoidingArgs[2]=nor;
                    return true;
                }
            }
        }

        return false;
    }

    drawSense()
    {
        if (InputManager.viewerSense.checked)
        {
            stroke(0,255,0,50);
            circle(this.position.x,this.position.y,this.sense);
        }
    }
    drawCohesion(midPointToDraw)
    {
        if (InputManager.viewerCoh.checked && InputManager.cohFactor!=0)
        {
            stroke(255,0,0);
            circle(midPointToDraw.x,midPointToDraw.y,10);
            cohesionData.push([this.position.x,this.position.y,midPointToDraw.x,midPointToDraw.y]);
            // line(this.position.x,this.position.y,midPointToDraw.x,midPointToDraw.y);
        }
    }
    drawAlignment(pointToDraw)
    {
        if (InputManager.viewerAli.checked && InputManager.aliFactor!=0)
        {
            pointToDraw.normalize();
            stroke(0,255,0);
            line(this.position.x,this.position.y,this.position.x+pointToDraw.x*20,this.position.y+pointToDraw.y*20);
        }
    }
    drawSeparation(pointToDraw)
    {
        if (InputManager.viewerSep.checked  && InputManager.sepFactor!=0)
        {
            pointToDraw.setMag(20);
            stroke(0,0,255);
            line(this.position.x,this.position.y,this.position.x+pointToDraw.x,this.position.y+pointToDraw.y);
        }
    }
    die()
    {
        this.color.setAlpha(255-((255/1500.0)*this.deathTime));
        this.position.y+=0.5;
        this.deathTime+=deltaTime;

        if (InputManager.audioButton.checked)
        {
            let volume=(1.0 * (nPrey/100.0));
            audio[0].setVolume(volume);
            if (boids.length==2 && this instanceof Predator==false)
            {
                audio[0].stop();
            }
            else if (boids.length==1)
            {
                audio[0].stop();
                audio[1].stop();
            }
        }
    }
}

class Predator extends Boid
{
    constructor(posX,posY)
    {
        super(posX,posY);
        this.maxVel=3;
        this.isAttacking=false;
        this.sense=200;
        this.lastLuncheon=0;
    }
    update()
    {
        this.separation();
       // this.alignment();
        this.cohesion();

        this.velocity.add(this.steering);
        this.position.add(this.velocity);
        
        this.pacmanEffect();

        this.steering=new p5.Vector(0,0);
        this.limitSpeed();


        this.avoid();

        this.setLeader();


        this.timerLeader+=deltaTime;
        this.lifeTime+=deltaTime/1000.0


        for (let b in boids)
        {
            if (boids[b] instanceof Predator==false)
            {
                if (p5.Vector.dist(boids[b].position,this.position)<10 && boids[b].death==false)
                {
                    boids[b].death=true;
                    nPrey--;
                    this.lastLuncheon=0;
                    break;
                }
            }
        }


        if (this.lastLuncheon>15000)
        {
            this.death=true;
            predators.pop();
        }
        this.lastLuncheon+=deltaTime;


    }

    separation()
    {
        let detected=0;
        let aimedDirection=new p5.Vector(0,0);
        for(let b of boids)
        {
            if(this!=b && b instanceof Predator && this.position.dist(b.position)<25)
            {
                aimedDirection.add(p5.Vector.sub(this.position,b.position));
                detected++;
            }
        }

        if(detected>0)
        {
            aimedDirection.div(detected);
            this.drawSeparation(aimedDirection);
            aimedDirection.setMag(InputManager.sepFactor/sqrt(aimedDirection.mag()));
            this.steering.add(aimedDirection);

        }
    }

    coloration()
    {

    }

    die()
    {
        super.die();
        if (predators.length==0)
        {
            audio[1].stop();
        }
    }
}
