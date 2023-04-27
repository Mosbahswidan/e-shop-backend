const mongoose = require('mongoose');

const dataBaseConnection = ()=> {
    mongoose.connect(process.env.DB_URL,{
      autoIndex: true,
      useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then((con)=>{
        console.log(`Connected database ${con.connection.host}`);
       });
      
}

module.exports=dataBaseConnection;