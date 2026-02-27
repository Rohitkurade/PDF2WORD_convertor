#!/usr/bin/env python3
"""
PDF to DOCX converter using pdf2docx library
Usage: python pdf_to_docx.py <input_pdf> <output_docx>
"""
import sys
from pdf2docx import Converter

def convert_pdf_to_docx(input_path, output_path):
    """Convert PDF to DOCX"""
    try:
        cv = Converter(input_path)
        cv.convert(output_path)
        cv.close()
        print(f"Successfully converted {input_path} to {output_path}")
        return True
    except Exception as e:
        print(f"Error converting PDF to DOCX: {str(e)}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_to_docx.py <input_pdf> <output_docx>")
        sys.exit(1)
    
    input_pdf = sys.argv[1]
    output_docx = sys.argv[2]
    
    success = convert_pdf_to_docx(input_pdf, output_docx)
    sys.exit(0 if success else 1)
