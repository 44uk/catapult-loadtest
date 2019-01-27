# Catapult LoadTest Scripts

## Usage

### Create `privateKeys.json` from `addresses.yaml`.

Collect privateKeys for creating signed transactions.

```
cp /path/to/build/generated-addresses/addresses.yaml .
cat addresses.yaml | yq '[.nemesis_addresses[0:20][].private]' > privateKeys.json
```

Using `yq` is pretty convenient.

* [kislyuk/yq: Command\-line YAML and XML processor \- jq wrapper for YAML/XML documents](https://github.com/kislyuk/yq)


### Generate Payloads

Pass number of payloads you want to create.

```
# go, very faster than nodejs. It is worth to setup go environment!
time go run payloadGenerator.go -f ./privateKeys.json -n 10000 > payloads.txt

# nodejs, 2nd argument means number of payload. Verrrry slow. Not recommended.
time node payloadGenerator.js ./privateKeys.json 10000 > payloads.txt
```


### Execute load test

```
node loadTest.js ./payload.txt http://localhost:3000
```


### Get block data

```
node blocks.js http://localhost:3000 > data.csv
```

You can get data like below.

```
832,89039100,11066
831,89039081,11351
830,89039062,7397
829,89039045,13664
828,89039022,10205
827,89039006,11509
826,89038988,2575
825,89038972,12177
824,89038956,2971
823,89038935,622
822,89038925,12863
821,89038904,1977
```

Aggregate them as you like.


## Thank you for supporting me

* [プライベートチェーンのカタパルトで秒間4000トランザクションを目指してみる \- Qiita](https://qiita.com/planethouki/items/9733aa83096a988ee57a)
* [カタパルトで秒間4000内部トランザクションを目指してみる \- Qiita](https://qiita.com/planethouki/items/eb19ed496aa8b6d5533a)
* [Myth or Fact? 4,000 transactions per second on the private Catapult blockchain \- NEM JAPAN](https://nemjapan.jp/4000-transactions-per-second-on-the-private-catapult-blockchain/)
* [planethouki/yonsen: A transaction making tool for NEM2 catapult to confirm 4,000 tx/s in private network\.](https://github.com/planethouki/yonsen)
* [catapult\-service\-bootstrap のノードを別々のサーバに立ち上げてネットワークを構築する \- Qiita](https://qiita.com/44uk_i3/items/56e2a5ba2a8796b2e7a3)
