import sys

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def telugu_to_devanagari(text):
    if not text:
        return text
    result = []
    for char in text:
        code = ord(char)
        if 0x0C00 <= code <= 0x0C7F:
            if code == 0x0C0E: # ఎ
                dev_code = 0x090F # ए
            elif code == 0x0C12: # ఒ
                dev_code = 0x0913 # ओ
            elif code in [0x0C46, 0x0C47]: # ె, ే
                dev_code = 0x0947 # े
            elif code in [0x0C4A, 0x0C4B]: # ొ, ో
                dev_code = 0x094B # ो
            elif code == 0x0C31: # ఱ
                dev_code = 0x0930 # र
            else:
                dev_code = code - 0x0300
                
            if 0x0900 <= dev_code <= 0x097F:
                result.append(chr(dev_code))
            else:
                result.append(char)
        else:
            result.append(char)
    return "".join(result)

test_strings = [
    "హోసన్నా తేరీ హమ్‌ కరే",
    "గాయే ఖుషికే గీత్‌",
    "తునే హమ్‌ కో అజాద్‌ కియా",
    "మహిమ తేరి హమ్‌ కరే",
    "ప్యార్‌ బాటె తేరా",
    "తునే హమ్‌ సే హై ప్యార్‌ కియా",
    "స్తుతి తేరి హమ్‌ కరే",
    "ఆత్మ సచ్చాయి సే",
    "తునే హమ్‌ కో ఉధార్‌ దియా"
]

for s in test_strings:
    print(f"{s} -> {telugu_to_devanagari(s)}")
