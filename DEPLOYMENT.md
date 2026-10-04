# Deployment Guide - Outback

## Overview

Die Outback App ist produktionsbereit und kann auf mehreren Plattformen deployed werden. Die App ist optimiert für:
- Schnelle Load Times (PWA mit Service Worker)
- Mobile Geräte (responsive Design)
- Offline-Funktionalität (Presets im localStorage)

## Deployment Optionen

### Option 1: Vercel (Empfohlen)

Vercel ist das einfachste Setup für diese App.

1. **Vorbereitung:**
   ```bash
   npm run build  # Test build lokal
   ```

2. **Deploy zu Vercel:**
   - Gehe zu https://vercel.com
   - Wähle "New Project"
   - Verbinde dein GitHub Repository
   - Vercel wird automatisch vite.config.ts und vercel.json erkennen
   - Klicke "Deploy"

3. **Automatische Deployments:**
   - Nach Push zu `main` oder `improvements` wird automatisch deployed
   - Deployments sind instant (Vercel Serverless Functions)

### Option 2: Netlify

Netlify ist auch eine gute Alternative.

1. **Deploy zu Netlify:**
   - Gehe zu https://netlify.com
   - Wähle "New site from Git"
   - Verbinde dein GitHub Repository
   - Netlify wird `.netlify.toml` automatisch erkennen
   - Klicke "Deploy site"

2. **Build Settings:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Option 3: Docker

Für private/enterprise Deployments:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Produktions-Checklist

- ✅ Build Tests lokalen durchgeführt
- ✅ TypeScript Fehler behoben
- ✅ Production Build unter 200KB (gzipped)
- ✅ PWA Manifest konfiguriert
- ✅ Service Worker aktiviert
- ✅ Mobile responsive Design
- ✅ Presets Feature getestet
- ✅ Error Handling implementiert

## Performance Optimierungen

### Code Splitting
- React bundle: 42.85KB (gzipped)
- i18n bundle: 18.20KB (gzipped)
- CSS: 1.61KB (gzipped)

### Caching Strategy
- Static Assets: 1 Jahr (immutable)
- HTML: no-cache (überprüft immer)
- API: no-cache

### PWA Features
- Service Worker: offline-first
- Web Manifest: installierbar
- Icon-Pack: 192x192, 512x512

## Umgebungsvariablen

Production:
```env
VITE_APP_NAME=Outback
VITE_APP_DESCRIPTION=LiFePO4 Battery Autonomy Calculator
```

## Monitoring

Nach Deployment überprüfe:
- Lighthouse Score (sollte > 90)
- Load Time (sollte < 2s)
- PWA Funktionalität (offline mode)
- Mobile Responsive (375px - 1920px)

## Rollback

Falls ein Deployment fehlschlägt:
1. Vercel/Netlify zeigt automatisch vorherige Versionen
2. Einfach auf eine vorherige Version klicken zum Rollback
3. Keine manuelle Intervention nötig

## Support

- Issues: https://github.com/snaggo55/Outback/issues
- GitHub Discussions: https://github.com/snaggo55/Outback/discussions
