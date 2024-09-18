# Simple WebRTC Video Direct App
## Run
To host the `client-a` and `client-b` apps, use the `http-server`.

### client-a:
```bash
python3 https_server.py ../client-a 8000
```

### client-b:
```bash
python3 https_server.py ../client-b 8000
```

## Certificates
You need to generate SSL certificates in the same directory as the Python script for the HTTP server:
```bash
openssl genpkey -algorithm RSA -out server.key -aes256
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

