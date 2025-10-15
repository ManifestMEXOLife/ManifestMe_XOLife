const express = require('express');
const app = express();

// Use Elastic Beanstalk's PORT environment variable or default to 8080
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
