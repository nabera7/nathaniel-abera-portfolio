import struct
from PIL import Image
import io

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
        if ico_type in (1, 2):
            entry = icon[6:22]
            width = entry[0] if entry[0] != 0 else 256
            height = entry[1] if entry[1] != 0 else 256
            color_count = entry[2]
            bitcount = struct.unpack('<H', entry[6:8])[0]
            img_size = struct.unpack('<I', entry[8:12])[0]
            img_offset = struct.unpack('<I', entry[12:16])[0]
            img_bytes = icon[img_offset:img_offset+img_size]
            
            if img_bytes[:8] == b'\x89PNG\r\n\x1a\n':
                img = Image.open(io.BytesIO(img_bytes)).convert('RGBA')
                frames.append((img, width, height))
            else:
                bih_size = struct.unpack('<I', img_bytes[0:4])[0]
                biWidth = struct.unpack('<i', img_bytes[4:8])[0]
                biHeight = struct.unpack('<i', img_bytes[8:12])[0]
                biBitCount = struct.unpack('<H', img_bytes[14:16])[0]
                biCompression = struct.unpack('<I', img_bytes[16:20])[0]
                biClrUsed = struct.unpack('<I', img_bytes[32:36])[0]
                
                actual_height = abs(biHeight) // 2
                row_size = ((biWidth * biBitCount + 31) // 32) * 4
                xor_size = row_size * actual_height
                
                # Palette (for 8bpp): starts at offset bih_size
                palette_offset = bih_size
                num_colors = biClrUsed if biClrUsed > 0 else 256
                palette = []
                for c in range(num_colors):
                    b = img_bytes[palette_offset + c*4]
                    g = img_bytes[palette_offset + c*4 + 1]
                    r = img_bytes[palette_offset + c*4 + 2]
                    a = img_bytes[palette_offset + c*4 + 3]
                    palette.append((r, g, b, a))
                
                # XOR pixel data starts after palette
                pixels_offset = bih_size + num_colors * 4
                xor_data = img_bytes[pixels_offset:pixels_offset+xor_size]
                
                and_offset = pixels_offset + xor_size
                and_row_size = ((biWidth + 31) // 32) * 4
                and_data = img_bytes[and_offset:and_offset + and_row_size * actual_height]
                
                img = Image.new('RGBA', (biWidth, actual_height))
                px = img.load()
                
                for y in range(actual_height):
                    src_y = actual_height - 1 - y
                    for x in range(biWidth):
                        if biBitCount == 32:
                            byte_offset = src_y * row_size + x * 4
                            b = xor_data[byte_offset]
                            g = xor_data[byte_offset+1]
                            r = xor_data[byte_offset+2]
                            a = xor_data[byte_offset+3]
                        elif biBitCount == 8:
                            idx = xor_data[src_y * row_size + x]
                            r, g, b, a = palette[idx] if idx < len(palette) else (0,0,0,255)
                        elif biBitCount == 24:
                            byte_offset = src_y * row_size + x * 3
                            b = xor_data[byte_offset]
                            g = xor_data[byte_offset+1]
                            r = xor_data[byte_offset+2]
                            a = 255
                        else:
                            r = g = b = 0
                            a = 255
                        
                        if and_data:
                            and_byte = and_data[src_y * and_row_size + (x // 8)]
                            and_bit = (and_byte >> (7 - (x % 8))) & 1
                            if and_bit:
                                a = 0
                        
                        px[x, y] = (r, g, b, a)
                
                frames.append((img, width, height))
                print(f'Frame {len(frames)}: {biWidth}x{actual_height}, {biBitCount}bpp, {num_colors} colors')
    
    pos += 8 + fsize + (1 if fsize % 2 else 0)
    if len(frames) >= 100:
        break

print(f'\nTotal frames: {len(frames)}')

if frames:
    for i, (fimg, w, h) in enumerate(frames):
        fimg.save(rf'C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio\assets\ani_frame_{i}.png')
    
    first = frames[0][0]
    first_48 = first.resize((48, 48), Image.LANCZOS)
    first_48.save(r'C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio\assets\kali_cursor_48.png')
    first.save(r'C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio\assets\kali_cursor.png')
    
    # Also make an animated GIF from all frames
    frames[0][0].save(
        r'C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio\assets\kali_cursor_anim.gif',
        save_all=True,
        append_images=[f[0] for f in frames[1:]],
        duration=100,
        loop=0,
        disposal=2
    )
    print('Saved animated GIF + PNGs')
