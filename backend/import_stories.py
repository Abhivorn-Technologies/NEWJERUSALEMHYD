import os
import re
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pages.models import ContentItem

# Delete the dummy stories we added earlier
ContentItem.objects.filter(page_category='Bible Stories & Activities').delete()

categories = {
    'old-testament': 'Old Testament',
    'new-testament': 'New Testament',
    'topical': 'Topical',
    'biographical': 'Biographical',
    'pre-school': 'Pre School'
}

all_stories = []
for cat_slug, section in categories.items():
    file_path = f"../frontend/src/app/stories/{cat_slug}/page.tsx"
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find the storiesList array
    match = re.search(r'const storiesList = \[(.*?)\];', content, re.DOTALL)
    if match:
        items_str = match.group(1)
        # Parse each object { scripture: '...', title: '...' }
        items = re.findall(r"\{\s*scripture:\s*'(.*?)',\s*title:\s*'(.*?)'\s*\}", items_str)
        for scripture, title in items:
            # Replaces unicode apostrophes/dashes
            scripture = scripture.replace('’', "'").replace('—', "-").replace('?"', "-")
            title = title.replace('’', "'").replace('—', "-").replace('?"', "-")
            all_stories.append({
                'title': title,
                'subtitle': scripture,
                'section': section,
                'page_category': 'Bible Stories & Activities',
                'is_active': True,
                'image_url': f'/images/stories/{cat_slug}/image1.jpeg',
            })

print(f"Extracted {len(all_stories)} stories from React files.")

# Read SQL dump to find PDF links
sql_file = r'd:\NEWJERUSALEMHYD\u771531615_GFv3O.sql'
post_id_to_pdf = {}
title_to_post_id = {}

print("Parsing SQL dump for post titles and PDFs (this may take a minute)...")
try:
    with open(sql_file, 'r', encoding='utf8', errors='ignore') as f:
        for line in f:
            if 'INSERT INTO `wp_posts`' in line:
                # wp_posts usually has (ID, post_author, post_date, post_date_gmt, post_content, post_title, ...)
                # It's hard to parse perfectly without a full SQL parser, but we can do our best with regex
                # Let's extract (ID, ..., 'title', ...)
                matches = re.finditer(r"\((\d+),\d+,'[^']*','[^']*','[^']*','(.*?)',", line)
                for m in matches:
                    post_id = m.group(1)
                    title = m.group(2)
                    title_to_post_id[title] = post_id
                    
            if 'INSERT INTO `wp_postmeta`' in line:
                # wp_postmeta has (meta_id, post_id, meta_key, meta_value)
                matches = re.finditer(r"\((\d+),(\d+),'_wp_attached_file','(.*?)'\)", line)
                for m in matches:
                    post_id = m.group(2)
                    pdf_path = m.group(3)
                    post_id_to_pdf[post_id] = "/wp-content/uploads/" + pdf_path
except Exception as e:
    print(f"Error parsing SQL dump: {e}")

found_count = 0
for story in all_stories:
    title = story['title']
    pdf_link = ""
    # Try to find exactly
    if title in title_to_post_id:
        post_id = title_to_post_id[title]
        pdf_link = post_id_to_pdf.get(post_id, "")
    
    if pdf_link:
        story['links'] = [{'text': 'PDF', 'url': pdf_link}]
        found_count += 1
    else:
        # Default placeholder if not found
        story['links'] = [{'text': 'PDF', 'url': '/wp-content/uploads/2026/03/logo.pdf'}]
    
    # Save to database
    ContentItem.objects.create(**story)

print(f"Successfully migrated {len(all_stories)} stories to the database.")
print(f"Found {found_count} real PDFs in the SQL dump.")
