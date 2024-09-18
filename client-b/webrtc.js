const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});

let dataChannel = null;

// Set up local video
async function setupLocalVideo() {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('localVideo').srcObject = localStream;

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });
}

// Handle remote video track
peerConnection.ontrack = event => {
    const remoteVideo = document.getElementById('remoteVideo');
    if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
    }
};

// Handle data channel
peerConnection.ondatachannel = event => {
    dataChannel = event.channel;
    dataChannel.onopen = () => console.log('Data channel is open.');
    dataChannel.onmessage = event => {
        console.log('Received message:', event.data);
        document.getElementById('receivedMessage').textContent = event.data;
    };
};

peerConnection.onicecandidate = event => {
    if (event.candidate) {
        document.getElementById('iceCandidates').value += JSON.stringify(event.candidate) + '\n';
    }
};

// document.getElementById('startCall').addEventListener('click', async () => {
//    await setupLocalVideo(); // Initialize local video
//    const offer = await peerConnection.createOffer();
//    await peerConnection.setLocalDescription(offer);
//    document.getElementById('offer').value = JSON.stringify(offer);
// });

document.getElementById('setRemote').addEventListener('click', async () => {
    const remoteDesc = new RTCSessionDescription(JSON.parse(document.getElementById('offer').value));
    await peerConnection.setRemoteDescription(remoteDesc);
    if (remoteDesc.type === 'offer') {
        await setupLocalVideo(); // Initialize local video
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        document.getElementById('offer').value = JSON.stringify(answer);
    }
});

document.getElementById('iceCandidates').addEventListener('input', async () => {
    const candidates = document.getElementById('iceCandidates').value.split('\n').filter(Boolean);
    for (const candidate of candidates) {
        await peerConnection.addIceCandidate(JSON.parse(candidate));
    }
});

document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    dataChannel.send(message);
    document.getElementById('message').value = '';
});
