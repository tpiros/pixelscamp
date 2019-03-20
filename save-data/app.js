const express = require('express');
const app = express();
const port = 3000;
let saveData = false;
app.set('view engine', 'pug');
app.use(express.static('views'));

app.get('/', (req, res) => {
  if (req.headers['save-data'] === 'on') {
    saveData = true;
  } else {
    saveData = false;
  }
  return res.render('index', {
    saveData
  });
});
app.listen(port, () => console.info(`Magic happening on port ${port}`));