"""
Zeichnet die Silhouette der Zürcher Goldküste (Meilen) als SVG.
Ausgabe: public/grafik/goldkueste-fuss.svg (gefüllt, für die Fusszeile)
         public/grafik/goldkueste-linie.svg (Linienzeichnung, Trennlinie)
Aufruf: python3 scripts/goldkueste.py   (Zufall mit festem Seed, Ergebnis reproduzierbar)
Stilisierte Ansicht vom See aus: Pfannenstiel mit Wald und Aussichtsturm, Rebberge,
Villen am Hang, Dorf am Ufer mit reformierter Kirche, Fähre Meilen–Horgen, Segelboot.
"""
import math, random
random.seed(619)
W, H, UFER = 1600, 210, 168
BRAUN, SAND, LEDER = '#2e2118', '#ebe0ca', '#6e4527'

def glatt(stuetz, schritt=4):
    """Catmull-Rom durch Stützpunkte, gibt Liste (x,y) im Abstand schritt zurück."""
    xs = [p[0] for p in stuetz]
    out = []
    for x in range(0, W + 1, schritt):
        i = max(0, min(len(stuetz) - 2, next((k for k in range(len(xs) - 1) if xs[k] <= x <= xs[k + 1]), len(xs) - 2)))
        p0 = stuetz[max(i - 1, 0)]; p1 = stuetz[i]; p2 = stuetz[i + 1]; p3 = stuetz[min(i + 2, len(stuetz) - 1)]
        t = (x - p1[0]) / (p2[0] - p1[0])
        y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t * t + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t ** 3)
        out.append((x, y))
    return out

def yan(kurve, x):
    i = min(int(x / 4), len(kurve) - 2); (x0, y0), (x1, y1) = kurve[i], kurve[i + 1]
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0)

f = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.')

# 1) Pfannenstiel (hinten) mit Waldkante
grat = glatt([(0, 128), (150, 116), (320, 98), (500, 80), (680, 64), (820, 54), (910, 50), (1000, 52), (1140, 62), (1300, 78), (1450, 96), (1600, 108)])
wald = []
x = 0
while x <= W:
    y = yan(grat, x)
    if 260 < x < 1480:
        r = random.uniform(2.5, 5.5) if not (880 < x < 930) else 2.5
        wald.append((x, y, r)); x += r * 1.6
    else:
        wald.append((x, y, 0)); x += 6
d = f'M0,{f(yan(grat, 0))}'
for x, y, r in wald:
    if r: d += f' L{f(x)},{f(y)} a{f(r)},{f(r * 1.15)} 0 0 1 {f(r * 1.6)},0'
    else: d += f' L{f(x)},{f(y)}'
hinten = d + f' L{W},{UFER} L0,{UFER} Z'
grat_linie = d
# Aussichtsturm Pfannenstiel (Stahlgitter mit Plattform)
tx, ty = 905, yan(grat, 905) + 3
turm = f'M{tx - 5},{f(ty)} L{tx - 2},{f(ty - 30)} L{tx + 2},{f(ty - 30)} L{tx + 5},{f(ty)} Z M{tx - 6},{f(ty - 30)} h12 v-3 h-12 Z M{tx - 1},{f(ty - 33)} v-5 h2 v5 Z'
turm_linie = f'M{tx - 5},{f(ty)} L{tx - 2},{f(ty - 30)} M{tx + 5},{f(ty)} L{tx + 2},{f(ty - 30)} M{tx - 4},{f(ty - 10)} L{tx + 3.5},{f(ty - 20)} M{tx + 4},{f(ty - 10)} L{tx - 3.5},{f(ty - 20)} M{tx - 6},{f(ty - 30)} h12 v-3 h-12 Z M{tx},{f(ty - 33)} v-5'

# 2) Vorderer Hang mit Rebbergen und Villen
hang = glatt([(0, 158), (200, 150), (420, 134), (600, 122), (760, 118), (900, 122), (1060, 116), (1240, 126), (1420, 142), (1600, 152)])
hang_pfad = 'M' + ' L'.join(f'{x},{f(y)}' for x, y in hang) + f' L{W},{UFER} L0,{UFER} Z'
hang_linie = 'M' + ' L'.join(f'{x},{f(y)}' for x, y in hang)
reben = []
for (a, b) in [(330, 640), (960, 1290)]:
    x = a
    while x < b:
        y0 = yan(hang, x) + 4
        reben.append(f'M{f(x)},{f(y0)} l7,{f(UFER - 26 - y0 if UFER - 26 - y0 > 4 else 4)}')
        x += 6
reben = ' '.join(r for r in reben if 'l7,-' not in r)

def villa(x, y, w, h, art):
    """Haus auf Höhe y (Fusspunkt). art: giebel, walm, flach"""
    if art == 'giebel':
        return f'M{f(x)},{f(y)} v{f(-h)} l{f(w / 2)},{f(-h * 0.6)} l{f(w / 2)},{f(h * 0.6)} v{f(h)} Z'
    if art == 'walm':
        return f'M{f(x)},{f(y)} v{f(-h)} l{f(w * 0.25)},{f(-h * 0.45)} h{f(w * 0.5)} l{f(w * 0.25)},{f(h * 0.45)} v{f(h)} Z'
    return f'M{f(x)},{f(y)} v{f(-h)} h{f(w)} v{f(h)} Z'

hangvillen = []
for x in [360, 455, 520, 600, 690, 1010, 1090, 1180, 1330, 1395]:
    y = yan(hang, x) + 6
    hangvillen.append(villa(x, y, random.randint(10, 15), random.randint(5, 7), random.choice(['walm', 'giebel'])))

# 3) Dorf am Ufer, Kirche, Bäume
KX = 780  # Kirche
vorne, fenster = [], []
def baum(x, art):
    if art == 'pappel':
        h = random.randint(26, 36); return f'M{f(x)},{UFER} c-6,{-h * 0.4} -4,{-h * 0.9} 0,{-h} c4,{h * 0.1} 6,{h * 0.6} 0,{h} Z'
    if art == 'weide':
        r = random.randint(10, 14); return f'M{f(x - r)},{UFER} c0,{-r * 1.6} {r * 2},{-r * 1.6} {r * 2},0 Z'
    r = random.randint(6, 10); return f'M{f(x - r)},{UFER} v-3 a{r},{r} 0 0 1 {2 * r},0 v3 Z'
x = 40
while x < 1560:
    if KX - 70 < x < KX + 60:
        x = KX + 60; continue
    r = random.random()
    if r < 0.5:
        art = random.choice(['giebel', 'giebel', 'walm', 'flach'])
        w = random.randint(16, 30); h = random.randint(10, 20) if art != 'flach' else random.randint(14, 24)
        vorne.append(villa(x, UFER, w, h, art))
        if art == 'giebel' and random.random() < 0.5: vorne.append(f'M{f(x + w * 0.7)},{f(UFER - h - 6)} v-6 h3 v6 Z')
        for fx in range(int(x) + 4, int(x + w) - 4, 7):
            fenster.append(f'M{fx},{UFER - h + 4} h3 v4 h-3 Z')
        x += w + random.randint(1, 6)
    elif r < 0.85:
        art = random.choice(['rund', 'rund', 'pappel', 'weide'])
        vorne.append(baum(x + 8, art)); x += random.randint(14, 24)
    else:
        x += random.randint(18, 40)
# Kirche: Schiff mit steilem Dach, Turm mit Uhr und Spitzhelm
kirche = (f'M{KX - 58},{UFER} v-20 l22,-18 h24 l12,18 v20 Z '
          f'M{KX},{UFER} v-70 h16 v70 Z '
          f'M{KX - 2},{UFER - 70} h20 v-4 h-20 Z '
          f'M{KX - 1},{UFER - 74} L{KX + 8},{UFER - 118} L{KX + 17},{UFER - 74} Z')
kreuz = f'M{KX + 8},{UFER - 118} v-9 M{KX + 4.5},{UFER - 123} h7'
uhr = f'M{KX + 8},{UFER - 58} m-4.5,0 a4.5,4.5 0 1 0 9,0 a4.5,4.5 0 1 0 -9,0 M{KX + 8},{UFER - 58} v-3 M{KX + 8},{UFER - 58} h2.5'
schall = f'M{KX + 4},{UFER - 44} h3 v8 h-3 Z M{KX + 9},{UFER - 44} h3 v8 h-3 Z'
# Bootshaus und Steg
steg = f'M1240,{UFER} h60 v3 h-60 Z M1250,{UFER + 3} v6 M1270,{UFER + 3} v6 M1290,{UFER + 3} v6'

# 4) See: Fähre Meilen–Horgen, Segelboot, Wellen, Spiegelungen
FX, FY = 1060, UFER + 22
faehre = (f'M{FX},{FY} l8,9 h112 l8,-9 Z '            # Rumpf
          f'M{FX + 10},{FY} v-7 h108 v7 Z '             # Autodeck
          f'M{FX + 30},{FY - 7} v-8 h68 v8 Z '          # Oberdeck
          f'M{FX + 54},{FY - 15} v-7 h20 v7 Z '         # Steuerhaus
          f'M{FX + 63},{FY - 22} v-10 h1.5 v10 Z')      # Mast
faehre_fenster = ' '.join(f'M{FX + 34 + i * 8},{FY - 13} h5 v4 h-5 Z' for i in range(8))
flagge = f'M{FX + 64.5},{FY - 32} h7 l-2,3 l2,3 h-7 Z'
SX, SY = 380, UFER + 26
segel = f'M{SX},{SY} l3,6 h30 l4,-6 Z M{SX + 18},{SY - 2} V{SY - 46} L{SX + 36},{SY - 4} Z M{SX + 16},{SY - 40} L{SX + 2},{SY - 4} H{SX + 16} Z'
wellen = ' '.join(f'M{x},{y} q5,-2.5 10,0 t10,0' for x, y in
                  [(90, 182), (240, 194), (520, 186), (640, 200), (860, 184), (930, 198), (1250, 190), (1380, 200), (1500, 184), (1010, 204)])
spiegel = ' '.join(f'M{KX + 2},{UFER + 6 + i * 5} h{12 - i * 2}' for i in range(5))

def svg(inhalt, attrs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" {attrs}>{inhalt}</svg>'

fuss = svg(
    f'<path d="{hinten}" fill="{BRAUN}" fill-opacity=".1"/><path d="{turm}" fill="{BRAUN}" fill-opacity=".1"/>'
    f'<path d="{hang_pfad}" fill="{BRAUN}" fill-opacity=".14"/>'
    f'<path d="{reben}" stroke="{BRAUN}" stroke-opacity=".14" stroke-width="1.2" fill="none"/>'
    f'<path d="{" ".join(hangvillen)}" fill="{BRAUN}" fill-opacity=".25"/>'
    f'<path d="{" ".join(vorne)} {kirche}" fill="{BRAUN}" fill-opacity=".38"/>'
    f'<path d="M0,{UFER} H{W} V{H} H0 Z" fill="{BRAUN}"/>'
    f'<path d="{kreuz}" stroke="{BRAUN}" stroke-opacity=".38" stroke-width="1.6" fill="none"/>'
    f'<path d="{uhr}" stroke="{SAND}" stroke-opacity=".2" stroke-width="1" fill="none"/>'
    f'<path d="{wellen} {spiegel}" stroke="{SAND}" stroke-opacity=".12" stroke-width="1.2" stroke-linecap="round" fill="none"/>'
    f'<path d="{faehre} {segel}" fill="{SAND}" fill-opacity=".13"/>'
    f'<path d="{flagge}" fill="#a33b2a" fill-opacity=".3"/>',
    'preserveAspectRatio="xMidYMax slice"')
open('public/grafik/goldkueste-fuss.svg', 'w').write(fuss)

S = f'stroke="{LEDER}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"'
linie = svg(
    f'<g {S} fill="none">'
    f'<path d="{grat_linie}" stroke-opacity=".55"/><path d="{turm_linie}" stroke-opacity=".55"/>'
    f'<path d="{hang_linie}" stroke-opacity=".75"/>'
    f'<path d="{reben}" stroke-opacity=".35" stroke-width="1"/>'
    f'<path d="{" ".join(hangvillen)}" fill="{SAND}" stroke-opacity=".75"/>'
    f'<path d="{" ".join(vorne)} {kirche}" fill="{SAND}"/>'
    f'<path d="{" ".join(fenster)}" stroke-width=".8" stroke-opacity=".6"/>'
    f'<path d="{kreuz} {uhr} {schall}" stroke-width="1"/>'
    f'<path d="M0,{UFER} H{W}"/><path d="{steg}" stroke-width="1"/>'
    f'<path d="{faehre}" fill="{SAND}"/><path d="{faehre_fenster}" stroke-width=".8"/><path d="{flagge}" fill="#a33b2a" fill-opacity=".5" stroke-width=".8"/>'
    f'<path d="{segel}" fill="{SAND}"/>'
    f'<path d="{wellen} {spiegel}" stroke-opacity=".45"/>'
    '</g>')
open('public/grafik/goldkueste-linie.svg', 'w').write(linie)
print('Goldküste:', len(fuss), len(linie), 'Bytes')
