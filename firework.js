function Firework(N, Sigma, color) {
    // console.log(color);
    
    this.explode = false;
    this.done = false;
    this.N = N;
    this.Sigma = Sigma;
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.heart = (random() < 0.1)? true:false;
    this.big_heart = this.heart? ((random()<0.08)? true:false) : false;
    this.particles = [];
    if(this.big_heart) {
        this.particles.push(new Particle(width/2, height, true, [250,0,0]));
        // console.log("ONE: "+this.heart);
    } else {
        this.particles.push(new Particle(random(width), height, true, color));
    }
    
    this.update = function() {
        if(!this.explode){
            this.particles.forEach(p => {
                p.applyForce(createVector(0,p.gravity));
                p.update();
                if(p.vel.magSq() < 0.01) {
                    this.explode = true;
                    this.x = p.pos.x;
                    this.y = p.pos.y;
                    this.particles = [];
                    let N_part = random(this.N-this.Sigma, this.N+this.Sigma);
                    let scale = Math.random()*0.15+0.05;
                    for(var i=0; i < N_part; i++) {
                        let aux = new Particle(this.x, this.y, false, this.color);
                        if(this.heart) {
                            let t = i*6.2832/N_part;
                            aux.vel.x = 16*(Math.pow(Math.sin(t), 3));
                            aux.vel.y = -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
                            if(this.big_heart){
                                aux.vel.mult(0.1);
                                aux.BH = true;
                                aux.color = [250,0,0];
                                aux.gravity = 0.00003*height;
                                // console.log("YEAHH");
                            } else {
                                aux.vel.mult(scale);
                            }
                        }
                        this.particles.push(aux);
                    }
                }
            });
        } else {
            // console.log(this.N);
            this.done = true;
            this.particles.forEach(p => {
                if(p.opacity > 0) {
                    p.applyForce(createVector(0,p.gravity));
                    p.update()
                    this.done = false;
                }
            });
        }
    }

    this.show = function() {
        this.particles.forEach(p => {
            p.show();
        });
    }
}

function Particle(x, y, random_vel, color) {
    this.n_path = 5;

    this.old_pos = [];
    this.opacity = 30;
    this.pos = createVector(x, y);
    this.origin = this.pos.copy();
    this.acc = createVector(0, 0);
    this.rnd_vel = random_vel;
    this.color = color;
    this.BH = false;
    this.gravity = 0.00015*height;
    

    if(this.rnd_vel){
        this.vel = createVector(0, (random()*(0.0035) - 0.0175)*height);
    } else {
        this.vel = p5.Vector.random2D().mult(random(0.2,3));
    }

    // for(var i=0; i < this.n_path; i++) {
    //     this.old_pos.push(this.pos.copy());
    // }

    this.applyForce = function(force) {
        this.acc = force;
    };

    this.update = function() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        if(this.origin) {
            if(!this.BH){
                let aux = dist(this.origin.x, this.origin.y, this.pos.x, this.pos.y);
                this.opacity = map(aux,0,200,255,0);
            } else {
                let aux = dist(this.origin.x, this.origin.y, this.pos.x, this.pos.y);
                this.opacity = map(aux,0,1000,255,0);
            }
        }
        // this.old_pos.push(this.pos.copy());
        // this.old_pos.shift();
        // console.log(parent.x);
    }

    this.show = function() {
        // for(var i=0; i < this.n_path-1; i++) {
        //     stroke(255,255,255,((i+1)*255/this.n_path)*(this.opacity/255));
        //     line(this.old_pos[i].x, this.old_pos[i].y, this.old_pos[i+1].x, this.old_pos[i+1].y);
        // }
        stroke(this.color[0],this.color[1],this.color[2],this.opacity);
        if(this.BH) {
            strokeWeight(3);
        } else{
            strokeWeight(2);
        }
        point(this.pos.x, this.pos.y);
        
    }
}