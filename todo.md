# ToDo

## 1. S3 Bucket Security (Optional)
- **Lock down S3 Bucket:** Currently, the S3 website endpoint is public. To maximize security and force all traffic through CloudFront, we can set up a custom HTTP header (e.g., `Referer: SecretKey`) in CloudFront and attach a strict S3 bucket policy that only allows read access if that specific header is present.

## 2. Decap CMS Media Library Optimization (External S3 Storage)
Currently, images uploaded via the CMS are committed directly to the GitHub repository. As the photo archive grows, this will bloat the repository size over time. 

To optimize this for the long term:
- **Set up an AWS S3 Media Library:** Configure Decap CMS to upload media assets directly to a dedicated S3 bucket instead of committing them to Git.
- **Update CMS Config:** Modify `static/admin/config.yml` to use the `aws_s3` media library integration. This keeps the Git repository small (text-only) and fast, while AWS handles the heavy media files.
