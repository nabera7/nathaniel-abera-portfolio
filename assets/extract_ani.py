import struct
from PIL import Image

with open(r'C:\Users\hanak\Downloads\wib.ani', 'rb') as f:
    data = f.read()

pos = 12
cid = data[pos:pos+4]; csize = struct.unpack('<I', data[pos+4:pos+8])[0]
pos += 8 + csize + (1 if csize % 2 else 0)
cid2 = data[pos:pos+4]; csize2 = struct.unpack('<I', data[pos+4:pos+8])[0]
pos += 8 + csize2 + (1 if csize2 % 2 else 0)
cid3 = data[pos:pos+4]; csize3 = struct.unpack('<I', data[pos+4:pos+8])[0]
pos += 12

frames = []
while pos < len(data) - 8:
    fcid = data[pos:pos+4]
    fsize = struct.unpack('<I', data[pos+4:pos+8])[0]
    if fsize == 0 or fsize > 100000:
        break
    icon = data[pos+8:pos+8+fsize]
    
    if icon[:2] == b'\x00\x00':
        reserved, ico_type, count = struct.unpack('<HHH', icon[:6])
        entry = icon[6:22]
        w, h, colors, r2, planes, entry_bitcount, bytesize, offset = struct.unpack('<BBBBHHI I', entry)
        
        dib = icon[offset:]
        bih_size = struct.unpack('<I', dib[0:4])[0]
        biWidth = struct.unpack('<i', dib[4:8])[0]
        biHeight = struct.unpack('<i', dib[8:12])[0]
        biBitCount = struct.unpack('<H', dib[14:16])[0]
        biClrUsed = struct.unpack('<I', dib[32:36])[0]
        
        actual_height = abs(biHeight) // 2
        biWidth = biWidth if biWidth > 0 else w
        
        # For 8bpp: palette exists. For CUR files bitcount might be misleading.
        # Determine actual bit depth from DIB
        if biBitCount == 8:
            if biClrUsed == 0:
                num_colors = 256
            else:
                num_colors = biClrUsed
            
            # Palette starts after DIB header (bih_size)
            palette_offset = bih_size
            palette = []
            for c in range(num_colors):
                b = dib[palette_offset + c*4]
                g = dib[palette_offset + c*4 + 1]
                r = dib[palette_offset + c*4 + 2]
                # Ignore alpha byte in palette - CUR files use AND mask for transparency
                palette.append((r, g, b, 255))
            
            # XOR data starts after palette
            xor_start = bih_size + num_colors * 4
            row_size = ((biWidth * 8 + 31) // 32) * 4
            xor_size = row_size * actual_height
            
            # AND mask
            and_start = xor_start + xor_size
            and_row_size = ((biWidth + 31) // 32) * 4
            
            img = Image.new('RGBA', (biWidth, actual_height), (0,0,0,0))
            px = img.load()
            
            for y in range(actual_height):
                src_y = actual_height - 1 - y  # BMP bottom-up
                for x in range(biWidth):
                    idx = dib[xor_start + src_y * row_size + x]
                    if idx < len(palette):
                        r, g, b, a = palette[idx]
                    else:
                        r, g, b, a = (255, 255, 255, 255)
                    
                    # AND mask: 1 = transparent, 0 = opaque
                    if and_start + src_y * and_row_size + (x // 8) < len(dib):
                        and_byte = dib[and_start + src_y * and_row_size + (x // 8)]
                        and_bit = (and_byte >> (7 - (x % 8))) & 1
                        if and_bit:
                            a = 0  # transparent
                    
                    px[x, y] = (r, g, b, a)
            
            frames.append(img)
    
    pos += 8 + fsize + (1 if fsize % 2 else 0)
    if len(frames) >= 100:
        break

print(f'Frames: {len(frames)}')

# Check transparency of each frame
for i, img in enumerate(frames):
    pixels = list(img.getdata())
    non_trans = sum(1 for p in pixels if p[3] > 10)
    print(f'Frame {i}: {img.size}, {non_trans} non-transparent pixels')

if frames:
    for i, img in enumerate(frames):
        img.save(rf'C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio\assets\ani_frame_{i}.png')
    
    # Upscale first frame for cursor
    first = frames[0]
    first_48 = first.resize((48, 48), Image.NEAREST)  # NEAREST for sharp pixel cursor
    first_48.save(r'C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio\assets\kali_cursor_static.png')
    print('Saved')
