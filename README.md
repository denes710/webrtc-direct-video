# Simple WebRTC Video Direct App
## Run
To host the `client-a` and `client-b` apps, use the `http-server`.

### client-a:
```bash
python3 https_server.py ../client-a 8000
```

### client-b:
```bash
python3 https_server.py ../client-b 8002
```

## Usage:
1. Click 'Start Call' on the 'client-a' page to generate the SDP offer.
2. Copy the SDP offer and paste it into the 'client-b' page, then click 'Set Remote Description'. This will generate the SDP answer on the 'client-b' page.
3. Copy the SDP answer from 'client-b' and paste it into the 'client-a' page, then click 'Set Remote Description'.
4. Next, copy and paste the ICE candidates between the two pages. They are applied automatically.
5. If everything works correctly, the video call will be established, and you should see two video streams on both pages.

## Certificates
You need to generate SSL certificates in the same directory as the Python script for the HTTP server:
```bash
openssl genpkey -algorithm RSA -out server.key -aes256
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

