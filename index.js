const express = require('express'),
        path = require('path'),
        cors = require('cors'),
        mongoose = require('./server/helpers/mongoose'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname + '/'));

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(cors());
const port = process.env.PORT || 4000;
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
);

require('./server/routes/route')(app);


app.get('*', function(req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

const http = require('http').Server(app);

http.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Started AMSS Dashboard');
    console.log('Listening on port ' + config.port);
  }
});


process.on('uncaughtException', function(err) {
});