var openchain = require("openchain");

var client = new openchain.ApiClient("http://localhost:8080/");

client.getAccountRecord(
    // Account path
    "/p2pkh/Xat6UaXpQE9Dxv6rLtxY1peBkzC1SQDiEX/",
    // Asset path
    "/asset/p2pkh/XcDCGPMtdrKxodQ4soFyYfDmr78gTvJ9jN/")
    .then(function (result) {
        console.log("Balance: " + result.balance.toString());
    }
);