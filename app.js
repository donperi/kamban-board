const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { setupDatabase } = require('./db');

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

const tasksRouter = require('./routes/tasks');

(async () => {
  await setupDatabase();

  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(tasksRouter);

  app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

  app.listen(port);
  console.log('App is listening on port ' + port);
})();

