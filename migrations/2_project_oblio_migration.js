var ProjectOblio = artifacts.require("./ProjectOblio.sol");
var SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {

  deployer.deploy(SafeMath);
  deployer.link(SafeMath, ProjectOblio);
  deployer.deploy(ProjectOblio);
  
};