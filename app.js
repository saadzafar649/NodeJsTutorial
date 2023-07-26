const express = require("express");
const app = express();
require('./db/connection');
require('./model/index')

app.use(express.json());

app.use('/auth',require('./router/auth'));
app.use('/user',require('./router/user'));
app.use('/history',require('./router/history'));
// app.use('/api',require('./router/auth'));

app.get("/", (req, res) => {
  res.send("hello sent from my server");
});


app.listen(3000,()=>{
  console.log('server is running on port '+3000)
});