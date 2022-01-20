const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


const app = express();
app.use(cors())

//connect database
connectDB();

//Init Midleware to parse body (It will allow data in request.body)
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send("API is running"));


//Define Route
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is started at port ${PORT}`));

