// var openchain = require("openchain");
const Wallet = require("./Classes/Wallet");

var testWallet = new Wallet("0123456789abcdef0123456789abcdea");
var balance = {'debt':undefined,'earning':undefined};

testWallet.getDebt().then(result => (balance.debt = result.balance.toString()));
testWallet.getEarning().then(result => (balance.earning = result.balance.toString()));
setTimeout(function(){
    console.log(balance);
    testWallet.createDebt(10000).then(result => {
        console.log(result);
        
    });
}, 500);



// var signer = new openchain.MutationSigner(testWallet.pk);
// client.initialize()
// .then(function () {
//     // Create a new transaction builder
//     return new openchain.TransactionBuilder(client)
//         .addSigningKey(signer)
//         .setMetadata({ "memo": "Issued through NodeJS" })
//         // Take 100 units of the asset from the issuance path
//         .updateAccountRecord(testWallet.getPath(), asset, -100);
// })
// .then(function (transactionBuilder) {
//     // Add 100 units of the asset to the target wallet path
//     return transactionBuilder.updateAccountRecord(testWallet2.getPath(), asset, 100);
// })
// .then(function (transactionBuilder) {
//     // Submit the transaction
//     return transactionBuilder.submit();
// })
// .then(function (result) { console.log(result); });