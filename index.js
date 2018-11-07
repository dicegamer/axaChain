// var openchain = require("openchain");
const Wallet = require("./Classes/Wallet");

var testWallet = new Wallet("0123456789abcdef0123456789abcdea");

//testWallet.createDebt(1000, function(result){console.log(result)});
//testWallet.getBalance(function(result){console.log(result);});



var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '51.75.121.28',
  user     : 'axa_db',
  password : 'axa_db',
  database : 'axa'
});
 
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    //console.log('connected as id ' + connection.threadId);
  });
 
connection.query('SELECT id, Nom, Prenom from clients', function (error, results, fields) {
  if (error) throw error;
  results.forEach(element => console.log(element))
});
 
connection.end();