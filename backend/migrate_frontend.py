import re
import os

categories = {
    'old-testament': 'Old Testament',
    'new-testament': 'New Testament',
    'topical': 'Topical',
    'biographical': 'Biographical',
    'pre-school': 'Pre School'
}

for cat_slug, section in categories.items():
    file_path = f"../frontend/src/app/stories/{cat_slug}/page.tsx"
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace function declaration and add dynamic export
    func_name_match = re.search(r'export default function (\w+)\(\) \{', content)
    if not func_name_match:
        continue
    func_name = func_name_match.group(1)
    
    new_header = f"""export const dynamic = 'force-dynamic';

export default async function {func_name}() {{
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  let storiesList = [];
  try {{
    const res = await fetch(`${{API_URL}}/api/content-items/?page_category=Bible+Stories+%26+Activities&section={section.replace(' ', '+')}`, {{ cache: 'no-store' }});
    if (res.ok) {{
      storiesList = await res.json();
    }}
  }} catch (err) {{
    console.error(err);
  }}
"""
    # Replace up to return (
    content = re.sub(r'export default function \w+\(\) \{\s*const storiesList = \[.*?\];\s*(?:return \()', new_header + '  return (', content, flags=re.DOTALL)
    
    # Replace stories mapping
    new_mapping = r"""{storiesList.map((story: any, index: number) => {
                    return (
                      <tr key={story.id || index} className="hover:bg-pink-50/50 transition-colors">
                        <td className="px-2 py-3 sm:px-8 sm:py-4">
                          <img 
                            src={story.image_url || '/images/default.jpeg'} 
                            alt={story.title} 
                            className="w-14 h-10 sm:w-20 sm:h-14 object-cover rounded-lg shadow-sm border border-gray-100" 
                          />
                        </td>
                        <td className="px-2 py-3 sm:pl-16 sm:pr-6 sm:py-4 break-words">
                          <a
                            href={story.links?.[0]?.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm sm:text-lg text-gray-800 font-semibold hover:text-[#D81B60] hover:underline transition-colors duration-200 cursor-pointer"
                          >
                            {story.title}
                          </a>
                          <span className="block text-[10px] sm:text-xs text-gray-400 font-normal mt-0.5 line-clamp-2">{story.subtitle}</span>
                        </td>
                      </tr>
                    );
                  })}"""
                  
    content = re.sub(r'\{storiesList\.map\(\(story, index\) => \{.*?return \(.*?\);\s*\}\)\}', new_mapping, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated frontend components successfully.")
