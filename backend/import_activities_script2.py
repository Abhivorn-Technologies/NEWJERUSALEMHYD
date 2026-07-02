import os
import re
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pages.models import ContentItem

# Read the file
with open('../frontend/src/app/activities/coloring/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract OT array contents
ot_block = content.split('const otStories = [')[1].split('];')[0]
# Extract NT array contents
nt_block = content.split('const ntStories = [')[1].split('];')[0]

def parse_stories(block):
    stories = []
    # Match { title: '...', scripture: '...' }
    matches = re.finditer(r"\{\s*title:\s*'(.*?)',\s*scripture:\s*'(.*?)'\s*\}", block)
    for match in matches:
        stories.append({
            'title': match.group(1).replace("\\'", "'"),
            'scripture': match.group(2).replace("\\'", "'")
        })
    return stories

ot_stories = parse_stories(ot_block)
nt_stories = parse_stories(nt_block)

print(f"Parsed {len(ot_stories)} OT stories and {len(nt_stories)} NT stories.")

activities = ['Coloring', 'Puzzles', 'Quizzes']

print("Clearing old activities...")
ContentItem.objects.filter(page_category='Activities').delete()

print("Importing new activities...")
for activity in activities:
    for story in ot_stories:
        ContentItem.objects.create(
            title=story['title'],
            subtitle=story['scripture'],
            page_category='Activities',
            section=f'{activity} OT',
            links=[{'text': 'PDF', 'url': '/wp-content/uploads/2026/03/logo.pdf'}]
        )
    for story in nt_stories:
        ContentItem.objects.create(
            title=story['title'],
            subtitle=story['scripture'],
            page_category='Activities',
            section=f'{activity} NT',
            links=[{'text': 'PDF', 'url': '/wp-content/uploads/2026/03/logo.pdf'}]
        )

print("Activities imported successfully!")
