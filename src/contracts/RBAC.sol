pragma solidity ^0.5.0;


contract RBAC {

  event RoleCreated(uint256 role);
  event BearerAdded(address account, uint256 role);
  event BearerRemoved(address account, uint256 role);
  string constant NO_ROLE = '0x9D2AD0Ea4F0Cf2895E7669c79d5a928D0731d671';
  

  struct Role {
    string description;
    string account;
    mapping (address => bool) bearers;
  }
  

  Role[] public roles;
  constructor() public {
    addRootRole("0x9D2AD0Ea4F0Cf2895E7669c79d5a928D0731d671");
    addRole("RW", "0x9D2AD0Ea4F0Cf2895E7669c79d5a928D0731d671");
    addRole("RW", "0x7f6F61920b498D034810721EbfD9289d902473c6");
  }
  

  function addRootRole(string memory _account) public returns(uint256){
    uint256  role = roles.push(
      Role({
        description: "ADMIN",
        account: _account
      })
    ) - 1;
    return role;
  }


  function addRole(string memory _role, string memory _account) public returns(uint256) {
    uint256 role = 0;
    if(checkIfAdmin(_account)){
      role = roles.push(
        Role({
          description: _role,
          account: _account
        })
      ) - 1;
    }
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

}