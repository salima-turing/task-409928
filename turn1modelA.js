class EdgeDevice {
    constructor() {
        this.buffer = [];
        this.retryLimit = 5; // Maximum number of retries
        this.retryDelay = 1000; // Initial retry delay in ms
    }

    // Method to send data
    async sendData(data) {
        this.buffer.push(data);
        await this.attemptSend();
    }

    // Method to attempt sending buffered data
    async attemptSend() {
        if (this.buffer.length === 0) return;

        // Try sending the buffered data
        let retryCount = 0;
        while (this.buffer.length > 0 && retryCount < this.retryLimit) {
            try {
                const dataToSend = this.buffer[0]; // Send the first item in the buffer
                await this.networkRequest(dataToSend);
                console.log(`Data sent successfully: ${dataToSend}`);
                this.buffer.shift(); // Remove the sent data from the buffer
                retryCount = 0; // Reset retry count after successful send
            } catch (error) {
                console.error(`Failed to send data: ${error.message}`);
                retryCount++;
                // Wait before the next retry
                await this.delay(this.retryDelay);
                this.retryDelay *= 2; // Exponential backoff
            }
        }

        if (retryCount === this.retryLimit) {
            console.error('Max retries reached. Data will remain in buffer.');
        }
    }

    // Simulated network request
    async networkRequest(data) {
        return new Promise((resolve, reject) => {
            // Simulate random network failure
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

    // Delay function for retry mechanism
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Usage example
const edgeDevice = new EdgeDevice();

// Simulating data sending
setInterval(() => {
    const data = `Sensor reading at ${new Date().toISOString()}`;
    console.log(`Buffering data: ${data}`);
    edgeDevice.sendData(data);
}, 2000);
