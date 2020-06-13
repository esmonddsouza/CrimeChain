pragma solidity ^0.5.0;

contract CrimeChain {
  
    struct Case {
        string fileHash;
        string name;
        string caseType;
        string caseStatus;
        string connectionType;
        string date;
    }

    Case newCase;

    function setCase(string memory _fileHash, string memory _name,  string memory _caseType,  string memory _caseStatus,
                string memory _connectionType, string memory _date) public {
        newCase = Case(_fileHash, _name, _caseType, _caseStatus, _connectionType, _date);
    }

    function getCaseHash() public view returns (string memory) {
        return newCase.fileHash;
    }
}
