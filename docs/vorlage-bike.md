---
# VORLAGE für ein neues Bike. Datei kopieren, umbenennen (z. B. harley-davidson-shovelhead-1978.md),
# Werte ausfüllen. Dateien mit _ am Anfang erscheinen nicht auf der Website.
# Fotos: Originale nach fotos-original/forsale/ legen, `npm run fotos` ausführen,
# dann hier mit ../../assets/fotos/forsale/<datei>.jpg verlinken.
title: Harley-Davidson Shovelhead FLH       # Name, wie er auf der Website steht
marke: Harley-Davidson
modell: FLH Electra Glide
jahrgang: 1978
km: 23'000 km                                 # Text, frei formulierbar
mfk: 05.2025                                  # letzte MFK, leer lassen wenn unbekannt
preis: 18500                                  # CHF ohne Punkt/Apostroph, weglassen = «Preis auf Anfrage»
status: verfügbar                             # verfügbar | reserviert | verkauft
kommission: false                             # true = Verkauf in Kommission
order: 10                                     # Reihenfolge in der Übersicht, kleine Zahl = weiter vorne
eingetragen: 2027-01-15
cover: ../../assets/fotos/platzhalter/bike-a.jpg
coverAlt: Harley-Davidson Shovelhead FLH 1978, Seitenansicht
galerie:
  - src: ../../assets/fotos/platzhalter/bike-b.jpg
    alt: Detail Motor
highlights:                                   # 2 bis 4 kurze Stichworte
  - Motor revidiert
  - Originallack
details:                                      # erscheint im Bauzettel
  - label: Motor
    wert: Shovelhead, 1340 ccm
  - label: Getriebe
    wert: 4-Gang
  - label: Farbe
    wert: Schwarz
draft: false                                  # true = noch nicht veröffentlichen
---
Hier die Beschreibung: Geschichte des Bikes, Zustand, was gemacht wurde, was der nächste Besitzer wissen sollte. Zwei bis vier Absätze.
