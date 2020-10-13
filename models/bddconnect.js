var mongoose = require('mongoose')

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
}
let url = "mongodb+srv://hans:sibawaiyh@cluster0.tglh5.mongodb.net/ticketac?retryWrites=true&w=majority"

mongoose.connect(url,
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Ticketac connection : Success ***');
    }
   }
);

module.exports = mongoose


