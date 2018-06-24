# Crypto-Kickstarter
This is a smart contract used to run a simple kickstarter campaign over a blockchain. The difference between a "crypto kickstarter" and and ICO is vast -- our Crypto Kickstarter is used to primarily validate addresses so that we can send a hardware product to said address. 

It is possible to expand this repo to develop a more "proof-of-individual" kickstarter, limiting hardware deliveries based on a zip code, name, or particular address. This would ensure that a small number of investors do not receive an unfair amount of currency, which is effectively a poison for practically every other cryptocurrency to date.

## Smart Contracts
The smart contracts collect ETH and distribute OBLS in increments of 0.1 ETH. This "increment" system allows us to produce a number of Vybuds that is whole and not fractional, and deliver it to the user's given address. For example:
* 	A donation of 0.10 ETH returns 20 OBL and 1 Vybuds (1 Karma)
* 	A donation of 0.19 ETH returns 20 OBL and 1 Vybuds (1 Karma)
* 	A donatin of 0.20 ETH

Some things to consider:
* Making donator's addresses public is useful if we want to prevent someone from hoarding a large number of vybuds, and using them to attack the network early on with fake data.
* A donator who wants to remain anonymous could donate ETH, provide a fake address, and receive only OBL. In this case, Vybuds would validate said address in a centralized way and choose not to deliver to them.
* This is different from an ICO because a separate log is kept on a per-Vybuds basis. The number of Vybuds can be limited, effectively preventing one person from hoarding too much of a particular kind of wealth ("Karma".
* Thus, there are really two tokens to consider here: Karma (more of a score than a token), and OBL.

## HTML page
A simple HTML page is included which validates address data and creates a JSON structure for input into a myetherwallet.com transaction as the "additional data" field. It ensures that the data put into the form will be accepted by the smart contract. 
