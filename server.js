// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

const dateParser = (req, res, next) => {
  const { date = '' } = req.params;
  let paresedDateUTC, timestampUnix;

  if (date === '') {
    return res
      .status(200)
      .json({ unix: Date.now(), utc: new Date(Date.now()).toUTCString() });
  }

  if (!isNaN(Number(date))) {
    paresedDateUTC = new Date(Number(date)).toUTCString();
    timestampUnix = Number(date);
  } else {
    paresedDateUTC = new Date(date).toUTCString();
    timestampUnix = new Date(paresedDateUTC).getTime();
  }

  if (paresedDateUTC !== 'Invalid Date') {
    return res.status(200).json({ unix: timestampUnix, utc: paresedDateUTC });
  }

  res.status(200).json({ error: paresedDateUTC });
};
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/timestamp', dateParser);
app.get('/api/timestamp/:date', dateParser);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
