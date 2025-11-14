# Trading Journal

Eine einfache, persönliche Trading Journal Website zum Dokumentieren und Analysieren deiner Trades.

## Features

- **Trade-Tracking**: Erfasse alle wichtigen Details deiner Trades (Symbol, Richtung, Entry/Exit, P&L)
- **Chart-Integration**: Lade Screenshots deiner Trading-Charts hoch
- **Statistiken**: Automatische Berechnung von Gesamt-P&L, Gewinn-/Verlust-Rate
- **Filter**: Filtere Trades nach Richtung (Long/Short) oder Performance (Gewinner/Verlierer)
- **Lokale Speicherung**: Alle Daten werden im Browser gespeichert (LocalStorage)

## Verwendung

1. Öffne die `index.html` Datei in deinem Browser
2. Füge einen neuen Trade hinzu:
   - Wähle das Datum
   - Gib das Symbol ein (z.B. EUR/USD, AAPL)
   - Wähle die Richtung (Long/Short)
   - Optional: Positionsgröße, Entry/Exit Preise
   - Gib den P&L in Euro ein
   - Optional: Lade ein Chart-Bild hoch
   - Optional: Füge Notizen hinzu (Trading-Setup, Gründe, Emotionen)
3. Klicke auf "Trade hinzufügen"
4. Deine Trades werden automatisch gespeichert

## Funktionen

- **Statistik-Übersicht**: Zeigt Gesamt-Trades, Gewinner, Verlierer und Gesamt-P&L
- **Filter**: Filtere deine Trades nach verschiedenen Kriterien
- **Chart-Ansicht**: Klicke auf ein Chart-Bild, um es in voller Größe anzuzeigen
- **Löschen**: Entferne Trades, die du nicht mehr benötigst

## Technische Details

- Reine Client-Side Anwendung (HTML, CSS, JavaScript)
- Keine Server-Anforderungen
- Daten werden lokal im Browser gespeichert
- Bilder werden als Base64 gespeichert

## Hinweise

- Alle Daten werden nur in deinem Browser gespeichert
- Lösche keine Browser-Daten, um deine Trades nicht zu verlieren
- Für Backups kannst du die Browser-LocalStorage exportieren
