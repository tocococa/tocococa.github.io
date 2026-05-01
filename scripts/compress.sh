#!/bin/bash

show_help() {
    cat << EOF
Usage: $(basename "$0") INPUT_DIR OUTPUT_DIR [QUALITY]

Description:
  Compress all JPG images from INPUT_DIR into OUTPUT_DIR.
  - Skips files that already exist in OUTPUT_DIR
  - Resizes images to 50% (¼ total resolution)
  - Compresses using ImageMagick

Arguments:
  INPUT_DIR     Directory containing .jpg files
  OUTPUT_DIR    Directory where compressed images will be saved
  QUALITY       Optional JPEG quality (default: 75)

Options:
  -h, --help    Show this help message and exit

Examples:
  $(basename "$0") photos compressed_photos
  $(basename "$0") photos compressed_photos 70

Requirements:
  ImageMagick (magick command) must be installed.

EOF
}

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

if [ $# -lt 2 ]; then
    echo "Error: Missing required arguments."
    echo "Use -h or --help for usage."
    exit 1
fi

input_dir="$1"
output_dir="$2"
quality="${3:-75}"

if [ ! -d "$input_dir" ]; then
    echo "Error: INPUT_DIR does not exist or is not a directory."
    exit 1
fi

if ! [[ "$quality" =~ ^[0-9]+$ ]] || [ "$quality" -lt 1 ] || [ "$quality" -gt 100 ]; then
    echo "Error: QUALITY must be a number between 1 and 100."
    exit 1
fi

mkdir -p "$output_dir"

find "$input_dir" -type f \( -iname "*.jpg" \) | while IFS= read -r img; do
    filename=$(basename "$img")
    output_path="$output_dir/$filename"

    if [ -f "$output_path" ]; then
        echo "Skipping: $filename"
        continue
    fi

    echo "Processing: $filename"

    convert "$img" \
        -auto-orient \
        -resize 50% \
        -strip \
        -interlace Plane \
        -quality "$quality" \
        "$output_path"
done
