var ProjectOblioCrowdsale = artifacts.require("./ProjectOblioCrowdsale.sol");
var SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {

  deployer.deploy(SafeMath);
  deployer.link(SafeMath, ProjectOblioCrowdsale);
  deployer.deploy(ProjectOblioCrowdsale);
  
};