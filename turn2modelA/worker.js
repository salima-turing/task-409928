let buffer = [];
let retryLimit = 5;https://github.com/salima-turing/task-409928/tree/main/turn2modelA
let retryDelay = 1000;

self.onmessage = async function(event) {
    const data = event.data;
    buffer.push(data);
    await attemptSend();
};

async function attemptSend() {
    if (buffer.length === 0) return;

    let retryCount = 0;
    while (buffer.length > 0 && retryCount < retryLimit) {
        try {
            const dataToSend = buffer[0];
            await networkRequest(dataToSend);
            self.postMessage(`Data sent successfully: ${dataToSend}`);
            buffer.shift();
            retryCount = 0;
        } catch (error) {
            self.postMessage(`Failed to send data: ${error.message}`);
            retryCount++;
            await delay(retryDelay);
            retryDelay *= 2; // Exponential backoff
        }
    }

    if (retryCount === retryLimit) {
        self.postMessage('Max retries reached. Data will remain in buffer.');
    }
}

async function networkRequest(data) {
    return new Promise((resolve, reject) => {
        const randomSuccess = Math.random() > 0.4; // 60% success rate
        setTimeout(() => {
            if (randomSuccess) {
                resolve(data);
            } else {
                reject(new Error('Network error'));
            }
        }, 500);
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
