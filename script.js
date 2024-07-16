const programArr = [
(processingInstance) => {
with (processingInstance) {
  size(700, 600, P2D);
  frameRate(60);
  smooth();

  textAlign(CENTER, CENTER);
  textSize(25);
  strokeCap(PROJECT);

  //the tree object
  let tree;

  //used to keep track of the rotation
  let theta = 0;

  //used for controlling the animation
  let len = 0;

  //determines if the user is currently dragging the mouse
  let dragging = false;

  //define the tree object/properties
  tree = {
      x: 0,
      y: 0,
      len: 100,
      depth: 6,
      angle: -90,
      nodes: [],
      colors: {
          from: color(59, 39, 8),
          to: color(145, 108, 49),
          flowers: [
              [230, 80, 105],
              [80, 105, 230],
              [220, 210, 30],
              [180, 60, 220],
              [205, 130, 45],
          ]
      },
      flowerColor: [230, 80, 105]
  };

  //the recursive function (will be called from within itself)
  const addBranch = (depth, angle, len, node) => {

      //if the depth is zero then end the recursion
      if(depth <= 0) {
          return;
      }

      //calculate the end points of the branch
      const x = node.x + cos(angle*Math.PI/180) * len;
      const y = node.y + sin(angle*Math.PI/180) * len;
      const endDepth = (depth === tree.depth ? 1 : random(-(15 * depth), (15 * depth)) | 0);
      const z = node.z + (depth === tree.depth ? 1 : endDepth | 0);

      //add the branch
      tree.nodes.push({
          type: "branch",
          previousNode: node,
          x: x,
          y: y,
          z: z,
          depth: depth,
          color: lerpColor(tree.colors.from, tree.colors.to, map(depth, tree.depth, 1, 0, 1))
      });

      const previousNode = tree.nodes[tree.nodes.length - 1];

      //add some random leaves to the branches
      if(depth > 0 && depth < tree.depth - 3 && random() < 0.3) {
          for(let i = 0; i < 2; i++) {
              const percent = random(0.1, 0.9);
              const l = len * percent;
              const tx = node.x + cos(angle*Math.PI/180) * l;
              const ty = node.y + sin(angle*Math.PI/180) * l;
              tree.nodes.push({
                  type: "leaf",
                  x: tx,
                  y: ty,
                  z: node.z + endDepth * percent,
                  diameter: random(5, 10),
                  color: color(random(80, 100), random(150, 180), random(90, 110)),
                  angle: random(angle - 60, angle + 60)
              });
          }
      }

      //add some random flowers to the end of the branches
      if(depth === 1 && random() < 0.5 || depth === 2 && random() < 0.3) {
          tree.nodes.push({
              type: "flower",
              x: x,
              y: y,
              z: z,
              depth: depth,
              diameter: depth === 1 ? random(15, 25) : random(10, 15),
              color: color(
                  random(tree.flowerColor[0] - 25, tree.flowerColor[0] + 25), 
                  random(tree.flowerColor[1] - 25, tree.flowerColor[1] + 25), 
                  random(tree.flowerColor[2] - 25, tree.flowerColor[2] + 25)),
              angle: angle
          });
      }

      //reduce the depth (extremely important to end your recursion)
      depth--;

      //call this function recursively
      addBranch(depth, angle - random(10, 50), len * random(0.75, 0.85), previousNode);
      addBranch(depth, angle + random(10, 50), len * random(0.75, 0.85), previousNode);
      addBranch((depth - (random() < 0.5 ? 0 : 1)), angle + random(-30, 30), len * random(0.75, 0.85), previousNode);
  };

  // Rotate shape around the y-axis
  // this function based on KA lesson on rotating 3D shapes
  const rotateY3D = (theta) => {
      const sinTheta = sin(theta*Math.PI/180);
      const cosTheta = cos(theta*Math.PI/180);

      for(let i = 0; i < tree.nodes.length; i++) {
          const node = tree.nodes[i];

          const x = node.x;
          const z = node.z;
          node.x = x * cosTheta + z * sinTheta;
          node.z = z * cosTheta - x * sinTheta;
      }
  };

  const createTree = () => {
      //call the recusive function to genereate branches and random leaves/flowers
      addBranch(tree.depth, tree.angle, tree.len, {x: tree.x, y: tree.y, z: 0});
  };

  //create a new tree
  createTree();

  draw = function() {
      background(230, 226, 202);

      //draw shadow underneath the tree
      noStroke();
      fill(50, 30);
      ellipse(350, 505, 200, 34);
      //show spikes on the ground to help show current direction
      stroke(90, 165, 100, 70);
      strokeWeight(4);
      for(let i = 0; i < 10; i++) {
          line(
              350  + sin((theta + i * 36)*Math.PI/180) * 100, 
              505 - 2 + cos((theta + i * 36)*Math.PI/180) * 17, 
              350 + sin((theta + i * 36)*Math.PI/180) * 100, 
              505 - 5 + cos((theta + i * 36)*Math.PI/180) * 17);
      }

      //update len to control the animation of nodes being drawn
      len = constrain(len + 1, 0, tree.nodes.length);

      pushMatrix();
          translate(350, 500);

          //loop through all the tree nodes
          for(let i = 0; i < len; i++) {
              //get the current node
              const node = tree.nodes[i];

              //determine what type of node (branch, leaf, flower)
              switch(node.type) {
                  case "branch":
                      //set the stroke opacity based on the branch depth
                      stroke(node.color, 50 + node.depth * 35);

                      //set the stroke thickness based on the branch depth
                      strokeWeight(1 + node.depth);

                      //draw the branch
                      // line(node.x1, node.y1, node.x, node.y);
                      line(node.previousNode.x, node.previousNode.y, node.x, node.y);
                      break;
                  case "leaf":
                      //draw the leaf
                      noStroke();
                      fill(node.color);
                      ellipse(node.x, node.y, node.diameter, node.diameter);
                      break;
                  case "flower":
                      //draw the flower
                      noStroke();
                      fill(node.color);
                      ellipse(node.x, node.y, node.diameter, node.diameter);
                      break;
              }
          }
      popMatrix();

      //only show the instructions once the tree has been fully drawn
      fill(50, 70);
      if(len === tree.nodes.length) {
          //display instruction to drag to rotate manually
          text("luôn tích cực dù ở bất kì hướng nào nha", 350, 30);
      }

      //display instructions to click for new tree
      text("bấm vô để tạo cái mới nee", 350, 570);

      //if the user is dragging the mouse and all the nodes are drawn
      if(!dragging && len === tree.nodes.length) {
          //perform a new sort so closer nodes are drawn last
          tree.nodes.sort(function(a, b) {
              return a.z - b.z;
          });

          //rotate automatically
          theta+= 0.5;
          rotateY3D(0.5);
      }
  };

  mouseReleased = () => {
      //release the drag so it rotates automatically
      dragging = false;
  };

  mouseDragged = () => {
      if(len === tree.nodes.length) {
          //specify that you are dragging the mouse
          dragging = true;

          //perform a new sort so closer nodes are drawn last
          tree.nodes.sort(function(a, b) {
              return a.z - b.z;
          });

          //rotate the tree when you drag the mouse
          theta+= mouseX - pmouseX;
          rotateY3D(mouseX - pmouseX);
      }
  };

  mouseClicked = () => {
      //clear out the existing nodes
      tree.nodes.length = 0;

      //reset the animation of the tree
      len = 0;

      //randomly set a random angle for the main trunk
      tree.angle = random(-100, -80);

      //randomly select a different color palette
      tree.flowerColor = tree.colors.flowers[random(tree.colors.flowers.length) | 0];

      //create a new tree
      createTree();
  };
}
}];

const programElements = document.getElementsByClassName("program");

let processingInstance;

Array.prototype.forEach.call(programElements, (item, index) => {
    processingInstance = new Processing(item, programArr[index]);
});
