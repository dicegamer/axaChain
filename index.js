// var openchain = require("openchain");
const Wallet = require("./Classes/Wallet");

var testWallet = new Wallet("0123456789abcdef0123456789abcdea");

//testWallet.createDebt(1000, function(result){console.log(result)});
//testWallet.getBalance(function(result){console.log(result);});


var http = require("http");
var url = require('url');

var srv = http.createServer(function(req,res){
    //0123456789abcdef0123456789abcdea
    var hostWallet;

    res.writeHead(200, {"Content-Type": "application/JSON"}); // Change le content-type
    if (url.parse(req.url, true).query['host'] !== undefined && url.parse(req.url, true).query['creation'] === "1") {
        hostWallet = new Wallet(url.parse(req.url, true).query['host']);
        hostWallet.createDebt(50, function(result){
            hostWallet.getBalance(function(balance){
                res.end(JSON.stringify(balance));
            });
        });
        
    }
    if (url.parse(req.url, true).query['host'] !== undefined && url.parse(req.url, true).query['traveller'] !== undefined && url.parse(req.url, true).query['engagement'] === "1") {
        hostWallet = new Wallet(url.parse(req.url, true).query['host']);
        travellerWallet = new Wallet(url.parse(req.url, true).query['traveller']);
        travellerWallet.createDebt(200, function(debtResult){
            hostWallet.createEarning(100, function(earnResult){
                hostWallet.getBalance(function(hostBalance){
                    travellerWallet.getBalance(function(travellerBalance){
                        //var i ={'host':hostBalance, 'traveller':travellerBalance}
                        res.end(JSON.stringify({'host':hostBalance, 'traveller':travellerBalance}));
                    });
                });
            });
        });
    }

    //var travWallet = new Wallet(url.parse(req.url, true).query['traveller']);

    
    // res.writeHead(200, {"Content-Type": "text/plain"}); // Change le content-type
    // hostWallet.getBalance(function(balance){
    //     //console.log(balance);
    //     res.end(JSON.stringify(balance));
    // })
    //travWallet.createDebt()

    //res.end("welsh"); // Balance l'output selon les parametres
});

srv.listen(9999);

// var mysql = require('mysql');
// var connection = mysql.createConnection({
//   host     : '51.75.121.28',
//   user     : 'axa_db',
//   password : 'axa_db',
//   database : 'axa'
// });
 
// connection.connect(function(err) {
//     if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//     }
   
//     //console.log('connected as id ' + connection.threadId);
//   });
 
// connection.query('SELECT id, Nom, Prenom from clients', function (error, results, fields) {
//   if (error) throw error;
//   results.forEach(element => console.log(element))
// });
 
// connection.end();