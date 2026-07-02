import glob

files = glob.glob('src/app/stories/**/page.tsx', recursive=True)
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Fix API_URL
    content = content.replace(
        "const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';",
        "const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';"
    )
    content = content.replace(
        "${API_URL}/api/content-items/",
        "${API_URL}/content-items/"
    )
    
    # Fix back button
    content = content.replace('href="/sunday-school"', 'href="/stories"')
    content = content.replace('Back to Sunday School', 'Back to Stories')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f'Fixed {f}')
