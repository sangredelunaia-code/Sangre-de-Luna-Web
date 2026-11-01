#!/usr/bin/env python3
"""Create Android PWA icon sizes from the existing official Sangre de Luna logo."""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
source = root / "assets" / "logo-oficial.png"
out = root / "assets"
with Image.open(source) as opened:
    logo = opened.convert("RGBA")
    if not logo.getbbox():
        raise ValueError("Official logo is empty")
    logo = logo.crop(logo.getbbox())

for size, filename, padding in [
    (192, "sdl-mail-192.png", 0.13),
    (512, "sdl-mail-512.png", 0.13),
    (512, "sdl-mail-maskable-512.png", 0.22),
]:
    background = Image.new("RGBA", (size, size), "#081827")
    available = int(size * (1 - 2 * padding))
    fitted = ImageOps.contain(logo, (available, available), Image.Resampling.LANCZOS)
    background.alpha_composite(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2))
    background.convert("RGB").save(out / filename, format="PNG", optimize=True)
    print(filename, (size, size))
