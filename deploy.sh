#!/bin/bash

# Abort on error
set -e

echo "🚀 Starte Deployment für Kanzlei Connect..."

echo "🧹 Lösche alten Cache..."
rm -rf public/

echo "🏗️ Generiere neue statische Dateien mit Hugo..."
hugo -D

echo "☁️ Synchronisiere mit AWS S3 Bucket..."
# --delete sorgt dafür, dass lokal gelöschte Dateien auch auf AWS gelöscht werden
aws s3 sync public/ s3://kanzlei-connect-site/ --delete

echo "✅ Deployment erfolgreich abgeschlossen!"
echo "Die Webseite ist erreichbar unter: http://kanzlei-connect-site.s3-website.eu-central-1.amazonaws.com/"
