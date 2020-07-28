import React, { Component } from 'react';
import Web3 from 'web3';
import RBAC from '../../abis/RBAC.json'
import {RadioGroup, Radio} from 'react-radio-group'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class Admin extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadContract()
    }
    
    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
    
    
    async loadContract() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        console.log('Accounts -->', accounts)
        this.setState({ adminAccount: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const rbacNetworkData = RBAC.networks[networkId]
        if(rbacNetworkData) {
          const contract = web3.eth.Contract(RBAC.abi, rbacNetworkData.address)
          this.setState({ contract })
          const isAdmin = await contract.methods.checkIfAdmin(accounts[0]).call()
          console.log('Admin ', isAdmin)
          this.setState({ isAdmin })
          const roles = await contract.methods.getAllRoles().call()
          this.createRolesObject(roles)
        } else {
          window.alert('Smart contract not deployed to detected network.')
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            adminAccount: '',
            contract: '',
            accountId: '',
            privateKey: '',
            stationId: '',
            selectedRole: 'RW',
            isAdmin: false,
            roles: []
        }
    }

    createRolesObject(roles){
        const accounts = roles[0]
        const accountRoles = roles[1]
        const assigningAccounts = roles[2]
        const timestamps = roles[3]
        const stationIds = roles[4]
        var i;
        var previousRoles = []
        for (i=0; i<accountRoles.length; i++){
            var previousRole = {accountId : accounts[i], role : accountRoles[i], assigningAccount: assigningAccounts[i],
                 timestamp: new Date(timestamps[i] * 1000).toGMTString(), selected : false, stationId : stationIds[i]}
            previousRoles.push(previousRole)
        }
        this.setState({
            roles : previousRoles
        })
    }
    
    captureAccountId = (event) => {
        event.preventDefault()
        this.setState({
            accountId: event.target.value
        })
    }
    
    captureStationId = (event) => {
        event.preventDefault()
        this.setState({
            stationId: event.target.value
        })
    }
    capturePrivateKey = (event) => {
        this.setState({
            privateKey: event.target.value
        })
    }

    onRoleChange = (event) => {
        this.setState({
            selectedRole: event
        });
    }

    addRole = (event) => {
        event.preventDefault()
        console.log(new Date().getTime())
        this.state.contract.methods.addRole(this.state.selectedRole, this.state.accountId, this.state.adminAccount, Math.round(new Date().getTime()/1000), this.state.stationId).send({ from: this.state.adminAccount }).then((r) => {
            console.log('Role Added-->')
        })
    }

    handleSelection = (event) => {
        const index = event.target.value
        const currentRoles = this.state.roles
        const selectedRole = currentRoles[index]
        selectedRole.selected = !selectedRole.selected
        currentRoles[index] = selectedRole
        this.setState({
            roles : currentRoles
        })
    }

    removeRoles = (event) => {
        event.preventDefault()
        const currentRoles = this.state.roles
        const indicestoBeRemoved = []
        for(var i=0; i<currentRoles.length; i++){
            if(currentRoles[i].selected)
                indicestoBeRemoved.push(i);
        }
        console.log(indicestoBeRemoved);
        this.state.contract.methods.removeRole(indicestoBeRemoved[0]).send({ from: this.state.adminAccount }).then((r) => {
            console.log('Role Removed-->')
        })
    }

    render() {
        if(this.state.isAdmin){
            return (
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="https://github.com/esmonddsouza/CrimeChain" target="_blank" rel="noopener noreferrer" >
                        CrimeChain
                    </a>
                    <Link to="/Dashboard">
                        <Button variant="dark">Dashboard</Button>
                    </Link>
                    </nav>
                    <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h2>Add New Account</h2><br/>
                            <form onSubmit={this.addRole} >
                                Account Id: <input type='text' onBlur={this.captureAccountId} required= "true"/> <br/><br/>
                                Private Key: <input type='text' onBlur={this.capturePrivateKey} required= "true"/> <br/><br/>
                                Police Station Id: <input type='number' onBlur={this.captureStationId} required= "true"/> <br/><br/>
                                Role:
                                <RadioGroup name="Case Type" selectedValue={this.state.selectedRole} onChange={this.onRoleChange}>
                                <Radio value="RW" /> Read & Write &nbsp;
                                <Radio value="ADMIN" /> Admin &nbsp;
                                </RadioGroup>
                                <br/>
                                <input type='submit' value="Add Account"/>
                                <br/><br/><br/>
                            </form>
                            <h2>Remove Existing Accounts</h2><br/>
                            <form onSubmit={this.removeRoles}>
                            <table>
                                <tr>
                                    <th>Selected</th>
                                    <th>Account Id</th>
                                    <th>Role Assigned</th>
                                    <th>Station Id</th>
                                </tr>
                                {this.state.roles.map((role, index) => (
                                    <tr>
                                        <td><input type="checkbox" value={index} default={role.selected} onChange={this.handleSelection}/></td>
                                        <td>{role.accountId}</td>
                                        <td>{role.role}</td>
                                        <td>{role.stationId}</td>
                                  </tr>
                                ))}
                            </table>
                            <br/>
                            <input type='submit' value="Remove Account(s)"/>
                            </form>
                        </div>
                        </main>
                    </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="https://github.com/esmonddsouza/CrimeChain" target="_blank" rel="noopener noreferrer" >
                        CrimeChain
                    </a>
                    <Link to="/Dashboard">
                        <Button variant="dark">Dashboard</Button>
                    </Link>
                    </nav>
                    <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h2>Only Admins can add new accounts</h2>
                        </div>
                        </main>
                    </div>
                    </div>
                </div>
            );
        }

        
    }
}
export default Admin;