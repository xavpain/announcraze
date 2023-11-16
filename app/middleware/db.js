const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to DB'))
  .catch(err => console.log(err));

module.exports = mongoose.connection;
  