# 🔑 Freunde-Codes Verwaltung

## Übersicht

Dies ist ein Admin-Guide zur Verwaltung von Aktivierungscodes für Freunde der Outback App.

---

## Aktuell Verfügbare Codes (2024)

Status: **10 Codes verfügbar**

```
FREUND-OUTBACK-2024-001  ✓ Verfügbar
FREUND-OUTBACK-2024-002  ✓ Verfügbar
FREUND-OUTBACK-2024-003  ✓ Verfügbar
FREUND-OUTBACK-2024-004  ✓ Verfügbar
FREUND-OUTBACK-2024-005  ✓ Verfügbar
FREUND-OUTBACK-2024-006  ✓ Verfügbar
FREUND-OUTBACK-2024-007  ✓ Verfügbar
FREUND-OUTBACK-2024-008  ✓ Verfügbar
FREUND-OUTBACK-2024-009  ✓ Verfügbar
FREUND-OUTBACK-2024-010  ✓ Verfügbar
```

---

## Code Generierung

### Naming Convention

```
FREUND-OUTBACK-YYYY-NNN
│      │       │    └── Laufende Nummer (001-999)
│      │       └────── Jahr (2024, 2025, etc.)
│      └────────────── App Name
└───────────────────── Präfix "FREUND" (Freund)
```

### Format
- **Länge:** 25 Zeichen
- **Charset:** A-Z, Zahlen 0-9, Bindestriche
- **Case:** Immer GROSSBUCHSTABEN
- **Besonderheiten:** Leicht zu tippen (keine Umlaute, keine Sonderzeichen)

### Generator Tool (Python)

```python
def generate_friend_codes(year: int, count: int, start_num: int = 1):
    codes = []
    for i in range(count):
        num = str(start_num + i).zfill(3)
        code = f"FREUND-OUTBACK-{year}-{num}"
        codes.append(code)
    return codes

# Generiere 50 Codes für 2025
codes_2025 = generate_friend_codes(2025, 50, 1)
for code in codes_2025:
    print(code)
```

---

## Code Verwaltung

### Hinzufügen neuer Codes

**Datei:** `src/hooks/useActivation.ts`

```typescript
const FRIEND_ACTIVATION_KEYS = [
  // 2024 Codes (10 verfügbar)
  'FREUND-OUTBACK-2024-001',
  'FREUND-OUTBACK-2024-002',
  'FREUND-OUTBACK-2024-003',
  'FREUND-OUTBACK-2024-004',
  'FREUND-OUTBACK-2024-005',
  'FREUND-OUTBACK-2024-006',
  'FREUND-OUTBACK-2024-007',
  'FREUND-OUTBACK-2024-008',
  'FREUND-OUTBACK-2024-009',
  'FREUND-OUTBACK-2024-010',
  
  // 2025 Codes (ab hier neue)
  'FREUND-OUTBACK-2025-001',
  'FREUND-OUTBACK-2025-002',
  // ... mehr Codes ...
];
```

**Schritt für Schritt:**
1. Edit `src/hooks/useActivation.ts`
2. Neuen Code ins Array einfügen
3. Datei speichern
4. `git commit -m "Add new friend activation codes for 2025"`
5. `git push`

### Codes Aufräumen (Alte löschen)

Codes die nicht mehr genutzt werden können gelöscht werden:

```typescript
const FRIEND_ACTIVATION_KEYS = [
  // Alte 2023 Codes entfernt
  
  // 2024 Codes (noch aktuell)
  'FREUND-OUTBACK-2024-001',
  // ...
  
  // 2025 Codes (neu)
  'FREUND-OUTBACK-2025-001',
  // ...
];
```

---

## Code Ausgabe & Verteilung

### Format für Freunde

```
Hallo! 🎉

Hier ist dein Aktivierungscode für die Outback App:

📱 FREUND-OUTBACK-2024-001

Wie du ihn nutzt:
1. Lade die Outback App aus dem App Store
2. Tippe den Code oben ein
3. Aktiviere die App (kostenlos!)

Viel Spaß! 🚐
```

### Sicherheit beim Teilen

✅ **Sicher:**
- SMS / iMessage
- Email (verschlüsselt)
- Signal / Telegram
- In person / Voice

❌ **Nicht sicher:**
- Öffentliche Social Media Posts
- Unverschlüsselte Mail
- Public Discord/Slack

---

## Tracking & Analytics

### Code-Nutzung Checken

Die App speichert benutzte Codes lokal:

```typescript
// In useActivation.ts
const usedKeys = await AsyncStorage.getItem('outback_used_keys');
// Returns: ["FREUND-OUTBACK-2024-001", "FREUND-OUTBACK-2024-003"]
```

**Für echtes Tracking:** Backend implementieren
```typescript
await fetch('https://api.outback.app/track-activation', {
  method: 'POST',
  body: JSON.stringify({
    code: 'FREUND-OUTBACK-2024-001',
    timestamp: new Date(),
    deviceId: getDeviceId(),
  })
});
```

---

## Kontingent & Planung

### Jahresplanung

```
2024:
├─ Q1: 10 Codes (für Freunde-Beta)
├─ Q2: 20 Codes (erweiterter Kreis)
├─ Q3: 30 Codes (Familie + Bekannte)
└─ Q4: 40 Codes (Vorbereitung 2025)
Total: 100 Codes für 2024

2025:
├─ Q1: 50 Codes
├─ Q2: 100 Codes
├─ Q3: 150 Codes
└─ Q4: 200 Codes
Total: 500 Codes für 2025
```

### Reserv-Codes

```
2024:
├─ Verlöschte Codes:      5%
├─ Ungenutzte Reserve:   10%
└─ Aktiv ausgegeben:     85%
```

---

## Troubleshooting

### Code funktioniert nicht

**Mögliche Ursachen:**

1. **Code nicht im Array**
   - Checke ob Code in `FRIEND_ACTIVATION_KEYS` existiert
   - Format muss exakt stimmen

2. **Code bereits benutzt**
   - AsyncStorage speichert benutzte Codes
   - Kann nicht zweimal verwendet werden
   - Nutzer muss anderen Code erhalten

3. **Typo beim Eingeben**
   - Code ist case-insensitive (wird automatisch GROSS)
   - Leerzeichen werden automatisch entfernt
   - Aber Bindestriche müssen korrekt sein

### Lösung: Code Zurücksetzen

```typescript
// In useActivation Hook
const resetActivation = async () => {
  await AsyncStorage.removeItem('outback_used_keys');
  // Code kann jetzt erneut verwendet werden
};
```

---

## Best Practices

### ✅ DO's

1. **Codes in Batches generieren**
   - 10 für Freunde
   - 20 für Familie
   - 50 für Test/Marketing

2. **Dokumentieren wer welchen Code hat**
   ```
   FREUND-OUTBACK-2024-001 → Hans Müller
   FREUND-OUTBACK-2024-002 → Anna Schmidt
   FREUND-OUTBACK-2024-003 → Test User
   ```

3. **Regelmäßig überprüfen**
   - Welche Codes wurden benutzt?
   - Welche sind noch verfügbar?
   - Feedback von Nutzern einholen

4. **Auf Sicherheit achten**
   - Codes nicht öffentlich posten
   - Nicht in Git-Commits hardcoden
   - Rotation jährlich

### ❌ DON'Ts

1. ❌ Unbegrenzte Codes generieren
   - Kannst später nicht trackback wer was verwendet hat

2. ❌ Codes mehrmals verwenden lassen
   - Würde Geschäftsmodell zerstören
   - Eine Person = Ein Code

3. ❌ Codes nie ändern
   - System muss evolutionär sein
   - Sollte später Backend validieren können

4. ❌ Codes im Commit-Log exposé
   - `git log` für immer speichern
   - Verwende `git commit --amend` falls Fehler

---

## Migration zu Backend-System (Zukünftig)

### Phase 1: MVP (Aktuell)
```
Lokal hardcoded + AsyncStorage
Sicherheit: Niedrig
Skalierbarkeit: Begrenzt auf ~100 Codes
```

### Phase 2: Backend API (v1.1)
```
Server speichert gültige Codes
App validiert online
Sicherheit: Mittel
Skalierbarkeit: Unbegrenzt
```

### Phase 3: Admin Dashboard (v2.0)
```
Web UI für Code-Verwaltung
Analytics Dashboard
Rate-Limiting & Fraud Detection
Sicherheit: Hoch
Skalierbarkeit: Enterprise
```

---

## Nützliche Skripte

### Code-Check Script

```bash
#!/bin/bash
# Überprüfe ob alle Codes im Format sind

grep -E "FREUND-OUTBACK-[0-9]{4}-[0-9]{3}" src/hooks/useActivation.ts

# Zähle Codes
grep -c "FREUND-OUTBACK" src/hooks/useActivation.ts
```

### Code-Generierung (Shell)

```bash
#!/bin/bash
# Generiere 20 Codes für 2025

for i in {001..020}; do
  echo "FREUND-OUTBACK-2025-$i"
done
```

---

## Support & Fragen

### Häufig gestellte Fragen

**F: Kann ich einen Code mehrfach verschenken?**
A: Nein. Jeder Code kann nur einmal verwendet werden. Gib jedem Freund einen einzigartigen Code.

**F: Was wenn ein Code nicht funktioniert?**
A: Prüfe:
1. Ist der Code in der Liste in `useActivation.ts`?
2. Wurde der Code schon verwendet?
3. Gibt es Tippfehler?
4. Probiere auf anderem Gerät

**F: Kann ich gekaufte App mit Freunden teilen?**
A: Technisch ja (auf iOS: Family Sharing). Besser: Gib Freunden einen kostenlosen Code.

**F: Wann werden alte Codes ungültig?**
A: Momentan nie. Aber in Zukunft können alte Codes deaktiviert werden.

---

## Verantwortlichkeiten

| Rolle | Aufgaben |
|-------|----------|
| **App Owner** | Codes generieren, vergeben, trackback |
| **Developer** | Codes in App implementieren |
| **QA** | Code-Funktion testen |
| **Support** | Nutzern mit ungültigen Codes helfen |

---

**Last Updated:** 2026-10-04
**Version:** 1.0
**Status:** Ready for Distribution
**Next Review:** 2027-01-01
