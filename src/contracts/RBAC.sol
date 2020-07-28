pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract RBAC {

  struct Role {
    string description;
    string account;
    string assigningAccount;
    uint256 timestamp;
    string policeStationId;
  }
  

  Role[] public roles;
  constructor() public {
    addRole("ADMIN", "0x9D2AD0Ea4F0Cf2895E7669c79d5a928D0731d671", "System", now, '1234');
    addRole("RW", "0x9D2AD0Ea4F0Cf2895E7669c79d5a928D0731d671", "System", now, '1234');
  }


  function addRole(string memory _role, string memory _account, string memory _assigningAccount, uint256 _timestamp, string memory _policeStationId) public returns(uint256) {
    uint256 role = 0;
      role = roles.push(
        Role({
          description: _role,
          account: _account,
          assigningAccount: _assigningAccount,
          timestamp: _timestamp,
          policeStationId : _policeStationId
        })
      ) - 1;
    return role;
  }
  

  function totalRoles() public view returns(uint256) {
    return roles.length - 1;
  }

  
  function hasRole(string memory _account, string memory _role) public view returns(bool) {
    bool hasParticularRole = false;
    for(uint256 i=0; i<roles.length; i++){
      if (keccak256(bytes(roles[i].description)) == keccak256(bytes(_role)) && keccak256(bytes(roles[i].account)) == keccak256(bytes(_account))){
        hasParticularRole = true;
        break;
      }
    }
    return hasParticularRole;
  }


  function checkIfAdmin(string memory _account) public view returns (bool) {
    bool isAdmin = false;
    for(uint256 i=0; i<roles.length; i++){
      if (keccak256(bytes(roles[i].description)) == keccak256(bytes("ADMIN")) && keccak256(bytes(roles[i].account)) == keccak256(bytes(_account))){
        isAdmin = true;
        break;
      }
    }
    return isAdmin;
  }


  function getAllRoles() public view returns (string[] memory, string[] memory, string[] memory, uint256[] memory, string[] memory){
    string[] memory accounts = new string[](roles.length);
    string[] memory accountRoles = new string[](roles.length);
    string[] memory assigningAccounts = new string[](roles.length);
    uint256[] memory timestamps = new uint256[](roles.length);
    string[] memory policeStationIds = new string[](roles.length);
    for (uint256 i = 0; i < roles.length; i++) {
        accounts[i] = roles[i].account;
        accountRoles[i] = roles[i].description;
        assigningAccounts[i] = roles[i].assigningAccount;
        timestamps[i] = roles[i].timestamp;
        policeStationIds[i] = roles[i].policeStationId;
    }
    return (accounts, accountRoles, assigningAccounts, timestamps, policeStationIds);
  }  


  function getRoleDetails(string memory _account, string memory _role) public view returns (string memory, string memory) {
    string memory assigningAccount = '';
    string memory policeStationId = '';
    for(uint256 i=0; i<roles.length; i++){
      if (keccak256(bytes(roles[i].description)) == keccak256(bytes(_role)) && keccak256(bytes(roles[i].account)) == keccak256(bytes(_account))){
        assigningAccount = roles[i].assigningAccount;
        policeStationId = roles[i].policeStationId;
        break;
      }
    }
    return (assigningAccount, policeStationId);
  }
  

  function removeRole(uint index) public returns(bool) {
    bool roleRemoved = false;
    for (uint i = index; i<roles.length-1; i++){
        roles[i] = roles[i+1];
    }
    delete roles[roles.length-1];
    roles.length--;
    roleRemoved = true;
    return roleRemoved;
  }

}