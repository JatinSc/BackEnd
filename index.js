const app = require('./src/app')
const mongoose = require("mongoose"); 
let port = 3001
require('dotenv/config');
const db = mongoose.connect(process.env.mongoAtlas,{ useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log("connected to Database"))  
            .catch((err) => console.log(err));  
app.listen(port, () => console.log('Server running......'));  


