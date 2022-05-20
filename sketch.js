fireworks = [];
n_fireworks = 30;
n_particles = 50;
sigma_particles = 10;
colors = [[236,236,116],[171, 103, 231],[108, 51, 240],[238, 57, 57]]

function setup() {
    createCanvas(windowWidth,windowHeight);
    background(0);
    // frameRate(10);
    // console.log();
    stroke(255);
    strokeWeight(2);
    // noLoop();
    // noStroke();
}

function draw() {
    background(0);
    if(random() < 0.1)  {
        if(fireworks.length < n_fireworks) {
            fireworks.push(new Firework(n_particles, sigma_particles, colors[Math.floor(random(0,4))]));
        } else {
            fireworks.sort((a,b) => (a.done & !b.done)? -1 : ((b.done & !a.done)? 1:0))
            if(fireworks[0].done){
                fireworks.shift();
                fireworks.push(new Firework(n_particles, sigma_particles, colors[Math.floor(random(0,4))]));
            }
        }
    }
    fireworks.forEach(fw => {
        if(!fw.done) {
            fw.update()
            fw.show();
        } else {
        }
    });

}

// function mousePressed() {
//     noLoop();
// }