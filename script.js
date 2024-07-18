const POT_BOTTOM_Y = 585;
const POTS_TIMES = [
{
  duration: 0.5 + Math.random() * 0.3,
  delay: 0 },

{
  duration: 0.5 + Math.random() * 0.3,
  delay: 0.5 },

{
  duration: 0.5 + Math.random() * 0.3,
  delay: 0.2 }];


const masterTimeline = new TimelineMax();

const potsTimeline = [...document.querySelectorAll('.pot')].map((pot, i) => {
  const timeline = new TimelineMax();

  timeline.from(
  pot,
  POTS_TIMES[i].duration,
  {
    delay: POTS_TIMES[i].delay,
    y: -POT_BOTTOM_Y });



  return timeline;
});
const shadowsTimeline = [...document.querySelectorAll('.pot-shadow')].map((shadow, i) => {
  const timeline = new TimelineMax();

  timeline.from(
  shadow,
  POTS_TIMES[i].duration,
  {
    ease: Power0.easeInOut,
    delay: POTS_TIMES[i].delay,
    scale: 0,
    transformOrigin: 'center center' });



  return timeline;
});
const leafsTimeline = [...document.querySelectorAll('.leaf')].map(leaf => {
  const isBack = leaf.classList.contains('leaf-back');

  const timeline = new TimelineMax();

  timeline.from(
  leaf,
  0.5 + Math.random() * 0.8,
  {
    delay: isBack ? 0.5 : 0,
    ease: Back.easeOut.config(0.5 + Math.random()),
    scale: 0,
    yPercent: 10 * Math.random(),
    transformOrigin: 'center bottom' });



  return timeline;
});
const flowersTimeline = [...document.querySelectorAll('.flower')].map(flower => {
  const isLeft = flower.classList.contains('flower-left');

  const timeline = new TimelineMax();

  timeline.from(
  flower,
  1 + Math.random() * 1,
  {
    ease: Circ.easeOut,
    scale: 0,
    transformOrigin: isLeft ? 'right bottom' : 'left bottom' });



  return timeline;
});

masterTimeline.
to('.replay-text', 0, { opacity: 0 }).
add(potsTimeline, 0).
add(shadowsTimeline, 0).
add(leafsTimeline).
add(flowersTimeline).
to('.replay-text', .5, { opacity: 1 });



document.body.addEventListener('click', () => {
  if (!masterTimeline.isActive()) {
    masterTimeline.restart();
  }
});