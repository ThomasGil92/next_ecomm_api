const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');


/* const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const todoRoutes = require('./routes/todo');

const emailRoutes = require('./routes/email'); */
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log('DB Connected'));
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json(/* { type: 'application/*+json' } */));


app.use("/api",orderRoutes);
app.use("/api",productRoutes);
app.use("/api",categoryRoutes);
app.use("/api",userRoutes);
app.use("/api",adminRoutes);
/* app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", todoRoutes);
app.use("/api", emailRoutes);
app.use("/api", subtaskRoutes); */
/* app.use(express.static(path.join(__dirname, 'client/build'))); */
//app.use('/public', express.static('public'))
/* app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html')); // relative path
}); */

const PORT = process.env.PORT || 8000
app.listen(PORT, function () {
    console.log(`Server listening on port ${PORT}.`);
});