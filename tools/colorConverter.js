class ColorConverter {
    
    // Hue Slider
    changeHue(rgb, degree) {
        degree = parseInt(degree);
        var hsl = this.rgbToHSL(rgb);

        hsl.h += degree;

        if (hsl.h > 360) {
            hsl.h -= 360;
        }
        else if (hsl.h < 0) {
            hsl.h += 360;
        }
        return this.hslToRGB(hsl);
    }
    
    // exepcts a string and returns an object
    rgbToHSL(rgb) {
        // strip the leading # if it's there
        rgb = rgb.replace(/^\s*#|\s*$/g, '');
    
        // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
        if(rgb.length == 3){
            rgb = rgb.replace(/(.)/g, '$1$1');
        }
    
        var r = parseInt(rgb.substr(0, 2), 16) / 255,
            g = parseInt(rgb.substr(2, 2), 16) / 255,
            b = parseInt(rgb.substr(4, 2), 16) / 255,
            cMax = Math.max(r, g, b),
            cMin = Math.min(r, g, b),
            delta = cMax - cMin,
            l = (cMax + cMin) / 2,
            h = 0,
            s = 0;
    
        if (delta == 0) {
            h = 0;
        }
        else if (cMax == r) {
            h = 60 * (((g - b) / delta) % 6);
        }
        else if (cMax == g) {
            h = 60 * (((b - r) / delta) + 2);
        }
        else {
            h = 60 * (((r - g) / delta) + 4);
        }
    
        if (delta == 0) {
            s = 0;
        }
        else {
            s = (delta/(1-Math.abs(2*l - 1)))
        }
    
        return {
            h: h,
            s: s,
            l: l
        }
    }
    
    // expects an object and returns a string
    hslToRGB(hsl) {
        var h = hsl.h,
            s = hsl.s,
            l = hsl.l,
            c = (1 - Math.abs(2*l - 1)) * s,
            x = c * ( 1 - Math.abs((h / 60 ) % 2 - 1 )),
            m = l - c/ 2,
            r, g, b;
    
        if (h < 60) {
            r = c;
            g = x;
            b = 0;
        }
        else if (h < 120) {
            r = x;
            g = c;
            b = 0;
        }
        else if (h < 180) {
            r = 0;
            g = c;
            b = x;
        }
        else if (h < 240) {
            r = 0;
            g = x;
            b = c;
        }
        else if (h < 300) {
            r = x;
            g = 0;
            b = c;
        }
        else {
            r = c;
            g = 0;
            b = x;
        }
    
        r = this.normalize_rgb_value(r, m);
        g = this.normalize_rgb_value(g, m);
        b = this.normalize_rgb_value(b, m);
    
        return this.rgbToHex(r,g,b);
    }
    
    normalize_rgb_value(color, m) {
        color = Math.floor((color + m) * 255);
        if (color < 0) {
            color = 0;
        }
        return color;
    }
    
    rgbToHex(r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
     
    // Brightness Slider
    shade(col, light) {
        light = parseInt(light) / 100;
        console.log(light)
    
        var r = parseInt(col.substring(0, 2), 16);
        var g = parseInt(col.substring(2, 4), 16);
        var b = parseInt(col.substring(4, 6), 16);
    
        if (light < 0) {
            r = (1 + light) * r;
            g = (1 + light) * g;
            b = (1 + light) * b;
        } else {
            r = (1 - light) * r + light * 255;
            g = (1 - light) * g + light * 255;
            b = (1 - light) * b + light * 255;
        }
    
        return this.color(r, g, b);
    }

    color(r, g, b) {
        return this.hex2(r) + this.hex2(g) + this.hex2(b);
    }

    hex2(c) {
        c = Math.round(c);
        if (c < 0) c = 0;
        if (c > 255) c = 255;
    
        var s = c.toString(16);
        if (s.length < 2) s = "0" + s;
    
        return s;
    }
}

let colorConverter = new ColorConverter;
export {colorConverter};