const CrimeChain = artifacts.require("Crimechain");

module.exports = function(deployer) {
  deployer.deploy(CrimeChain);
};
