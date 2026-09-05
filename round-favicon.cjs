const Jimp = require('jimp');

async function makeRound() {
  const image = await Jimp.read('public/favicon.png');
  image.circle();
  await image.writeAsync('public/favicon.png');
  console.log('Favicon made round!');
}

makeRound().catch(console.error);
