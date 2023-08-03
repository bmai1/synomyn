// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')

// include the Node.js 'path' module at the top of your file
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1000,
      height: 1000,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, 'preload.js')
      }
    })
    
    win.loadFile('templates/index.html')
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    createWindow()
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })


// Handle form data received from the renderer process
ipcMain.on('form-data', (event, formData) => {
  console.log(formData);
  let ytURL = formData;

  // Process the form data or perform other tasks as needed
  // ...

  const { spawn } = require('child_process');

  // Replace 'python' with the appropriate command to run Python on your system (e.g., 'python3' on some systems)
  const pythonCommand = 'python3';

  // The path to your Python script
  const pythonScriptPath = 'scripts/ytmp3.py';

  // Execute the Python script using the child_process module
  const pythonProcess = spawn(pythonCommand, [pythonScriptPath]);

  // Send input data to the Python script
  pythonProcess.stdin.write(ytURL);
  pythonProcess.stdin.end();

  // Receive output from the Python script
  pythonProcess.stdout.on('data', (data) => {
    console.log("converting...\n");
    console.log(data.toString())
  });

  // Handle errors, if any
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error in the Python script: ${data}`);
  });

  // Handle process exit
  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });

  // Send a response back to the renderer process
  event.sender.send('form-data-processed', 'Form data received and processed successfully.');
});



