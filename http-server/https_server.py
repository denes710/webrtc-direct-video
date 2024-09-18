import http.server
import ssl
import os
import sys

def main():
    # Check if the root directory is provided as a command-line argument
    if len(sys.argv) != 3:
        print("Usage: python3 https_server.py <root_directory> <port>")
        sys.exit(1)

    root_dir = sys.argv[1]
    port_num = int(sys.argv[2])

    # Check if the provided root directory exists
    if not os.path.isdir(root_dir):
        print(f"The directory '{root_dir}' does not exist.")
        sys.exit(1)

    # Ensure the server key and certificate are in the same directory as this script
    keyfile = 'server.key'
    certfile = 'server.crt'

    # Create an SSL context
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=certfile, keyfile=keyfile)

    # Change the working directory to the root directory
    os.chdir(root_dir)

    # Set up the server
    server_address = ('', port_num)
    httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

    # Wrap the server's socket with the SSL context
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    print(f'Serving on https://localhost:{port_num} from {root_dir}')
    httpd.serve_forever()

if __name__ == "__main__":
    main()
