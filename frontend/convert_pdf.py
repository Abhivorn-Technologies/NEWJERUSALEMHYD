from docx2pdf import convert
import sys

def convert_file(input_file, output_file):
    convert(input_file, output_file)

if __name__ == "__main__":
    convert_file(sys.argv[1], sys.argv[2])
