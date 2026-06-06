import xml.etree.ElementTree as ET
import re

xml_path = r"d:\NEWJERUSALEMHYD\frontend\public\wp-content\uploads\2025\11\1711-newjerusalemministries.WordPress.2022-12-30-1.xml.txt"

def analyze_xml():
    # Since the file is XML, we can parse it.
    # WordPress export files use namespaces.
    namespaces = {
        'wp': 'http://wordpress.org/export/1.2/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    }
    
    print("Reading XML file...")
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        channel = root.find('channel')
        
        items = channel.findall('item')
        print(f"Total items in XML: {len(items)}")
        
        categories = set()
        post_types = {}
        
        for item in items:
            pt = item.find('wp:post_type', namespaces)
            pt_text = pt.text if pt is not None else 'unknown'
            post_types[pt_text] = post_types.get(pt_text, 0) + 1
            
            for cat in item.findall('category'):
                nicename = cat.attrib.get('nicename')
                domain = cat.attrib.get('domain')
                if domain == 'category':
                    categories.add((cat.text, nicename))
                    
        print("\nPost Types found:")
        for pt, count in post_types.items():
            print(f" - {pt}: {count}")
            
        with open('categories.txt', 'w', encoding='utf-8') as f:
            f.write(f"Total items in XML: {len(items)}\n\n")
            f.write("Post Types found:\n")
            for pt, count in post_types.items():
                f.write(f" - {pt}: {count}\n")
            f.write("\nAll Categories found:\n")
            for name, nice in sorted(categories):
                f.write(f" - {name} ({nice})\n")
        print("Done. Output written to categories.txt")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_xml()
