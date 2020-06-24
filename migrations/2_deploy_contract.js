const CrimeChain = artifacts.require("Crimechain");
const RBAC = artifacts.require("RBAC");

module.exports = function(deployer) {
  deployer.deploy(CrimeChain);
};

module.exports = function(deployer) {
  deployer.deploy(RBAC);
};
