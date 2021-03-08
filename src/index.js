const express = require('express');
const path = require('path');
const handlebars  = require('express-handlebars');
const bodyParser = require('body-parser');
const cors = require('cors')
const dotenv = require('dotenv').config()

const app = express();

const db = require('./config/db');
db.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const route = require('./route/index');

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));


const port = 4000

route(app);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})