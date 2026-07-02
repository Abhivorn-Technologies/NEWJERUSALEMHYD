import glob

files = glob.glob('src/app/stories/**/page.tsx', recursive=True)
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Fix back button
    content = content.replace('href="/stories"', 'href="/sunday-school"')
    content = content.replace('Back to Stories', 'Back to Sunday School')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f'Fixed {f}')
