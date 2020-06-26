import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import RBAC from '../abis/RBAC.json'
import {RadioGroup, Radio} from 'react-radio-group'
import axios from "axios"


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
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const rbacNetworkData = RBAC.networks[networkId]
        if(rbacNetworkData) {
          const contract = web3.eth.Contract(RBAC.abi, rbacNetworkData.address)
          this.setState({ contract })
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
            selectedRole: ''
        }
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

    onSubmit = (event) => {
        event.preventDefault()
        this.state.contract.methods.addRole(this.state.selectedRole, this.state.accountId).send({ from: this.state.adminAccount }).then((r) => {
            console.log('Role Added-->')
        })
    }

    render() {
        return (
        <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="https://github.com/esmonddsouza/CrimeChain" target="_blank" rel="noopener noreferrer" >
                CrimeChain
            </a>
            </nav>
            <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                    <h2>Add Remove New Role</h2>
                    <form onSubmit={this.onSubmit} >
                        Account Id: <input type='text' onBlur={this.captureAccountId}/> <br/><br/>
                        Private Key: <input type='text' onBlur={this.capturePrivateKey}/> <br/><br/>
                        Police Station Id: <input type='number' onBlur={this.captureStationId}/> <br/><br/>
                        Role:
                        <RadioGroup name="Case Type" selectedValue={this.state.selectedRole} onChange={this.onRoleChange}>
                        <Radio value="Civil" /> Read & Write &nbsp;
                        <Radio value="Criminal" /> Admin &nbsp;
                        </RadioGroup>
                    </form>
                </div>
                </main>
            </div>
            </div>
        </div>
        );
    }
}
export default Admin;