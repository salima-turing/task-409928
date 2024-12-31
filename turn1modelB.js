
class DataTransmitter {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.buffer = []; // Data buffering
        this.retryInterval = 1000; // Initial retry interval in milliseconds
        this.maxRetries = 5; // Maximum number of retries
    }

    async sendData(data) {
        this.buffer.push(data);
        this._processBuffer();
    }

    async _processBuffer() {
        while (this.buffer.length > 0) {
            const dataToSend = this.buffer.shift();
            try {
                await this._sendDataInternal(dataToSend);
            } catch (error) {
                console.error('Error sending data:', error.message);
                this._retrySend(dataToSend);
            }
        }
    }

    async _sendDataInternal(data) {
        // Simulate HTTP POST request to the endpoint
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Data sent successfully:', data);
    }

    _retrySend(data) {
        const retryCount = data.retryCount ? data.retryCount + 1 : 1;

        if (retryCount <= this.maxRetries) {
            data.retryCount = retryCount;
            console.log(
                `Retrying to send data in ${this.retryInterval} ms (attempt ${retryCount} of ${this.maxRetries})`
            );

            setTimeout(() => {
                this.sendData(data);
            }, this.retryInterval * retryCount);
        } else {
            console.error('Maximum retries reached. Data discarded:', data);
        }
    }
}

// Example usage:
const dataTransmitter = new DataTransmitter('http://your-server.com/api/data');

// Simulate sending data
dataTransmitter.sendData({ sensorId: '1', temperature: 25.3 });
dataTransmitter.sendData({ sensorId: '2', humidity: 60.5 });
