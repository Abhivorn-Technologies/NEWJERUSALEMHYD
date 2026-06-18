import os
import sys
import django
import re

# Setup django
sys.path.append('d:/NEWJERUSALEMHYD/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from songs.models import Song
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

# Fetch all songs
songs = Song.objects.all()

updated_count = 0

def clean_itrans(text):
    # ITRANS makes long vowels uppercase (e.g. A, I, U) and uses some other specific capital letters.
    # We will convert to title case and then replace specific patterns to look like regular names.
    # For a simple approach, we can just lowercase and capitalize words.
    text = text.lower()
    # basic fixes for typical ITRANS
    text = text.replace('aa', 'a').replace('ii', 'i').replace('uu', 'u')
    text = text.replace('~n', 'n')
    text = text.replace('shh', 'sh')
    # Capitalize first letter of each word
    return text.title()

for song in songs:
    title = song.title.strip()
    
    # Check if title already has english text in parentheses
    if not re.search(r'\([A-Za-z\s.\-]+\)', title):
        # Transliterate the Telugu part
        # Let's clean out any existing trailing parenthesis that might just be the author in Telugu
        # e.g., "ఆరాధించెదము యేసయ్య (జాన్ చక్రవర్తి)"
        # Actually, let's transliterate the entire title including the author parenthesis
        eng_text = transliterate(title, sanscript.TELUGU, sanscript.ITRANS)
        eng_cleaned = clean_itrans(eng_text)
        
        new_title = f"{title} ({eng_cleaned})"
        song.title = new_title
        song.save()
        updated_count += 1
        
print(f"Total updated: {updated_count}")
