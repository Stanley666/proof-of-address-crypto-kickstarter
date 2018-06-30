var ProjectOblioCrowdsale = artifacts.require("./ProjectOblioCrowdsale.sol");
var ProjectOblio          = artifacts.require("./ProjectOblio.sol");
var SafeMath              = artifacts.require("./SafeMath.sol");

module.exports = function(deployer, network, accounts) {
  //uint256 _rate, address _wallet, ERC20 _token, uint256 _openingTime, uint256 _closingTime
  const openingTime = web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
  const closingTime = openingTime + 1532718506;
  const tokensInDecimal = 700*1000000000000000000;

  var crowdsaleInstance;
  var tokenInstance;

  deployer.deploy(SafeMath);

  deployer.link(SafeMath, ProjectOblio);
  deployer.link(SafeMath, ProjectOblioCrowdsale);

  // deployer.deploy(ProjectOblioCrowdsale);
  deployer.then(() => {
    return deployer.deploy(ProjectOblio);
  }).then((instance) => {
    tokenInstance = instance;

    return deployer.deploy(
      ProjectOblioCrowdsale,
      "400",
      "0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e",
      ProjectOblio.address,
      openingTime,
      closingTime
    );

  }).then((crowdsaleInstance) => {
    return tokenInstance.transfer(crowdsaleInstance.address, tokensInDecimal, {from: accounts[0]});
  }).then((err, result) => {
    if(err){
      console.log("Error occur, please check log", err);
    }else{
      console.log(tokensInDecimal +" has been transfer to Project Oblio Crowdsales contract");
    }   
  });

  //LOG FOR CHECK 
  //console.log(openingTime, closingTime, tokenInstance.address, crowdsaleInstance.address);
  
};