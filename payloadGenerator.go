package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"github.com/proximax-storage/nem2-sdk-go/sdk"
	"io/ioutil"
	"math/rand"
	"os"
	"time"
)

func main() {
	var path = flag.String("f", "./privateKeys.json", "Collection of PrivateKeys")
	var num = flag.Int("n", 10, "number of transactions")
	var msg = flag.String("m", "", "message string")
	flag.Parse()
	bytes, err := ioutil.ReadFile(*path)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	var keys []string
	json.Unmarshal(bytes, &keys)

	networkType := sdk.MijinTest
	accounts := make([]sdk.Account, len(keys), len(keys))
	for idx, key := range keys {
		acc, err := sdk.NewAccountFromPrivateKey(key, networkType)
		if err != nil {
			panic(err)
		}
		accounts[idx] = *acc
	}

	//sender := accounts[rand.Intn(len(accounts))]
	sender := accounts[1]
	fmt.Fprint(os.Stderr, sender.Address.Pretty())
	//fmt.Println(sender.Address.Pretty())
	for i := 0; i < *num; i++ {
		// sender := accounts[rand.Intn(len(accounts))]
		recipient := accounts[rand.Intn(len(accounts))]
		ttx, err := sdk.NewTransferTransaction(
			sdk.NewDeadline(time.Hour*23+time.Minute*59),
			sdk.NewAddress(recipient.Address.Pretty(), networkType),
			[]*sdk.Mosaic{sdk.Xem(0)},
			sdk.NewPlainMessage(*msg),
			networkType,
		)
		stx, err := sender.Sign(ttx)
		if err != nil {
			panic(fmt.Errorf("TransaferTransaction signing returned error: %s", err))
		}
		fmt.Println(stx.Payload)
	}
}
