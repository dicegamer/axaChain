// var openchain = require("openchain");
const Wallet = require("./Classes/Wallet");

// var http = require("http");
// var url = require('url');

// var srv = http.createServer(function(req,res){
//     var hostWallet;

//     res.writeHead(200, {"Content-Type": "application/JSON"}); // Change le content-type
//     if (url.parse(req.url, true).query['host'] !== undefined && url.parse(req.url, true).query['creation'] === "1") {
//         console.log("creation");
//         hostWallet = new Wallet(url.parse(req.url, true).query['host']);
//         hostWallet.createDebt(50, function(result){
//             hostWallet.getBalance(function(balance){
//                 console.log(balance);
//                 res.end(JSON.stringify(balance));
//             });
//         });

//     }
//     if (url.parse(req.url, true).query['host'] !== undefined && url.parse(req.url, true).query['traveller'] !== undefined && url.parse(req.url, true).query['engagement'] === "1") {
//         console.log("engagement");
//         hostWallet = new Wallet(url.parse(req.url, true).query['host']);
//         travellerWallet = new Wallet(url.parse(req.url, true).query['traveller']);
//         travellerWallet.createDebt(200, function(debtResult){
//             hostWallet.createEarning(100, function(earnResult){
//                 hostWallet.getBalance(function(hostBalance){
//                     travellerWallet.getBalance(function(travellerBalance){
//                         console.log({'host':hostBalance, 'traveller':travellerBalance});
//                         res.end(JSON.stringify({'host':hostBalance, 'traveller':travellerBalance}));
//                     });
//                 });
//             });
//         });
//     }
//     if (url.parse(req.url, true).query['user'] !== undefined){
//         var userSeed = url.parse(req.url, true).query['user'];
//         console.log(userSeed + " : asking for balance");
//         userWallet = new Wallet(userSeed);
//         userWallet.getBalance(function(balance){
//             console.log(balance);
//             res.end(JSON.stringify(balance));
//         });
//     }
// });
// srv.listen(9999);


/////////////////////////////////////////////////////////////


// function twoDigits(d) {
//     if(0 <= d && d < 10) return "0" + d.toString();
//     if(-10 < d && d < 0) return "-0" + (-1*d).toString();
//     return d.toString();
// }

// Date.prototype.toMysqlFormat = function() {
//     return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
// };

// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: '51.75.121.28',
//     user: 'axa_db',
//     password: 'axa_db',
//     database: 'axa'
// });

// var connection2 = mysql.createConnection({
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

// connection2.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
// });

// connection.query('SELECT id, Wallet_Credit from clients', function (error, results, fields) {
//     if (error) throw error;
//     results.forEach(element => {
//         currentWallet = new Wallet(element['Wallet_Credit']);
//         currentWallet.getBalance(function (balance) {
//             connection2.query("INSERT into facture(wallet, dateEmission, avoir, dette, idBonhomme) values('"+element['Wallet_Credit']+"', '"+new Date().toMysqlFormat() +"', '"+balance.earning+"', '"+balance.debt+"','"+element['id']+"')",function (error, results2, fields) {
//                 if (error) throw error;
//                 if(element === results[results.length -1])connection2.end();
                
//             })
//             if (balance.debt <= balance.earning) {
                
//             }
//             console.log(balance.debt);
//             console.log(new Date().getTime());
//         });
//     });
// });

// connection.end();



////////////////////////////////////////////////




var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '51.75.121.28',
    user: 'axa_db',
    password: 'axa_db',
    database: 'axa'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

connection.query('SELECT id, Wallet_Credit from clients', function (error, results, fields) {
    if (error) throw error;
    results.forEach(element => {
        currentWallet = new Wallet(element['Wallet_Credit']);
        currentWallet.getBalance(function (balance) {
            console.log(balance);
            console.log(""+balance.debt +" "+ balance.earning );
            console.log(balance.debt <= balance.earning);
            if (balance.debt <= balance.earning && balance.earning >0 ) {
                console.log(balance.debt <= balance.earning);
                
                currentWallet.consumeEarning(balance.earning-balance.debt, function(params) {
                    console.log(params);
                })
            }
            else if(balance.earning >0){
                currentWallet.consumeEarning(balance.earning, function(params) {
                    console.log(params);
                })
            }
            if(balance.debt >0 ) {
                currentWallet.makePayment(balance.debt, function(params) {
                    console.log(params);
                });
            }
        });
    });
});

connection.end();
