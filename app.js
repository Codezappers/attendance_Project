const express = require('express');
const mongoose = require('mongoose');
const app = express();
const yaml = require('yamljs');
const initializeDatabase = require('./data/initializeDatabase.js');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const PORT = process.env.PORT || 3000;

//Swagger documentation

const swaggerDocument = yaml.load('./swagger.yaml');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(async () => { 

    console.log('Connected to MongoDB Database');
    await initializeDatabase(); 
})
.catch((err) => { console.log(`Error connecting to database: ${err}`) });

//View engines
app.set('view engine', 'ejs');
app.set('views', './views');

//Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', authRoutes);
app.use('/', studentRoutes);


app.use((err, res, req, next) =>{
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
    next();
});



//Start server
app.listen(PORT, () =>{
    console.log(`Connected to port ${PORT}`);
});