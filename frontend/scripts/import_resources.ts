import { bibleMapsData } from '../src/app/bible-resources/maps/data';
import { bibleInfographicsData } from '../src/app/bible-resources/infographics/data';
import { bibleGenealogiesData } from '../src/app/bible-resources/genealogies/data';
import { missionaryData } from '../src/app/bible-resources/missionary-story/data';

const API_URL = 'http://127.0.0.1:8000/api/content-items/';

async function postData(title: string, pageCategory: string, section: string, links: any[], imageUrl: string) {
  const payload = {
    title,
    page_category: pageCategory,
    section,
    links,
    image_url: imageUrl || '',
    is_active: true
  };
  
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Token aa9e1cf61a1099e2b9332a5c015724abfa52dfc3'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
     console.error(`Failed to post ${title}:`, await res.text());
  } else {
     console.log(`Successfully posted: [${pageCategory}] ${title}`);
  }
}

async function run() {
  console.log('Starting import...');
  
  // Maps
  for (const group of bibleMapsData) {
    for (const item of group.items) {
      await postData(item.title, 'Bible Maps', group.title, item.links, '');
    }
  }
  
  // Infographics
  for (const group of bibleInfographicsData) {
    for (const item of group.items) {
      await postData(item.title, 'Bible Infographics', group.title, item.links, '');
    }
  }
  
  // Genealogies
  for (const group of bibleGenealogiesData) {
    for (const item of group.items) {
      await postData(item.title, 'Bible Genealogies', group.title, item.links, '');
    }
  }
  
  // Missionary Stories
  for (const [index, item] of missionaryData.entries()) {
     let title = 'Missionary Story ' + (index + 1);
     let filename = item.image.split('/').pop() || '';
     if (filename) {
         title = decodeURIComponent(filename).replace('-scaled.jpg', '').replace('.jpg', '');
     }
     
     let links = [];
     if (item.link) {
         links.push({text: 'PDF', url: item.link});
     }
     
     await postData(title, 'Missionary Stories', 'Stories', links, item.image);
  }

  console.log('Finished importing all resources!');
}

run();
