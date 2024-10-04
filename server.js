const express = require('express');
const { adminRouter } = require('./routes/admin');
const { condidateRouter } = require('./routes/condidate');
const { userRouter } = require('./routes/user');

const app = express();
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/', condidateRouter);


app.listen(3000, ()=> console.log("Server is running..."));