const tl = new TimelineMax();

const plant = document.querySelectorAll('.plant');
const leafs = document.querySelectorAll('.leaf');
const body = document.getElementsByTagName('body');
const pot = document.getElementById('Pot');
const flower = document.getElementById('flower');
const stem = document.getElementById('stem');

tl.set(body, {backgroundColor: '#111'});

tl.from(pot, 1, {y: -500})
  .addLabel('lightsOn')
  .to(body, 1, { backgroundColor: '#EFD0B1'})
  .addLabel('grow')
  .from(stem, 1.5, { ease: Power4.easeOut, scaleY: 0, transformOrigin: '50% 100%' })
  .staggerFromTo(leafs, 1, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1}, 1)
  .staggerFromTo(flower.children, .8, 
    {scale: 0.7, opacity: 0},
    {scale: 1, opacity: 1},
    .3
  )
