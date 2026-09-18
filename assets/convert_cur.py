import struct
from PIL import Image

def decode_cur_to_png(cur_path, png_path):
    with open(cur_path, 'rb') as f:
        data = f.read()
    
    reserved, ico_type, count = struct.unpack('<HHH', data[:6])
    entry = data[6:22]
    w, h, colors, r2, planes, bitcount, bytesize, offset = struct.unpack('<BBBBHHI I', entry)
    
    dib = data[offset:]
    bih_size = struct.unpack('<I', dib[0:4])[0]
    biWidth = struct.unpack('<i', dib[4:8])[0]
    biHeight = struct.unpack('<i', dib[8:12])[0]
    biBitCount = struct.unpack('<H', dib[14:16])[0]
    biClrUsed = struct.unpack('<I', dib[32:36])[0]
    
    biWidth = biWidth if biWidth > 0 else w
    actual_height = abs(biHeight) // 2
    
    num_colors = biClrUsed if biClrUsed > 0 else (256 if biBitCount <= 8 else 0)
    
    palette_offset = bih_size
    palette = []
    if biBitCount == 8:
        num_colors = 256 if num_colors == 0 else num_colors
        for c in range(num_colors):
            b = dib[palette_offset + c*4]
            g = dib[palette_offset + c*4 + 1]
            r = dib[palette_offset + c*4 + 2]
            palette.append((r, g, b, 255))
    
    # XOR data
    if biBitCount == 8:
        xor_start = bih_size + num_colors * 4
        row_size = ((biWidth * 8 + 31) // 32) * 4
    elif biBitCount == 32:
        xor_start = bih_size
        row_size = ((biWidth * 32 + 31) // 32) * 4
    elif biBitCount == 24:
        xor_start = bih_size
        row_size = ((biWidth * 24 + 31) // 32) * 4
    else:
        xor_start = bih_size
        row_size = ((biWidth * biBitCount + 31) // 32) * 4
    
    xor_size = row_size * actual_height
    and_start = xor_start + xor_size
    and_row_size = ((biWidth + 31) // 32) * 4
    
    img = Image.new('RGBA', (biWidth, actual_height), (0, 0, 0, 0))
    px = img.load()
    
    for y in range(actual_height):
        src_y = actual_height - 1 - y
        for x in range(biWidth):
            if biBitCount == 32:
                off = src_y * row_size + x * 4
                b = dib[xor_start + off]
                g = dib[xor_start + off + 1]
                r = dib[xor_start + off + 2]
                a = dib[xor_start + off + 3]
            elif biBitCount == 24:
                off = src_y * row_size + x * 3
                b = dib[xor_start + off]
                g = dib[xor_start + off + 1]
                r = dib[xor_start + off + 2]
                a = 255
            elif biBitCount == 8:
                idx = dib[xor_start + src_y * row_size + x]
                r, g, b, a = palette[idx] if idx < len(palette) else (255, 255, 255, 255)
            else:
                r = g = b = 255
                a = 255
            
            # AND mask: 1=transparent, 0=opaque
            if and_start + src_y * and_row_size + (x // 8) < len(dib):
                and_byte = dib[and_start + src_y * and_row_size + (x // 8)]
                and_bit = (and_byte >> (7 - (x % 8))) & 1
                if and_bit:
                    a = 0
            
            px[x, y] = (r, g, b, a)
    
    img.save(png_path)
    print(f'{cur_path} -> {png_path} ({biWidth}x{actual_height}, {biBitCount}bpp)')
    
    # Verify non-transparent
    pixels = list(img.getdata())
    non_trans = sum(1 for p in pixels if p[3] > 10)
    print(f'  {non_trans} non-transparent pixels')


decode_cur_to_png(r'C:\Users\hanak\Downloads\cursor_normal2.cur', 
                  r'C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio\assets\cursor_normal2.png')
decode_cur_to_png(r'C:\Users\hanak\Downloads\cursor_effect_no.cur', 
                  r'C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio\assets\cursor_effect_no.png')
