# Crypto-Kickstarter
This is a smart contract system used to run a simple kickstarter campaign over a blockchain. The difference between a "crypto kickstarter" and an ICO is vast. The Crypto Kickstarter is used to primarily validate addresses so that a hardware product to said address, and an additional blockchain features received by the donator are considered not to be a part of the purchase. It represents a legal obligation for a hardware product to be delivered to the end user. 

It is possible to expand this repo to develop a more "proof-of-individual" kickstarter, limiting hardware deliveries based on a zip code, name, or particular address. This would ensure that a small number of investors do not receive an unfair amount of blockchain features, which would effectively corrupt a blockchain system that would otherwise have proof-of-individual potential.

The repo consists of two main elements: The smart contract, and the web page (an example one, anyway).
## Smart Contract
The smart contract collects ETH and distribute OBLs in increments of 0.1 ETH. This "increment" system allows us to produce a number of vybuds that is whole and not fractional, and deliver it to the user's given address. For example:
* 	A donation of 0.10 ETH returns 20 OBL and 1 Vybuds (1 Karma)
* 	A donation of 0.19 ETH returns 20 OBL and 1 Vybuds (1 Karma)
* 	A donation of 0.20 ETH returns 40 OBL and 2 Vybuds (2 Karma)

Some things to consider:
* Making donator's addresses public is useful if we want to prevent someone from hoarding a large number of vybuds, and using them to attack the network early on with fake data. The maximum number of vybuds that a single person can order in our kickstarter has not yet been determined.
* A donator who wanted to remain anonymous could donate ETH, provide a fake address, and receive only OBL. In this case, Vybuds would validate said address in a centralized way and choose not to deliver to it. 
* This is different from an ICO because a separate log is kept on a per-Vybuds basis. The number of vybuds can be limited, effectively preventing one person from hoarding too much of a particular kind of wealth ("Karma"; Vybuds hardware).
* Thus, there are really two tokens to consider here: Karma (more of a score than a token), and OBL.

## HTML page
A simple HTML page is included which validates address data and creates a JSON structure for input into a myetherwallet.com transaction as the "additional data" field. It ensures that the address data put into the form will be accepted by the smart contract. In this context, "address" is not an ethereum address, but a traditional real-world address (street name, city, zip code, etc).

## Proof-of-address ???
Yea... Nothing is ever 100% secure, but it would be really hard for someone to "fake-generate" multiple valid addresses and receive multiple vybuds packages there. Not all security can be as secure as encryption, this is meant to make things difficult AND public in the event someone does try to abuse the setup.
