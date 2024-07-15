console.clear();

const scene = document.querySelectorAll('.scene')[0];
let maxFlowers = window.innerWidth * .01;
let colors = ['crimson', '#3498db', '#e67e22', '#f1c40f', '#9b59b6'];
let bees = [];

const randomInRange = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

class Flower {
	constructor(x, height, color) {
		this.x = x;
		this.height = height;
		this.color = color;
		this.el;
		this.create();
	}
	
	create() {
		this.el = document.createElement('div');
		this.el.classList.add('flower');
		this.el.style.left = `${this.x}%`;
		this.el.style.height = `${this.height}vmin`;
		
		let flowerHead = document.createElement('div');
		flowerHead.classList.add('flowerhead');
		flowerHead.style.background = this.color;
		
		this.el.appendChild(flowerHead);
		scene.appendChild(this.el);
	}
}


class Bee {
	constructor(x, y, cursorX, size) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.cursorX = cursorX;
		this.moving = true;
		this.el;
		this.create();
	}
	
	create() {
		let head = document.createElement('div');
		head.classList.add('head');
		this.el = document.createElement('div');
		this.el.appendChild(head);
		this.el.classList.add('bee');
		// Math.random() < 0.5 ? this.el.classList.add('bee--left') : this.el.classList.add('bee--right');
		this.el.style.width = `${this.size}px`;
		this.el.style.height = `${this.size*.7}px`;
		this.el.style.top = `${this.y}px`;
		this.el.style.left = `${this.x}px`;
		document.body.appendChild(this.el);
		
		this.fly();
		this.loop();
	}
	
	fly() {
		const self = this;
		let flowers = document.querySelectorAll('.flower');
		let target = flowers[Math.floor(Math.random() * flowers.length)];
		let targetHead = target.querySelectorAll('.flowerhead')[0];
		let targetLeft = targetHead.offsetLeft + target.offsetLeft,
				targetTop = targetHead.offsetTop + target.offsetTop,
				targetRight = targetLeft + targetHead.offsetWidth,
				targetBot = targetTop + targetHead.offsetHeight;
		
		let moveTo = {};
		moveTo.x = randomInRange(targetLeft, targetRight) - this.size / 2;
		moveTo.y = randomInRange(targetTop, targetBot) - this.size / 2;
		
		console.log(moveTo.x);
		console.log(this.cursorX);
		if (moveTo.x > this.cursorX) this.el.classList.add('bee--right');
		
		TweenMax.to(this.el, 4, {
			left: moveTo.x,
			top: moveTo.y,
			ease: Power4.easeOut,
			onComplete: function() {
				self.moving = false;
			}
		});
	}
	
	loop() {
		setTimeout(() => {
			this.loop();
		}, 1000);
		if (this.moving) return;
		Math.random() < 0.5 ? this.el.classList.add('bee--right') : this.el.classList.remove('bee--right');
	}
}


/* create flowers */
document.addEventListener("DOMContentLoaded", function() {
	for (let i = 0; i < maxFlowers; i++) {
		let x = randomInRange(0, 100);
		let height = randomInRange(15, 25);
		let color = colors[Math.floor(Math.random() * colors.length)];
		let flower = new Flower(x, height, color);
	}
	
	/* add some bees for demonstration */
	let i = 0;
	const createStartingBees = () => {
		let size = randomInRange(20, 100);
		let x = randomInRange(0, window.innerWidth);
		let y = randomInRange(0, window.innerHeight / 2);
		let bee = new Bee((x - size / 2), (y - size / 2), x, size);
		bees.push(bee);
		
		setTimeout(() => {
			i++;
			if (i < 6) createStartingBees();
		}, 250);
	}
	setTimeout(() => {
		createStartingBees();
	}, 250);
});


/* add some 🐝 */
document.addEventListener('click', function(e) {
	let size = randomInRange(20, 100);
	let bee = new Bee((e.clientX - size / 2), (e.clientY - size / 2), e.clientX, size);
	bees.push(bee);
});

/* remove the 🐝 */
window.addEventListener('resize', function() {
	bees.forEach((bee, i) => {
		bee.el.remove();
		bees.splice(i, 1);
	});
});
