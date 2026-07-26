# KanzleiConnect – Architecture & Documentation

This repository contains the complete source code and infrastructure configuration for **KanzleiConnect**, a fully serverless, highly-scalable, and free-to-host static website built with Hugo and AWS.

## 🏗️ AWS Infrastructure & System Architecture

The entire system is designed to run without traditional web servers, utilizing AWS's global infrastructure for maximum speed, security, and cost-efficiency.

| AWS Service | Role in the System | Region |
|-------------|--------------------|--------|
| **Amazon S3** | **Storage & Hosting:** The `kanzlei-connect-site` bucket stores all compiled static files (HTML/CSS/JS/Images) and acts as the origin web server. | `eu-central-1` |
| **AWS CloudFront** | **CDN & Security:** A global Content Delivery Network sitting in front of the S3 bucket. It caches the site globally for lightning-fast speeds and applies the SSL certificate. | Global |
| **AWS ACM** | **SSL Certificate:** Automatically provisions and manages the free HTTPS certificate for `kanzlei-connect.ch`. | `us-east-1` |
| **AWS Lambda** | **OAuth Proxy:** A tiny serverless function (Node.js 22) that bridges GitHub's OAuth system, allowing users to log into the CMS without a dedicated backend server. | `eu-central-1` |
| **API Gateway** | **OAuth Routing:** Exposes the Lambda function to the web so the CMS can communicate with it securely during login. | `eu-central-1` |

---

## ✍️ Content Management (Editing, Updating, Deleting Content)

We use **Decap CMS** to provide a user-friendly, graphical interface for club members to manage the website's content without needing to understand code or Git.

### For Club Members & Non-Technical Users
All daily content updates are done directly through the browser.
- 📖 **[Read the Step-by-Step Editor Guide (in German)](./EDITOR_GUIDE.md)**

**Brief Overview:**
1. **Log in:** Go to `https://kanzlei-connect.ch/admin/` and authenticate via your GitHub account.
2. **Edit/Update:** Click on an existing post in "Kanzlei-Leben" or "Galerie" to edit text or images, then click "Publish".
3. **Create:** Click "New" in the respective collection to draft and publish new content.
4. **Delete:** Open a post in the CMS and click "Delete entry" to permanently remove it from the site.

Every change made in the CMS automatically commits a markdown file update to this GitHub repository.

---

## 💻 Site Management (Editing, Updating, Deleting the Site Structure)

For developers wanting to change the layout, styling, or functionality of the website itself, the site is built using **Hugo** (a fast Static Site Generator).

### Project Structure
- `hugo.toml`: The global configuration file (site title, language, etc.).
- `themes/club-theme/`: Contains all HTML templates and CSS styling.
  - `layouts/index.html`: The hero homepage showcasing latest news.
  - `layouts/kanzlei-leben/` & `layouts/gallery/`: Views for our specific content types.
  - `static/css/style.css`: The main stylesheet featuring our custom glassmorphism design.
- `content/`: The actual markdown files backing the CMS.
- `oauth-proxy/` & `template.yaml`: The AWS SAM infrastructure code for the login proxy.

### Running Locally
To modify the site's code and preview it:
1. Install [Hugo](https://gohugo.io/installation/).
2. Run `hugo server -D` in the terminal.
3. Open `http://localhost:1313/` to see live changes in your browser.

### Deploying Site Updates
We use an automated bash script to compile the site and push it to AWS. After modifying code locally:
1. Ensure your AWS CLI is authenticated.
2. Run `./deploy.sh` in the terminal.
This script will build the static HTML, sync it to the S3 bucket, and instantly clear the CloudFront cache so changes appear immediately.

### Deleting the Entire Site
If you ever need to completely take down the website:
1. Delete the AWS CloudFormation stack `KanzleiConnectOAuth` via the AWS Console.
2. Disable and delete the CloudFront Distribution.
3. Empty and delete the S3 Bucket `kanzlei-connect-site`.
4. Delete the DNS CNAME records at your domain registrar (Hostpoint).
