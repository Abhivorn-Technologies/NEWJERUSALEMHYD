import os
import django
import xml.etree.ElementTree as ET
import re
import json
from django.utils.text import slugify

# Initialize Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from songs.models import SongCategory, Song

xml_path = r"d:\NEWJERUSALEMHYD\frontend\public\wp-content\uploads\2025\11\1711-newjerusalemministries.WordPress.2022-12-30-1.xml.txt"

def determine_language(categories):
    nice_names = [c[1] for c in categories]
    
    if 'ss-english' in nice_names or 'sunday-school-english-songs' in nice_names:
        return 'sunday_english'
    if 'sunday-school-hindi-songs' in nice_names or 'ss-hindi' in nice_names:
        return 'sunday_hindi'
    if 'ss-telugu' in nice_names or 'sunday-school-telugu-songs' in nice_names:
        return 'sunday_telugu'
        
    for nice in nice_names:
        if nice.startswith('sse-'):
            return 'sunday_english'
        if nice.startswith('sh') and any(char.isdigit() for char in nice):
            return 'sunday_hindi'
        if nice.startswith('s0') or nice.startswith('s1') or nice.startswith('s2') or nice.startswith('s3') or nice.startswith('s4'):
            if nice[1:3].isdigit() or (nice[1].isdigit() and nice[2] == '-'):
                return 'sunday_telugu'
        if nice.startswith('tel-'):
            return 'telugu'
            
    # Also check if categories contains 'Praise Songs' or 'Worship Songs'
    if any(x in nice_names for x in ['praise-songs', 'worship-songs', 'thanksgiving-songs', 'comfort-songs']):
        return 'telugu'
        
    return None

def find_first_letter(title, language):
    title = title.strip()
    if not title:
        return '#'
        
    title = re.sub(r'^[🎵📖⛪🙏\s\-\/\(\)]+', '', title)
    if not title:
        return '#'
        
    if language == 'sunday_english':
        first_char = title[0].upper()
        if first_char in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
            return first_char
        return '#'
        
    elif language == 'sunday_hindi':
        hindi_letters = ['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ','क','ख','ग','घ','च','छ','ज','झ','ट','ठ','ड','ढ','ण','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह','क्ष','त्र','ज्ञ']
        for letter in sorted(hindi_letters, key=len, reverse=True):
            if title.startswith(letter):
                return letter
        first_char = title[0]
        if first_char in hindi_letters:
            return first_char
        return '#'
        
    else: # telugu and sunday_telugu
        telugu_letters = ['అ','ఆ','ఇ','ఈ','ఉ','ఊ','ఋ','ఎ','ఏ','ఐ','ఒ','ఓ','ఔ','క','ఖ','గ','ఘ','చ','ఛ','జ','ఝ','ట','ఠ','డ','ఢ','ణ','త','థ','ద','ధ','న','ప','ఫ','బ','భ','మ','య','ర','ల','వ','శ','ష','స','హ','ళ','క్ష','ఱ']
        for letter in sorted(telugu_letters, key=len, reverse=True):
            if title.startswith(letter):
                return letter
        first_char = title[0].upper()
        if first_char in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
            return first_char
        return '#'

def parse_tabs(content, language):
    tabs_data = {
        'telugu_lyrics': '',
        'hindi_lyrics': '',
        'english_lyrics': '',
        'powerpoint_slides': '',
        'audio_video': '',
        'chords': ''
    }

    if not content:
        return tabs_data

    # Parse parent tabs label list, if any
    parent_match = re.search(r'<!-- wp:plethoraplugins/tabs (\{.*?\}) -->', content)
    tab_labels = []
    if parent_match:
        try:
            parent_attrs = json.loads(parent_match.group(1))
            tab_labels = parent_attrs.get('tabLabels', [])
        except Exception:
            pass

    # Find all tab blocks
    tab_blocks = re.findall(r'<!-- wp:plethoraplugins/tab (\{.*?\})? -->([\s\S]*?)<!-- /wp:plethoraplugins/tab -->', content)

    if not tab_blocks:
        # Check by language
        if language == 'sunday_hindi':
            tabs_data['hindi_lyrics'] = content.strip()
        elif language == 'sunday_english':
            tabs_data['english_lyrics'] = content.strip()
        elif language in ['telugu', 'sunday_telugu']:
            tabs_data['telugu_lyrics'] = content.strip()
        else:
            # Fallback check if content has telugu characters
            if re.search(r'[\u0c00-\u0c7f]', content):
                tabs_data['telugu_lyrics'] = content.strip()
            else:
                tabs_data['english_lyrics'] = content.strip()
        return tabs_data

    for idx, (attr_str, tab_content) in enumerate(tab_blocks):
        label = ''
        if attr_str:
            try:
                attrs = json.loads(attr_str)
                label = attrs.get('label', '')
            except Exception:
                pass
        
        if not label and idx < len(tab_labels):
            label = tab_labels[idx]

        label_lower = label.lower().strip() if label else ''

        if any(x in label_lower for x in ['hindi lyrics', 'hindi lyric', 'hindi']):
            tabs_data['hindi_lyrics'] = tab_content.strip()
        elif any(x in label_lower for x in ['telugu lyrics', 'telugu lyric', 'telugu']):
            tabs_data['telugu_lyrics'] = tab_content.strip()
        elif any(x in label_lower for x in ['english lyrics', 'english lyric', 'english', 'transliteration', 'translation']):
            tabs_data['english_lyrics'] = tab_content.strip()
        elif any(x in label_lower for x in ['powerpoint slides', 'ppt', 'powerpoint', 'slides']):
            tabs_data['powerpoint_slides'] = tab_content.strip()
        elif any(x in label_lower for x in ['audio / video', 'audio', 'video', 'audio/video']):
            tabs_data['audio_video'] = tab_content.strip()
        elif any(x in label_lower for x in ['chords', 'guitar chords']):
            tabs_data['chords'] = tab_content.strip()
        else:
            # Fallback if label is generic (like "Lyrics" or empty)
            target_field = 'english_lyrics'
            if language == 'sunday_hindi':
                target_field = 'hindi_lyrics'
            elif language in ['telugu', 'sunday_telugu']:
                target_field = 'telugu_lyrics'
            elif language == 'sunday_english':
                target_field = 'english_lyrics'
            else:
                if re.search(r'[\u0c00-\u0c7f]', tab_content):
                    target_field = 'telugu_lyrics'
                else:
                    target_field = 'english_lyrics'
            
            if not tabs_data[target_field]:
                tabs_data[target_field] = tab_content.strip()
            else:
                tabs_data[target_field] += '\n' + tab_content.strip()

    return tabs_data

def import_songs():
    namespaces = {
        'wp': 'http://wordpress.org/export/1.2/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    }

    print("Loading XML file...")
    tree = ET.parse(xml_path)
    root = tree.getroot()
    channel = root.find('channel')
    items = channel.findall('item')

    print(f"Parsing {len(items)} items from XML...")
    songs_imported = 0
    counts = {
        'telugu': 0,
        'sunday_telugu': 0,
        'sunday_english': 0,
        'sunday_hindi': 0,
        'others': 0
    }

    # Delete previous seeded songs to prevent duplicates or clean state
    # Wait, the user wants ALL songs from the file, so let's clear the old test data first.
    print("Clearing old song database entries...")
    Song.objects.all().delete()

    for item in items:
        # Check post type
        pt_el = item.find('wp:post_type', namespaces)
        if pt_el is None or pt_el.text != 'post':
            continue

        # Get details
        title_el = item.find('title')
        title = title_el.text if (title_el is not None and title_el.text is not None) else ''
        title = title.strip()
        if not title:
            continue

        post_id_el = item.find('wp:post_id', namespaces)
        post_id = int(post_id_el.text) if (post_id_el is not None and post_id_el.text is not None) else 0

        post_name_el = item.find('wp:post_name', namespaces)
        post_name = post_name_el.text if (post_name_el is not None and post_name_el.text is not None) else ''

        content_el = item.find('content:encoded', namespaces)
        content = content_el.text if (content_el is not None and content_el.text is not None) else ''

        # Get categories
        categories = []
        for cat_el in item.findall('category'):
            domain = cat_el.attrib.get('domain')
            nicename = cat_el.attrib.get('nicename')
            if domain == 'category':
                categories.append((cat_el.text, nicename))

        # Determine language
        lang = determine_language(categories)
        if not lang:
            # If no category, default to telugu
            lang = 'telugu'

        # Generate slug
        slug = post_name.strip()
        if not slug:
            slug = slugify(title)
        if not slug:
            slug = f"song-{post_id}"

        # If slug is too long or already exists, modify it
        slug = slug[:200]
        original_slug = slug
        counter = 1
        while Song.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1

        # Parse lyrics
        lyrics_data = parse_tabs(content, lang)

        # Get first letter
        first_letter = find_first_letter(title, lang)

        # Create song
        song = Song.objects.create(
            title=title,
            slug=slug,
            language=lang,
            first_letter=first_letter,
            telugu_lyrics=lyrics_data['telugu_lyrics'],
            hindi_lyrics=lyrics_data['hindi_lyrics'],
            english_lyrics=lyrics_data['english_lyrics'],
            powerpoint_slides=lyrics_data['powerpoint_slides'],
            audio_video=lyrics_data['audio_video'],
            chords=lyrics_data['chords'],
            is_published=True,
            wp_post_id=post_id
        )

        # Add categories
        for cat_name, cat_nice in categories:
            cat_obj, _ = SongCategory.objects.get_or_create(
                slug=cat_nice[:50],
                defaults={'name': cat_name[:100]}
            )
            song.categories.add(cat_obj)

        songs_imported += 1
        counts[lang] += 1

    print("\nImport complete!")
    print(f"Total songs imported: {songs_imported}")
    for lang, count in counts.items():
        print(f" - {lang}: {count} songs")

if __name__ == "__main__":
    import_songs()
