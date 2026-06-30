import os
import sys
import django

sys.path.append(r'd:\NEWJERUSALEMHYD\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pages.models import HeroItem

HeroItem.objects.all().delete()

items = [
    'బైబిల్ కథలు',
    'మిషనరీ కథలు',
    'కంఠస్థ వాక్యములు',
    'ప్రార్థనలు',
    'పదవినోదాలు',
    'క్రాఫ్ట్స్ వర్క్'
]

for i, text in enumerate(items):
    HeroItem.objects.create(text=text, icon='•', order=i+1)
