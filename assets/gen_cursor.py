import base64
from PIL import Image, ImageDraw

# Create a 48x48 Kali-style cursor (white arrow, black outline, green accent)
size = 48
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Kali green fill (classic Kali Linux green #00B4D8 is actually the blue... 
# Kali's brand is #22a7f0-ish blue, but the "Terminator" cursor is white/black)
# Let's do white fill with black outline + green tip marker

# Arrow shape (scaled to 48px)
scale = 2.6
points = [
    (0*scale, 0*scale),         # tip
    (0*scale, 16*scale),        # down left edge
    (4.5*scale, 13.5*scale),    # inner notch
    (6.5*scale, 19*scale),      # tail
    (9*scale, 17*scale),        # tail underside
    (5.5*scale, 11*scale),      # inner notch bottom
    (10*scale, 10.5*scale),     # right edge
]

# Offest into canvas
offset = 2
points = [(x + offset, y + offset) for x, y in points]

draw.polygon(points, fill=(255, 255, 255, 255), outline=(0, 0, 0, 255))

# Green tip accent
draw.ellipse([offset-1, offset-1, offset+2, offset+2], fill=(0, 180, 216, 255))

# Save as PNG
img.save('kali_cursor.png')
print("Saved kali_cursor.png")

# Now output base64
with open('kali_cursor.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()
print(b64)
