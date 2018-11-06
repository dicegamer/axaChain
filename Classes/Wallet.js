const openchain = require("openchain");
const bitcore = require("bitcore-lib");
const Config = require("../config.json");
var masterWallet = new Wallet(Config.masterWalletSeed);
var client = new openchain.ApiClient(Config.serverURL);



function Wallet(seedPhrase) {
    this.pk = bitcore.HDPrivateKey.fromSeed(seedPhrase, "openchain");
    this.address = this.pk.publicKey.toAddress();

    var signer = new openchain.MutationSigner(this.pk);

    function makeTransaction (senderWallet, receiverWallet, assetPath, price){
        client.initialize().then(function () {
            return new openchain.TransactionBuilder(client)
                .addSigningKey(signer)
                .setMetadata({ "memo": "Issued through NodeJS" })
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
        .then(function (result) { console.log(result); });
    }


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






Wallet.prototype.receiveDebt = function () {
    
}

Wallet.prototype.receiveEarning = function () {

}



// export the class
module.exports = Wallet;