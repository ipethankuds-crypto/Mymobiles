const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const assets = [
  {
    url: 'https://i0.wp.com/joserenenavarro.blog/wp-content/uploads/2026/04/Screenshot-2026-04-24-111158-2-e1788370710391.jpg?fit=300%2C375&ssl=1',
    dest: 'jose-headshot.jpg'
  },
  {
    url: 'https://i0.wp.com/joserenenavarro.blog/wp-content/uploads/2026/04/Logo.webp?fit=600%2C600&ssl=1',
    dest: 'logo.webp'
  },
  {
    url: 'https://i0.wp.com/joserenenavarro.blog/wp-content/uploads/2026/08/AI_Proofly_Level_1_same_size_no_bars.webp?fit=800%2C1200&ssl=1',
    dest: 'proofly-level1.webp'
  },
  {
    url: 'https://i0.wp.com/joserenenavarro.blog/wp-content/uploads/2026/08/AI_Proofly_Level_2_same_size.webp?fit=800%2C1200&ssl=1',
    dest: 'proofly-level2.webp'
  },
  {
    url: 'https://i0.wp.com/joserenenavarro.blog/wp-content/uploads/2026/08/Benefits-2.webp?fit=768%2C1152&ssl=1',
    dest: 'benefits.webp'
  },
  {
    url: 'https://i0.wp.com/joserenenavarro.blog/wp-content/uploads/2026/08/Birthday-Saint-Finder-App-Flyer.webp?fit=683%2C1024&ssl=1',
    dest: 'saint-finder.webp'
  },
  {
    url: 'https://i0.wp.com/joserenenavarro.blog/wp-content/uploads/2026/08/ChatGPT-Image-Aug-18-2026-01_04_36-AM.webp?fit=800%2C600&ssl=1',
    dest: 'project-dashboard.webp'
  }
];

const targetDir = 'C:/Users/losik/.gemini/antigravity/scratch/my-mobile-apps-demo/assets';

function download(item) {
  return new Promise((resolve) => {
    const filePath = path.join(targetDir, item.dest);
    const file = fs.createWriteStream(filePath);
    const client = item.url.startsWith('https') ? https : http;

    client.get(item.url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${item.dest}`);
          resolve(true);
        });
      } else {
        console.error(`Failed ${item.dest}: HTTP ${res.statusCode}`);
        file.close();
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${item.dest}:`, err.message);
      file.close();
      resolve(false);
    });
  });
}

(async () => {
  for (const a of assets) {
    await download(a);
  }
  console.log('All downloads completed.');
})();
