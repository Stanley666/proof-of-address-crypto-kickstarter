var ProjectOblioCrowdsale = artifacts.require("./ProjectOblioCrowdsale.sol");
var ProjectOblio          = artifacts.require("./ProjectOblio.sol");
var SafeERC20             = artifacts.require("./SafeERC20.sol");
var SafeMath              = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {
  //uint256 _rate, address _wallet, ERC20 _token, uint256 _openingTime, uint256 _closingTime
  const openingTime = web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
  const closingTime = openingTime + 1532718506;


  deployer.deploy(SafeMath);
  deployer.deploy(SafeERC20);

  deployer.link(SafeMath, ProjectOblio);
  deployer.link(SafeMath, ProjectOblioCrowdsale);
  deployer.link(SafeERC20, ProjectOblioCrowdsale);

  // deployer.deploy(ProjectOblioCrowdsale);
  deployer.then(() => {
    return deployer.deploy(ProjectOblio);
  }).then(() => {
    return deployer.deploy(
      ProjectOblioCrowdsale,
      400,
      "0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e",
      ProjectOblio.address,
      openingTime,
      closingTime
    );
  })
  
};