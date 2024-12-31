<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Worker Example</title>
</head>
<body>
    <h1>Edge Device Simulation with Web Workers</h1>
    <button id="startButton">Start Sending Data</button>
    <div id="status"></div>

    <script>
        const worker = new Worker('worker.js');

        // Update UI based on messages from the worker
        worker.onmessage = function(event) {
            const statusDiv = document.getElementById('status');
            statusDiv.innerText += event.data + '\n';
        };

        document.getElementById('startButton').addEventListener('click', () => {
            setInterval(() => {
                const data = `Sensor reading at ${new Date().toISOString()}`;
                console.log(`Main thread buffering data: ${data}`);
                worker.postMessage(data);
            }, 2000);
        });
    </script>
</body>
</html>
