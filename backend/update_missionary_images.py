import os
import django
import sys
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pages.models import ContentItem

missionaryData = [
  {
    "image": "/wp-content/uploads/2026/04/అగస్టీన్--scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/అగస్టీన్-సాలిన్స్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/అదోనిరామ్-జడ్సన్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/అమీకార్-మైఖెల్--scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/అలెన్-గార్డెనర్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-18-at-11.11.44-AM-1.jpeg",
    "link": "/wp-content/uploads/2026/03/ఆర్.ఆర్.కె.మూర్తి-గారు.pdf"
  },
  {
    "image": "/wp-content/uploads/2026/04/ఎలెన్-ఆర్నాల్డ్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-18-at-11.11.44-AM-2.jpeg",
    "link": "/wp-content/uploads/2026/03/ఐడా-స్కడ్డర్-జీవితచరిత్ర.pdf"
  },
  {
    "image": "/wp-content/uploads/2026/04/గ్రీన్-లారెన్స్-వార్టన్--scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/చార్లెస్-ఫిన్ని-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/చార్లెస్-స్పర్జన్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/జాన్-పేటన్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-18-at-11.11.44-AM.jpeg",
    "link": "/wp-content/uploads/2026/03/జాన్-వెస్లీ-1.pdf"
  },
  {
    "image": "/wp-content/uploads/2026/04/జాన్-హైడ్--scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/జార్జ్-విట్-ఫీల్డ్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/జార్జ్-విలియమ్స్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/డి.యల్.-మూడీ-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/డేవిడ్-బ్రెయినార్డ్--scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/పండిత-రమాబాయి--scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/రావూరి-రంగయ్య-లక్ష్మయ్య-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/విలియం-టిండేల్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/విల్-ఫ్రెడ్-గ్రెన్-ఫెల్--scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/శామ్యూల్-రూథర్-ఫోర్డ్--scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/సామ్యూల్-మోరిస్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/సెయింట్-బోనిఫేస్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/స్మిత్-విగ్గిల్స్-వర్త్-scaled.jpg",
    "link": ""
  },
  {
    "image": "/wp-content/uploads/2026/04/హడ్సన్-టేలర్-scaled.jpg",
    "link": ""
  }
]

for item in missionaryData:
    title = item['image'].split('/')[-1].replace('-scaled.jpg', '').replace('.jpg', '').replace('.jpeg', '')
    if title == 'WhatsApp-Image-2026-03-18-at-11.11.44-AM-1':
        title = 'WhatsApp-Image-2026-03-18-at-11.11.44-AM-1.jpeg'
    elif title == 'WhatsApp-Image-2026-03-18-at-11.11.44-AM-2':
        title = 'WhatsApp-Image-2026-03-18-at-11.11.44-AM-2.jpeg'
    elif title == 'WhatsApp-Image-2026-03-18-at-11.11.44-AM':
        title = 'WhatsApp-Image-2026-03-18-at-11.11.44-AM.jpeg'
    
    pass #('Updating', title)
    try:
        db_item = ContentItem.objects.get(section='Stories', title=title)
        db_item.image_url = item['image']
        if item['link']:
            db_item.links = [{'url': item['link'], 'text': 'PDF'}]
        else:
            db_item.links = []
        db_item.save()
        pass #('Success!')
    except ContentItem.DoesNotExist:
        pass #('Not found')
    except ContentItem.MultipleObjectsReturned:
        pass #('Multiple found')
