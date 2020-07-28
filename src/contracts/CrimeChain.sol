pragma solidity ^0.5.0;

contract CrimeChain {
  
    struct Case {
        string fileHash;
        string name;
        string caseAddress;
        string caseType;
        string caseStatus;
        string connectionType;
        string date;
    }

    Case newCase;

    function setCase(string memory _fileHash, string memory _name, string memory _caseAddress, string memory _caseType, string memory _caseStatus,
        string memory _connectionType, string memory _date) public{
        newCase = Case(_fileHash, _name, _caseAddress, _caseType, _caseStatus, _connectionType, _date);
    }

    function getCaseHash() public view returns (string memory) {
        return newCase.fileHash;
    }

    function getName() public view returns (string memory) {
        return newCase.name;
    }

    function getCaseType() public view returns (string memory) {
        return newCase.caseType;
    }

    function getCaseStatus() public view returns (string memory) {
        return newCase.caseStatus;
    }

    function getCaseConnectionType() public view returns (string memory) {
        return newCase.connectionType;
    }

    function getAddress() public view returns (string memory) {
        return newCase.caseAddress;
    }

}