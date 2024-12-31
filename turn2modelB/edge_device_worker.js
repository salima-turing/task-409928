'use strict';

self.onmessage = function(event) {
    const data = event.data;
    new EdgeDeviceWorker(data).start();
};

class EdgeDeviceWorker {
    constructor(data) {
        this.buffer = [];
        this.retryLimit = 5;
        this.retryDelay = 1000;
        this.data = data;
    }

    start() {
        this.buffer.push(this.data);
        this.attemptSend();
    }

    async attemptSend() {
        while (this.buffer.length > 0) {
            const dataToSend = this.buffer[0];
            try {
                await this.networkRequest(dataToSend);
                console.log(`Data sent successfully from Worker: ${dataToSend}`);
                self.postMessage({ status: 'success', data: dataToSend });
                this.buffer.shift();
            } catch (error) {
                console.error(`Failed to send data from Worker: ${error.message}`);
                this.retry(dataToSend);
            }
        }
    }

    retry(dataToSend) {
        const retryCount = (this.buffer.findIndex(d => d === dataToSend) || -1) + 1;
        if (retryCount <= this.retryLimit) {
            console.log(`Retrying sending data "${dataToSend}" after ${this.retryDelay} ms...`);
            setTimeout(() => {
                this.attemptSend();
            }, this.retryDelay * retryCount);
        } else {
            console.error('Max retries reached. Data discarded.');
            this.buffer = this.buffer.filter(d => d !== dataToSend);
            self.postMessage({ status: 'error', data: dataToSend, reason: 'Max retries reached' });
        }
    }

    async networkRequest(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const randomSuccess = Math.random() > 0.4;
                if (randomSuccess) {
                    resolve(data);
                } else {
                    reject(new Error('Network error'));
                }
            }, 500);
        });
    }
}
