const openchain = require("openchain");
const bitcore = require("bitcore-lib");
const Config = require("../config.json");
var masterWallet = new Wallet(Config.masterWalletSeed);
var client = new openchain.ApiClient(Config.serverURL);

var makeTransaction = function (senderWallet, receiverWallet, assetPath, price, typeMsg){
    return client.initialize().then(function () {
        return new openchain.TransactionBuilder(client)
            .addSigningKey(signer)
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
    .then(function (result) { return result });
}


function Wallet(seedPhrase) {
    this.pk = bitcore.HDPrivateKey.fromSeed(seedPhrase, "openchain");
    this.address = this.pk.publicKey.toAddress();

    var signer = new openchain.MutationSigner(this.pk);
}

Wallet.prototype.getPath = function () {
    return "/p2pkh/"+this.address+"/";
}

Wallet.prototype.getDebt = function () {
    return client.getAccountRecord(this.getPath(),Config.debtAsset);
}

Wallet.prototype.getEarning = function () {
    return client.getAccountRecord(this.getPath(),Config.earningAsset);
}



Wallet.prototype.makePayment = function (price) {
    return makeTransaction(this, masterWallet, Config.debtAsset, price)
}

Wallet.prototype.createDebt = function (price) {
    return makeTransaction(masterWallet, this, Config.debtAsset, price, "Debt creation")
}



// export the class
module.exports = Wallet;