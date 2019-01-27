/**
 * node payloadGenerator.js path/to/privateKeys.json numberOfTransactions MessageWordCount
 */
console.time();
const nem = require("nem2-sdk");
const jsJoda = require("js-joda");
const Account = nem.Account,
  Deadline = nem.Deadline,
  NetworkType = nem.NetworkType,
  PlainMessage = nem.PlainMessage,
  TransferTransaction = nem.TransferTransaction,
  XEM = nem.XEM
;

const randInt = (max) => Math.floor(Math.random() * Math.floor(max));
const createString = (len) => "A".repeat(len);
const payloadCreater = () => {
  const deadline = Deadline.create(1439, jsJoda.ChronoUnit.MINUTES);
  return (account, recipient, amount, message) => {
    const xem = [XEM.createRelative(amount)];
    const msg = PlainMessage.create(message);
    const transferTransaction = TransferTransaction.create(
      deadline,
      recipient,
      xem,
      msg,
      NetworkType.MIJIN_TEST,
    );
    const signedTransaction = account.sign(transferTransaction);
    return signedTransaction.payload;
  }
}
const payloadCreaterWithFixed = (amount, message) => {
  const deadline = Deadline.create(1439, jsJoda.ChronoUnit.MINUTES);
  const xem = [XEM.createRelative(amount)];
  const msg = PlainMessage.create(message);
  return (account, recipient) => {
    const transferTransaction = TransferTransaction.create(
      deadline,
      recipient,
      xem,
      msg,
      NetworkType.MIJIN_TEST,
    );
    const signedTransaction = account.sign(transferTransaction);
    return signedTransaction.payload;
  }
}
const accountsPicker = (keys) => {
  const accounts = keys.map(k => Account.createFromPrivateKey(k, NetworkType.MIJIN_TEST));
  return (num) => [accounts[randInt(keys.length)], accounts[randInt(keys.length)]]
};

const privateKeys = require(process.argv[2] || "./privateKeys.json");
const num = process.argv[3] || 10;
const len = process.argv[4] || 0; // 1023;
const createPayload = payloadCreater();
const createPayloadWithFixed = payloadCreaterWithFixed(
  randInt(1),
  createString(randInt(len))
);
const pick2Accounts = accountsPicker(privateKeys);

const [sender, _] = pick2Accounts();
console.error(sender.address.plain())
for (let i = 0; i < num; i++) {
  const [_, recipient] = pick2Accounts();
  // const payload = createPayload(sender, recipient.address, randInt(5), createString(len));
  const payload = createPayloadWithFixed(sender, recipient.address);
  console.log(payload);
}
