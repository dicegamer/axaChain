// var openchain = require("openchain");
const Wallet = require("./Classes/Wallet");

var http = require("http");
var url = require('url');

var srv = http.createServer(function(req,res){
    var hostWallet;

    res.writeHead(200, {"Content-Type": "application/JSON"}); // Change le content-type
    if (url.parse(req.url, true).query['host'] !== undefined && url.parse(req.url, true).query['creation'] === "1") {
        console.log("creation");
        hostWallet = new Wallet(url.parse(req.url, true).query['host']);
        hostWallet.createDebt(50, function(result){
            hostWallet.getBalance(function(balance){
                res.end(JSON.stringify(balance));
            });
        });

    }
    if (url.parse(req.url, true).query['host'] !== undefined && url.parse(req.url, true).query['traveller'] !== undefined && url.parse(req.url, true).query['engagement'] === "1") {
        console.log("engagement");
        hostWallet = new Wallet(url.parse(req.url, true).query['host']);
        travellerWallet = new Wallet(url.parse(req.url, true).query['traveller']);
        travellerWallet.createDebt(200, function(debtResult){
            hostWallet.createEarning(100, function(earnResult){
                hostWallet.getBalance(function(hostBalance){
                    travellerWallet.getBalance(function(travellerBalance){
                        console.log({'host':hostBalance, 'traveller':travellerBalance});
                        res.end(JSON.stringify({'host':hostBalance, 'traveller':travellerBalance}));
                    });
                });
            });
        });
    }
});
srv.listen(9999);

// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: '51.75.121.28',
//     user: 'axa_db',
//     password: 'axa_db',
//     database: 'axa'
// });

// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
// });

// connection.query('SELECT nom, Wallet_Credit from clients', function (error, results, fields) {
//     if (error) throw error;
//     results.forEach(element => {
        
//         currentWallet = new Wallet(element['Wallet_Credit']);
        
//         //console.log(currentWallet);
//         currentWallet.getBalance(function (balance) {
//             //var i ={'host':hostBalance, 'traveller':travellerBalance}
//             console.log("coucou");
//             console.log(balance);
//         });
//     })
// });

// connection.end();