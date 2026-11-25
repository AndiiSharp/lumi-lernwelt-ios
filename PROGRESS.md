# Lumi Lernwelt (iOS) – Stand 25.11.2026

Lern-App für Kinder (Vorschule bis 4. Klasse): Einmaleins, Rechnen bis 100, Uhr lernen, Lesen & Schreiben.
App-ID `de.lumvero.lumi`, Capacitor 8.6 + Haptics, Deutsch/Englisch, komplett offline, keine Werbung/Käufe/Daten.

## Fertig und getestet
- 4 Welten, 51 Level, 9 Aufgabentypen (Zahlen-Tastatur, Auswahl, Uhr lesen, Uhr stellen per Zeiger, Buchstaben nachspuren,
  Wörter bauen, Silben, der/die/das bzw. a/an, „Stimmt das?“), adaptives Einmaleins-Training (Leitner + Tempo), Einmaleins-Karte,
  freie Uhr, Sterne, 48 Sticker, 15 Abzeichen, Lumi-Level + Hüte, Tagesziel, Serie, Pausen-Erinnerung, bis 6 Kinderprofile,
  Elternbereich mit Elternabfrage, Vorlesen (Sprachausgabe des Geräts).
- Tests: `node tools/test-engine.mjs` (673.000 Prüfungen ok), `node tools/test-webkit.mjs` (alle 51 Level DE+EN durchgespielt,
  132/134 ok – die 2 „Fehler“ waren nur das lokal fehlende capacitor.js, inzwischen ausgefiltert), `node tools/test-demo.mjs` (Prüfvideo-Rundgang ok).
- Quellen/Ideen: 12 Open-Source-Repos geprüft (`projekte\lumvero-kids-refs`, REA-Analyse in `_rea\`). Nur Ideen übernommen
  (EduClock for Kids MIT: farbige Stunden; Flashy MIT: Welten/Level; Addition Game MIT: Punktebilder; Multiplay: Lernstufen-Idee, ohne Code).
  Ein Repo (letter_learning_game) verbietet Nutzung durch Anthropic → sofort gelöscht, nicht verwendet.
- Grafiken: Twemoji (CC-BY 4.0), Schriften Nunito + Andika (OFL), Lumi-Maskottchen selbst gezeichnet (`www/art.js`).
- Store: 36 Grafiken `ios-tools\aso\store4\lumi`, Texte `ios-tools\aso\metadata4.json`, Prüfhinweise in `asc-info21.mjs` (lumi),
  Datenschutz/Support: https://andiisharp.github.io/lumvero-apps/lumi-datenschutz.html
- Bundle-ID registriert, Profil-UUID 96efd01d-bb5b-4d9e-98d7-b8dd3fcd4ade. Repo AndiiSharp/lumi-lernwelt-ios (privat).

## Offen (braucht den Nutzer)
1. Repo öffentlich machen (privates Actions-Kontingent leer → Mac-Build startet nicht). Erst danach Cloud-Build + Prüfvideo.
2. App in App Store Connect anlegen (nur per Weboberfläche, Anmeldung nötig).
Danach: Metadaten/Bilder hochladen, Video als Release-Asset, Prüfhinweise, Altersfreigabe 4+, Datenschutz „keine Daten“, einreichen.
