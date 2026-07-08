import https from 'https';

export const handler = async (event) => {
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    
    // API Gateway HTTP API puts the path in event.rawPath
    const path = event.rawPath || event.path;
    
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (path === '/auth') {
        return {
            statusCode: 302,
            headers: {
                ...headers,
                Location: `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`
            }
        };
    }

    if (path === '/callback') {
        const code = event.queryStringParameters ? event.queryStringParameters.code : null;
        if (!code) {
            return { statusCode: 400, body: "Missing code" };
        }

        try {
            const tokenResponse = await new Promise((resolve, reject) => {
                const data = JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code: code
                });
                
                const req = https.request('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Content-Length': data.length
                    }
                }, (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => resolve(JSON.parse(body)));
                });
                
                req.on('error', reject);
                req.write(data);
                req.end();
            });

            const token = tokenResponse.access_token;
            
            const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head><meta charset="utf-8"></head>
            <body>
            <script>
              function receiveMessage(e) {
                window.opener.postMessage(
                  'authorization:github:success:{"token":"${token}","provider":"github"}',
                  e.origin
                );
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:github", "*");
            </script>
            </body>
            </html>
            `;

            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    "Content-Type": "text/html"
                },
                body: html
            };

        } catch (error) {
            return { statusCode: 500, body: "Internal Server Error: " + error.message };
        }
    }

    return { statusCode: 404, body: "Not Found" };
};
