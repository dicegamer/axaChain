const openchain = require("openchain");
const bitcore = require("bitcore-lib");
const Config = require("../config.json");
var masterWallet = new Wallet(Config.masterWalletSeed);
var client = new openchain.ApiClient(Config.serverURL);

var makeTransaction = function (senderWallet, receiverWallet, assetPath, price, typeMsg, callback){
    client.initialize()
    .then(function () {
        return new openchain.TransactionBuilder(client)
            .addSigningKey(senderWallet.signer)
            .setMetadata({ "memo": ""+typeMsg+" : Issued through NodeJS" })
            // Take 100 units of the asset from the issuance path
            .updateAccountRecord(senderWallet.getPath(), assetPath, -price);
    })
    .then(function (transactionBuilder) {
        // Add 100 units of the asset to the target wallet path
        return transactionBuilder.updateAccountRecord(receiverWallet.getPath(), assetPath, price);
    })
    .then(function (transactionBuilder) {
        return transactionBuilder.submit();
    })
    .then(function (result){
        callback(result);
    });
}

function Wallet(seedPhrase) {
    this.pk = bitcore.HDPrivateKey.fromSeed(seedPhrase, "openchain");
    this.address = this.pk.publicKey.toAddress();
    this.signer = new openchain.MutationSigner(this.pk);
}

Wallet.prototype.getPath = function () {
    return "/p2pkh/"+this.address+"/";
}

Wallet.prototype.getBalance = function (callback) {
    var tmp = this.getPath();
    client.getAccountRecord(tmp,Config.debtAsset).then(function(result){
        client.getAccountRecord(tmp,Config.earningAsset).then(function(result2){
            callback({'debt':result.balance.toString(),'earning':result2.balance.toString()});
        });
    });
}

Wallet.prototype.makePayment = function (price, callback) {
    makeTransaction(this, masterWallet, Config.debtAsset, price, "Debt payment", callback);
}

Wallet.prototype.createDebt = function (price, callback) {
    makeTransaction(masterWallet, this, Config.debtAsset, price, "Debt creation", callback);
}


Wallet.prototype.consumeEarning = function (price, callback) {
    makeTransaction(this, masterWallet, Config.earningAsset, price, "Earning consumption", callback);
}

Wallet.prototype.createEarning = function (price, callback) {
    makeTransaction(masterWallet, this, Config.earningAsset, price, "Earning creation", callback);
}



// export the class
module.exports = Wallet;