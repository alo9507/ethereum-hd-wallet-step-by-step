const BIP39 = require("bip39");
const hdkey = require("ethereumjs-wallet/hdkey");
const Wallet = require('ethereumjs-wallet');
const keccak256 = require('js-sha3').keccak256;
const EthereumTx = require('ethereumjs-tx');

function generateMnemonic() {
    return BIP39.generateMnemonic();
}

function generateSeed(mnemonic) {
    return BIP39.mnemonicToSeed(mnemonic);
}

function generatePrivKey(mnemonic) {
    const seed = generateSeed(mnemonic);
    // Changing the derviation path here will give you a new priv key from the same seed phrase
    return hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/2'/0/0`).getWallet().getPrivateKey();
}

function derivePubKey(privKey) {
    const wallet = Wallet.fromPrivateKey(privKey);
    return wallet.getPublicKey();
}

function deriveEthAddress(pubKey) {
    const address = keccak256(pubKey);
    // Get the last 20 bytes of the public key
    return "0x" + address.substring(address.length - 40, address.length);
    return "0x" + address.substring(address.length - 40, address.length);
}

function signTx(privKey, txData) {
    const tx = new EthereumTx(txData);
    tx.sign(privKey);
    return tx;
}

function getSignerAddress(signedTx) {
    return "0x" + signedTx.getSenderAddress().toString('hex');
}

const mnemonic = "trend decade total media card machine luxury pottery huge ketchup miracle helmet";
console.log("MNEMONIC");
console.log(mnemonic);
console.log("\n");

const seed = generateSeed(mnemonic);
console.log("SEED");
console.log(Uint8Array.from(seed));
console.log("\n");

const privkey = generatePrivKey(mnemonic);
console.log("PRIVATE KEY");
console.log(Uint8Array.from(privkey));
console.log("\n");

const pubkey = derivePubKey(privkey);
console.log("PUBLIC KEY");
console.log(Uint8Array.from(pubkey));
console.log("\n");

const address = keccak256(pubkey);
console.log("ADDRESS");
console.log(address);
console.log("\n");

const ethaddress = "0x" + address.substring(address.length - 40, address.length);
console.log("ETHEREUM ADDRESS");
console.log(ethaddress);
console.log("\n");

const txnData = `{
    nonce: '0x00',
    gasPrice: '0x09184e72a000',
    gasLimit: '0x2710',
    to: '0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6',
    value: '0x10',
    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
    chainId: 3
}; `;

const signedTxn = signTx(privkey, txnData);
console.log("EXAMPLE SIGNED TRANSACTION");
console.log(signedTxn);
console.log("\n");

const senderAddress = getSignerAddress(signedTxn);
console.log("RECOVERED ADDRESS OF EOA THAT SIGNED TRANSACTION");
console.log(senderAddress);
console.log("\n");