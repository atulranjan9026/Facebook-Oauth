const express = require('express');
const request = require('request');
const fs = require('fs');
const https = require('https');

const app = express();
const port = 4000; 

const options = {
  key: fs.readFileSync('path/to/server.key'),
  cert: fs.readFileSync('path/to/server.cert'),
};


app.use(express.static('public'));

// Route to proxy profile pictures
app.get('/profile-picture', (req, res) => {
  const { url } = req.query;
  if (url) {
    request(url).pipe(res);
  } else {
    res.status(400).send('URL query parameter is required.');
  }
});

// Create HTTPS server and listen on port 4000
https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server running on port ${port}`);
});
