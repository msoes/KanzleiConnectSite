# ToDo: CloudFront & Custom Domain Setup

Um ein kostenloses **AWS CloudFront** Frontend mit **HTTPS (SSL-Zertifikat)** vor den S3-Bucket zu schalten, müssen in Zukunft folgende Schritte durchgeführt werden:

## 1. Eigene Domain besorgen
- Eine eigene Domain registrieren (z.B. `kanzlei-connect.de` bei einem Anbieter wie Route 53, INWX, Strato, etc.).

## 2. SSL/TLS-Zertifikat beantragen (AWS ACM)
- Im **AWS Certificate Manager (ACM)** ein kostenloses Zertifikat für die Domain ausstellen lassen.
- **WICHTIG:** Das Zertifikat **muss zwingend** in der Region **Nord-Virginia (`us-east-1`)** beantragt werden, damit CloudFront es verwenden kann! (Unabhängig davon, wo der S3-Bucket liegt).

## 3. CloudFront Distribution anlegen
- Im AWS Dashboard eine neue CloudFront Distribution erstellen.
- **Origin:** Den S3 Website-Endpunkt eintragen (z.B. `kanzlei-connect-site.s3-website.eu-central-1.amazonaws.com`).
- **Viewer Protocol Policy:** Auf **"Redirect HTTP to HTTPS"** stellen.
- **Alternate Domain Names (CNAMEs):** Die eigene Domain eintragen (z.B. `kanzlei-connect.de` und `www.kanzlei-connect.de`).
- **Custom SSL Certificate:** Das in Schritt 2 erstellte Zertifikat aus Nord-Virginia auswählen.

## 4. DNS-Routing konfigurieren
- In den DNS-Einstellungen des Domain-Anbieters einen CNAME- oder Alias-Record anlegen.
- Die eigene Domain auf die von AWS generierte CloudFront-Adresse (z.B. `dxyz123.cloudfront.net`) verweisen lassen.

## 5. Sicherheit & Deployment-Skript Update (Empfohlen)
- **S3 Bucket absperren:** Origin Access Control (OAC) in CloudFront einrichten und den S3-Bucket so konfigurieren, dass direkte öffentliche Zugriffe verboten sind (Zugriff nur noch über CloudFront möglich).
- **Deployment Skript (`deploy.sh`) anpassen:** Da CloudFront die Seite weltweit zwischenspeichert (cacht), muss dieser Cache nach einem Update gelöscht werden. Dazu am Ende von `deploy.sh` folgenden Befehl ergänzen:
  ```bash
  aws cloudfront create-invalidation --distribution-id <DEINE_DISTRIBUTION_ID> --paths "/*"
  ```
