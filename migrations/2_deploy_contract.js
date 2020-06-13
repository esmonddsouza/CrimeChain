const Meme = artifacts.require("Meme");
const CrimeChain = artifacts.require("Crimechain");

module.exports = function(deployer) {
  deployer.deploy(Meme);
};

module.exports = function(deployer) {
  deployer.deploy(CrimeChain);
};
