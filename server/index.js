/* eslint-disable */
// const express = require('express');
// const app = express();
// app.use(express.static('build'));
// app.listen(5000, () => console.log('Listening on port 5000!'));
const history = require('connect-history-api-fallback');
const express = require('express');
const app = express();
app.use(
  history({
    verbose: true
  })
);
app.use(express.static('build'));
app.listen(5000, function() {
  console.log('App is listening on port 5000!');
});
