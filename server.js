import express from 'express';
import routes from './routes/index.js';
// create the server
const app = express();

// port 5500 for me
const PORT = process.env.PORT || 5503;
// load routes from routes/index.js
app.use('/', routes);
// listen on port
app.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});
