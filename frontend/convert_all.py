import os
from docx2pdf import convert

upload_dir = r"d:\NEWJERUSALEMHYD\frontend\public\wp-content\uploads\2026\03"
files = [
    "ఆర్.ఆర్.కె.మూర్తి-గారు.docx",
    "ఐడా-స్కడ్డర్-జీవితచరిత్ర.docx",
    "జాన్-వెస్లీ-1.docx"
]

for f in files:
    input_path = os.path.join(upload_dir, f)
    output_path = os.path.join(upload_dir, f.replace(".docx", ".pdf"))
    if os.path.exists(input_path):
        try:
            convert(input_path, output_path)
        except Exception as e:
            pass
    else:
        pass
