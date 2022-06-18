class Obstacle
{
    constructor(posX,posY)
    {
        this.position=new p5.Vector(posX,posY);
        this.size=50;
        this.id=0        //0=mouse,1=walls,2=point,3=rect
        this.color=color(255);
        this.r=this.size/2.0;
    }

    draw()
    {
        if (this.id==0)
        {
            this.position.x=mouseX;
            this.position.y=mouseY;
        }
        stroke(this.color);
        circle(this.position.x,this.position.y,this.size);
    }
}