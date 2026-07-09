# ToDo

## 1. CloudFront & Custom Domain Setup
To set up a free **AWS CloudFront** frontend with **HTTPS (SSL Certificate)** in front of the S3 bucket, follow these steps:

### 1.1 Obtain a Custom Domain
- Register a custom domain (e.g., `kanzlei-connect.ch` or `kanzlei-connect.com`) with a provider like Route 53, INWX, Strato, etc.

### 1.2 Request SSL/TLS Certificate (AWS ACM)
- Request a free SSL certificate for the domain in the **AWS Certificate Manager (ACM)**.
- **CRITICAL:** The certificate **must** be requested in the **North Virginia (`us-east-1`)** region for CloudFront to be able to use it (regardless of where the S3 bucket is hosted).

### 1.3 Create a CloudFront Distribution
- Create a new CloudFront Distribution in the AWS dashboard.
- **Origin:** Enter the S3 website endpoint (e.g., `kanzlei-connect-site.s3-website.eu-central-1.amazonaws.com`).
- **Viewer Protocol Policy:** Set to **"Redirect HTTP to HTTPS"**.
- **Alternate Domain Names (CNAMEs):** Enter your custom domain names (e.g., `kanzlei-connect.ch` and `www.kanzlei-connect.ch`).
- **Custom SSL Certificate:** Select the certificate created in step 1.2 (from North Virginia).

### 1.4 Configure DNS Routing
- Add a CNAME or Alias record in your domain provider's DNS settings.
- Point your custom domain to the AWS-generated CloudFront domain (e.g., `dxyz123.cloudfront.net`).

### 1.5 Security & Deployment Script Update (Recommended)
- **Lock down S3 Bucket:** Set up Origin Access Control (OAC) in CloudFront and configure the S3 bucket to deny direct public access (meaning the site can only be accessed securely via CloudFront).
- **Update Deployment Script (`deploy.sh`):** Since CloudFront caches the website globally, this cache needs to be cleared (invalidated) after every update. Add the following command to the end of `deploy.sh`:
  ```bash
  aws cloudfront create-invalidation --distribution-id <YOUR_DISTRIBUTION_ID> --paths "/*"
  ```

## 2. Decap CMS Media Library Optimization (External S3 Storage)
Currently, images uploaded via the CMS are committed directly to the GitHub repository. As the photo archive grows, this will bloat the repository size over time. 

To optimize this for the long term:
- **Set up an AWS S3 Media Library:** Configure Decap CMS to upload media assets directly to a dedicated S3 bucket instead of committing them to Git.
- **Update CMS Config:** Modify `static/admin/config.yml` to use the `aws_s3` media library integration. This keeps the Git repository small (text-only) and fast, while AWS handles the heavy media files.
