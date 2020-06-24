pragma solidity ^0.5.0;


contract RBAC {
  event RoleCreated(uint256 role);
  event BearerAdded(address account, uint256 role);
  event BearerRemoved(address account, uint256 role);
  uint256 constant NO_ROLE = 0;
  
  struct Role {
    string description;
    uint256 admin;
    mapping (address => bool) bearers;
  }
  

  Role[] public roles;
  constructor() public {
    addRootRole("NO_ROLE");
  }
  
  function addRootRole(string memory _roleDescription) public returns(uint256)
  {
    uint256 role = addRole(_roleDescription, roles.length);
    roles[role].bearers[msg.sender] = true;
    emit BearerAdded(msg.sender, role);
  }
  
  function addRole(string memory _roleDescription, uint256 _admin) public returns(uint256) {
    require(_admin <= roles.length, "Admin role doesn't exist.");
    uint256 role = roles.push(
      Role({
        description: _roleDescription,
        admin: _admin
      })
    ) - 1;
    emit RoleCreated(role);
    return role;
  }
  
  function totalRoles() public view returns(uint256) {
    return roles.length - 1;
  }
  
  function hasRole(address _account, uint256 _role) public view returns(bool) {
    return _role < roles.length && roles[_role].bearers[_account];
  }
  
  function addBearer(address _account, uint256 _role) public {
    require(
      _role < roles.length,
      "Role doesn't exist."
    );
    require(
      hasRole(msg.sender, roles[_role].admin),
      "User can't add bearers."
    );
    require(
      !hasRole(_account, _role),
      "Account is bearer of role."
    );
    roles[_role].bearers[_account] = true;
    emit BearerAdded(_account, _role);
  }
  
  function removeBearer(address _account, uint256 _role) public {
    require(
      _role < roles.length,
      "Role doesn't exist."
    );
    require(
      hasRole(msg.sender, roles[_role].admin),
      "User can't remove bearers."
    );
    require(
      hasRole(_account, _role),
      "Account is not bearer of role."
    );
    delete roles[_role].bearers[_account];
    emit BearerRemoved(_account, _role);
  }
}