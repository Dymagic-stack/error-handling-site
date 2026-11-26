# OWASP A10 Lernseite

Eine statische Beispielseite für **Mishandling of Exceptional Conditions**.

Die Seite demonstriert anhand eines Benutzerprofil-Suchdienstes drei Varianten:

1. Unsichere Fehlerausgabe mit technischen Details
2. Generische, für den Nutzer wenig hilfreiche Meldung
3. Sichere, nachvollziehbare Fehlerbehandlung

## Start

Öffne `index.html` direkt im Browser oder starte einen lokalen Server:

```powershell
python -m http.server 5500
```

Danach `http://localhost:5500` aufrufen.
