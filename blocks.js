/**
 * node blocks.js > blocks.csv
 */
const nem = require("nem2-sdk");
const op = require('rxjs/operators');

const endpoint = process.argv[2] || 'http://localhost:3000';
// const url = "http://api.beta.catapult.mijin.io:3000";
const limit = 100;

const BlockchainHttp = nem.BlockchainHttp;
const blockchainHttp = new BlockchainHttp(endpoint);

blockchainHttp.getBlockchainHeight().pipe(
  op.tap(v => console.error("currentHeight: %d", v.compact())),
  op.mergeMap(height => {
    const h = height.compact() - limit;
    return blockchainHttp.getBlocksByHeightWithLimit(h, limit).pipe(
      op.mergeMap(_ => _),
      op.map(data => {
        return {
          height: data.height.compact(),
          timestamp: ~~(data.timestamp.compact() / 1000), // to Seconds
          numTransactions: data.numTransactions,
          // datetime: (new Date(data.timestamp.compact() + 1459468800000)).toISOString()
        }
      }),
    )
  }),
  op.map(b => Object.keys(b).map(k => b[k]).join()),
  op.toArray(),
).subscribe(
  (blocks) => {
    console.log(["height,ts(sec),numTxes"].concat(blocks).join("\n"))
  }
)
