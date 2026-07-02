import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pages.models import ContentItem
from import_activities_data import otStories, ntStories

activities = ['Coloring', 'Puzzles', 'Quizzes']

print("Clearing old activities...")
ContentItem.objects.filter(page_category='Activities').delete()

print("Importing new activities...")
for activity in activities:
    for story in otStories:
        ContentItem.objects.create(
            title=story['title'],
            subtitle=story['scripture'],
            page_category='Activities',
            section=f'{activity} OT',
            links=[{'text': 'PDF', 'url': '/wp-content/uploads/2026/03/logo.pdf'}]
        )
    for story in ntStories:
        ContentItem.objects.create(
            title=story['title'],
            subtitle=story['scripture'],
            page_category='Activities',
            section=f'{activity} NT',
            links=[{'text': 'PDF', 'url': '/wp-content/uploads/2026/03/logo.pdf'}]
        )

print("Activities imported successfully!")
