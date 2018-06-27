//import jquery and bootstrap
import 'jquery';
import 'bootstrap-loader';
// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import crowdsale_artifacts from '../../build/contracts/ProjectOblioCrowdsale.json'
import token_artifacts from '../../build/contracts/ProjectOblio.json'

var ProjectOblioCrowdsale = contract(crowdsale_artifacts);
var TokenContract = contract(token_artifacts);

var accounts;
var account;
var balance;
let contract_address;

window.App = {
    
    start: function(){
        var self = this;

        // Bootstrap the abstraction for Use.
        ProjectOblioCrowdsale.setProvider(web3.currentProvider);
        TokenContract.setProvider(web3.currentProvider);

        web3.eth.getAccounts(function(err, acs){
            if(err){
                alert("There's error fetching your accounts");
                return;
            }
            
            if(acs.length == 0){
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            accounts = acs;
            account = accounts[0];//get the first account;
        });
    },

    setStatus: function(message) {
        var status = document.getElementById("status");
        status.innerHTML = message;
    },    

    enroll: function(){
        
        var name = document.getElementById("inputName").value,
            str_address = document.getElementById("inputStrNumber").value,
            str_address = document.getElementById("inputStrAddress").value,
            zipcode = document.getElementById("inputZipCode").value,
            terms = document.getElementById("inputTerm").value,
            email = document.getElementById("inputEmail").value,
            amount = document.getElementById("inputAmount").value;

        var transactionObject = {};

        // Minimum Donation: 0.1 ETH, 0.1ETH => 100000000000000000        
        var depositInWei = web3.utils.toWei(amount, "ether");
        if(depositInWei < 100000000000000000){
            App.setStatus("Minimum Donation is 0.1 ETH");
            return;
        }
        transactionObject.from = account;
        transactionObject.to = contract_address;//"0x2e335f247e91caa168c64b63104c4475b2af3942";
        // Added as a special "additional data" field in myetherwallet's send a transaction
        transactionObject.data = web3.utils.toHex('234');
        transactionObject.value = depositInWei;

        web3.eth.sendTransaction(transactionObject, {from: account})
                .on('transactionHash', function(hash){
                    console.log(hash);
                })
                .on('confirmation', function(confirmationNumber, receipt){
                    if(confirmationNumber == 15){
                        App.refreshBalance();
                    }
                    // console.log(confirmationNumber, receipt);
                })
                .on('receipt', function(receipt){
                    console.log(receipt);
                })
                .on('error', console.error);

        //web3.utils.toHex('234');
        // Start Date: November 5th, 2018 at 12:00 UTC
        // End Date: 12:00 UTC on March 21st, 2019
        // karma: 0.1 ETH => 1 Karma        
        
    },

    init: function(){
        App.refreshBalance();
        App.printImportantInfo();
        App.watchEvents();        
    },

    refreshBalance: function(){
        let tokenInstance;
        ProjectOblioCrowdsale.deployed().then(function(instance){
            tokenInstance = instance;
            contract_address = instance.address;
            return tokenInstance.GetAccountCount.call();
        }).then(function(value){
            
            var balance_element = document.getElementById("accountCount");
            var wallet_address = document.getElementById("current_wallet");
            var cca = document.getElementById("crowdsale_contract_address");

            balance_element.innerHTML = value.valueOf()+" Members";
            wallet_address.innerHTML = account;
            cca.innerHTML = tokenInstance.address;

        }).catch(function(e) {
            console.log(e);
            App.setStatus("Error getting Get Account Count; see log.");
        });

        let obl_token_instance;
        TokenContract.deployed().then(function(instance){
            obl_token_instance = instance;
            return obl_token_instance.balanceOf.call(account);
        }).then(function(balance){
            var obl_token = document.getElementById("obl_token");
            obl_token.innerHTML = balance.toFixed(2);
        }).catch(function(e){
            console.log(e);
            App.setStatus("Error getting Get Account Count; see log.");
        });
    },

    printImportantInfo: function(){
        let tokenInstance;
        ProjectOblioCrowdsale.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.GetAccountCount.call();
        }).then(function(value){
            
            var balance_element = document.getElementById("accountCount");
            var wallet_address = document.getElementById("current_wallet");

            balance_element.innerHTML = value.valueOf()+" Members";
            wallet_address.innerHTML = account;

        }).catch(function(e) {
            console.log(e);
            App.setStatus("Error getting Get Account Count; see log.");
        });
    },

    watchEvents: function(){
        var tokenInstance;
        ProjectOblioCrowdsale.deployed().then(function(instance){
            tokenInstance = instance;
            tokenInstance.allEvents({}, {fromBlock:0, toBlock:'latest'}).watch(function(error, result){
                var alertbox = document.createElement("div");
                alertbox.setAttribute("class", "alert alert-info  alert-dismissible");
                var closeBtn = document.createElement("button");
                closeBtn.setAttribute("type", "button");
                closeBtn.setAttribute("class", "close");
                closeBtn.setAttribute("data-dismiss", "alert");
                closeBtn.innerHTML = "<span>&times;</span>";
                alertbox.appendChild(closeBtn);

                var eventTitle = document.createElement("div");
                eventTitle.innerHTML = '<strong>New Event: '+result.event+'</strong>';
                alertbox.appendChild(eventTitle);

                var argsBox = document.createElement("textarea");
                argsBox.setAttribute("class", "form-control");
                argsBox.innerText= JSON.stringify(result.args);
                alertbox.appendChild(argsBox);
                document.getElementById("tokenEvents").appendChild(alertbox);

            });
        }).catch(function(e) {
            console.log(e);
            App.setStatus("Error getting balance; see log.");
          });
    }
}

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    App.start();
  });