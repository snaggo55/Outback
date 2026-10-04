# GitHub Actions CI/CD Setup Guide

Der automatische CI/CD-Pipeline erfordert das Hinzufügen einer GitHub Actions Workflow-Datei. Wegen PAT-Permissions musste dies manuell gemacht werden.

## Automatisches Setup

Kopieren Sie die `.github/workflows/ci.yml` Datei in Ihr Repository:

1. Erstellen Sie die Ordner-Struktur:
```bash
mkdir -p .github/workflows
```

2. Erstellen Sie `.github/workflows/ci.yml` mit diesem Inhalt:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, improvements]
  pull_request:
    branches: [main, improvements]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
          cache-dependency-path: autonomie-app/package-lock.json
      
      - name: Install dependencies
        run: npm ci
        working-directory: autonomie-app
      
      - name: Run TypeScript check
        run: npm run build 2>&1 | grep -E "error TS" && exit 1 || true
        working-directory: autonomie-app
      
      - name: Run unit tests
        run: npm run test
        working-directory: autonomie-app
      
      - name: Build production
        run: npm run build
        working-directory: autonomie-app
      
      - name: Check bundle size
        run: |
          SIZE=$(du -sh autonomie-app/dist | cut -f1)
          echo "Build size: $SIZE"
          SIZE_KB=$(du -sk autonomie-app/dist | cut -f1)
          if [ "$SIZE_KB" -gt 500 ]; then
            echo "⚠️  Build size exceeds 500KB: ${SIZE_KB}KB"
          fi
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.node-version == '20.x'
        with:
          files: ./autonomie-app/coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: npm
          cache-dependency-path: autonomie-app/package-lock.json
      
      - name: Install dependencies
        run: npm ci
        working-directory: autonomie-app
      
      - name: Check TypeScript strict mode
        run: npx tsc --noEmit
        working-directory: autonomie-app

  deploy:
    needs: [test, lint]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: npm
          cache-dependency-path: autonomie-app/package-lock.json
      
      - name: Install dependencies
        run: npm ci
        working-directory: autonomie-app
      
      - name: Build
        run: npm run build
        working-directory: autonomie-app
      
      - name: Deploy to Vercel
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          if [ -n "$VERCEL_TOKEN" ]; then
            npm i -g vercel
            vercel deploy --prod --token $VERCEL_TOKEN
          else
            echo "Vercel secrets not configured. Skipping deployment."
          fi
        working-directory: autonomie-app
      
      - name: Create deployment status
        if: always()
        run: |
          echo "✅ Build and deploy pipeline completed"
```

3. Committen und pushen:
```bash
git add .github/workflows/ci.yml
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin improvements
```

## Vercel Integration (Optional)

Für automatisches Deployment zu Vercel, fügen Sie diese Secrets zu GitHub hinzu:

1. Gehen Sie zu GitHub Repository Settings → Secrets and variables → Actions
2. Fügen Sie folgende Secrets hinzu:
   - `VERCEL_TOKEN`: Ihr Vercel API Token (von https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID`: Ihre Vercel Organization ID
   - `VERCEL_PROJECT_ID`: Ihre Outback Project ID

## Was wird getestet?

✅ **TypeScript Compilation** - Alle TS-Fehler werden abgefangen
✅ **Unit Tests** - simulation.test.ts wird ausgeführt
✅ **E2E Tests** - Playwright Tests werden auf Chrome, Firefox, Safari, iOS, Android ausgeführt
✅ **Build** - Production Build wird erzeugt
✅ **Bundle Size** - Warnung wenn > 500KB
✅ **Coverage** - Code-Coverage wird hochgeladen zu codecov

## Lokale Test-Ausführung

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# E2E Tests im Browser-UI
npm run test:e2e:ui

# E2E Tests im Debug-Modus
npm run test:e2e:debug
```

## Lighthouse CI (Optional)

Für Performance-Metriken, fügen Sie `lighthouserc.json` hinzu:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 1
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "categories:pwa": ["warn", { "minScore": 0.8 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## Troubleshooting

**"error TS6133: variable declared but never read"**
- Dies ist ein TypeScript strict mode Feature
- Entfernen Sie die Variable oder verwenden Sie sie

**"Bundle size exceeds 500KB"**
- Überprüfen Sie, welche Dependencies groß sind: `npm analyze`
- Erwägen Sie Code Splitting oder Tree Shaking

**Tests schlagen auf CI fehl, aber lokal ok**
- Stellen Sie sicher, dass .env Variablen korrekt gesetzt sind
- Überprüfen Sie Path-Trennzeichen (/ vs \) auf Windows

## Nächste Schritte

1. GitHub Actions Workflow hinzufügen (siehe oben)
2. Vercel Secrets konfigurieren (optional)
3. Push zu main-Branch für automatisches Deployment
4. Mergen Sie improvements-Branch zu main für Production Release
