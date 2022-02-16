
import mysql  from 'mysql';

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: "password",
    database: "nodeDBTry",
    multipleStatements: true,
})

mysqlConnection.connect((err)=>{
    if(err){
        console.log('Not conneced!',err);
    }else{
        console.log('Conneced!');
    }
})

export default mysqlConnection;