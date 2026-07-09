# Social Club Connect Website

This repository contains the source code for our Social Club's website, built with modern static site generator technologies to ensure it remains 100% free, blisteringly fast, and completely secure.

## 🎯 Goals

1. **The Serverless / Static Route (100% Free)**
   - Utilize a Static Site Generator (SSG) rather than a continuously running virtual machine.
   - Keep the site lightweight and fully compatible with the AWS Free Tier (AWS Amplify or S3/CloudFront) or Netlify.
   - Eliminate server overhead, hacking vulnerabilities, and monthly flat fees.

2. **The Club Dashboard (CMS)**
   - Integrate **Decap CMS** (formerly Netlify CMS) to allow non-technical club members to easily log in.
   - Provide an intuitive dashboard to write blog posts, add news, and upload images into the gallery without touching code.

3. **Premium "Look & Feel"**
   - Create a rich, premium aesthetic that wows visitors at first glance.
   - Move away from generic themes to a highly customized, visually engaging interface.

## 🎨 Current Design

The visual identity of the club website is built on a custom Hugo theme (`club-theme`) designed with the following aesthetic principles:

- **Glassmorphism Interface**: Navigation bars and content cards utilize translucent, frosted-glass effects (`backdrop-filter`) that float cleanly over the background.
- **Sunny Courtyard Theme**: The base design is a bright, daytime aesthetic (`#FDFBF7`), accented with sky blue (`#00AEEF`) and warm golden yellow (`#FFC107`) to match the official event flyers.
- **Modern Typography**: Utilizes Google's **Outfit** and **Inter** fonts to deliver a sleek, highly legible, and premium appearance.
- **Micro-animations**: Elements like the hero section and article cards feature smooth slide-up animations on load and engaging hover physics (shadow expansion, translation) to encourage user interaction.

## 🛠️ Implementation Details

### Tech Stack
- **Hugo**: The world’s fastest framework for building websites. It compiles our content into static HTML in milliseconds.
- **Decap CMS**: Configured natively via `static/admin/index.html` and `static/admin/config.yml`.

### Project Structure
- `hugo.toml`: The main configuration file for the Hugo site.
- `themes/club-theme/`: Our custom-built theme containing all HTML layouts and CSS.
  - `layouts/index.html`: The hero homepage showcasing latest news.
  - `layouts/partials/`: Reusable components (Header, Footer, Head).
  - `layouts/blog/` & `layouts/gallery/`: Custom list and single-item views for our two primary content types.
  - `static/css/style.css`: The global stylesheet handling CSS variables, glassmorphism, and animations.
- `content/blog/`: Markdown files for news and updates.
- `content/gallery/`: Markdown files for visual event memories.
- `static/images/uploads/`: The target folder where Decap CMS deposits user-uploaded images.

### Content Collections
Decap CMS is configured with two distinct collections:
1. **Blog**: Allows members to publish text-heavy news updates with a featured thumbnail.
2. **Gallery**: Tailored for visual uploads with simple captions.

## 🏗️ AWS Infrastructure

Our complete architecture relies entirely on 100% serverless, highly-scalable, and virtually free AWS resources:

1. **Amazon S3 (Simple Storage Service)**
   - **Bucket:** `kanzlei-connect-site`
   - **Region:** `eu-central-1` (Frankfurt)
   - **Purpose:** Hosts all our compiled static HTML, CSS, JavaScript, and image files. Configured for Static Website Hosting.

2. **AWS Lambda & API Gateway (OAuth Proxy)**
   - **Stack:** `KanzleiConnectOAuth`
   - **Region:** `eu-central-1` (Frankfurt)
   - **Purpose:** Provides a tiny, serverless authentication bridge (OAuth) so our club members can log into the Decap CMS dashboard securely using their GitHub accounts, without us needing to pay for a 24/7 backend server.

3. **AWS Certificate Manager (ACM)**
   - **Region:** `us-east-1` (North Virginia)
   - **Purpose:** Automatically provisions, stores, and manages our free, auto-renewing SSL/TLS certificate for the custom domain (`kanzlei-connect.ch`). It must be in North Virginia to be compatible with CloudFront.

4. **Amazon CloudFront (Pending Setup)**
   - **Purpose:** A global Content Delivery Network (CDN) that will sit in front of our S3 bucket. It caches our website at edge locations worldwide for lightning-fast loading speeds and applies our SSL certificate to ensure a secure HTTPS connection.

## 🚀 Running Locally

To run the site on your own machine:

1. Ensure [Hugo](https://gohugo.io/installation/) is installed on your machine.
2. Run the local development server (with drafts enabled):
   ```bash
   hugo server -D
   ```
3. Visit `http://localhost:1313/` to view the site.
4. Visit `http://localhost:1313/admin/` to access the Decap CMS dashboard.

## ☁️ Deployment (AWS)

We use an automated bash script to compile the website and sync it directly to an AWS S3 Bucket configured for static website hosting.

To deploy new changes to the live site:

1. Ensure your AWS CLI is configured with the correct access keys (`aws configure`).
2. Run the deployment script from the project root:
   ```bash
   ./deploy.sh
   ```

The script will automatically clear the old cache, rebuild the static HTML with Hugo, and safely synchronize the `public/` directory with the `kanzlei-connect-site` S3 bucket.
