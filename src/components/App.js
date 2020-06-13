import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Crime from '../abis/CrimeChain.json'
import {RadioGroup, Radio} from 'react-radio-group'


const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    console.log('Accounts -->', accounts)
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Crime.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Crime.abi, networkData.address)
      this.setState({ contract })
      const hash = await contract.methods.getCaseHash().call()
      this.setState({ 
        ipfsHash : hash,
        ipfsLink : 'https://ipfs.infura.io/ipfs/' + hash
      })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      ipfsHash: '',
      ipfsLink: '',
      contract: null,
      web3: null,
      buffer: null,
      buffer2: null,
      buffer3: null,
      account: null,
      selectedConnectionType: 'Plaintiff',
      selectedCaseStatus: 'New',
      selectedCaseType: 'Civil',
      name: '',
      address: '',
      date: '',
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    const hash1 = ''
    const hash2 = ''
    const hash3 = ''
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

       this.state.contract.methods.setCase(result[0].hash, this.state.name, this.state.selectedCaseType, this.state.selectedCaseStatus,
         this.state.selectedConnectionType, this.state.date).send({ from: this.state.account }).then((r) => {
          debugger;
          console.log('Logs-->', result.logs[0])
          return this.setState({ ipfsHash: result[0].hash })
       })
    })
  }

  onConnectionTypeChange = (event) => {
    this.setState({
      selectedConnectionType: event
      });
  }

  onCaseTypeChange = (event) => {
    this.setState({
      selectedCaseType: event
      });
  }

  onCaseStatusChange = (event) => {
    this.setState({
      selectedCaseStatus: event.target.value
    })
  }

  captureName = (event) => {
    event.preventDefault()
    this.setState({
      name: event.target.value
    })
  }

  captureAddress = (event) => {
    this.setState({
      address: event.target.value
    })
  }

  captureDate = (event) => {
    this.setState({
      date: event.target.value
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
                <a href= {this.state.ipfsLink} target="_blank" rel="noopener noreferrer">
                  IPFS File Hash : {this.state.ipfsHash}
                </a>
                <p>&nbsp;</p>
                <h2>Create New Case</h2>
                <form onSubmit={this.onSubmit} >
                  Name: <input type='text' onBlur={this.captureName}/> <br/>
                  Address: <input type='text' onBlur={this.captureAddress}/> <br/>
                  Date: <input type='date' onBlur={this.captureDate}/> <br/><br/>
                  {/* Victim Id: <input type='number' onBlur={this.captureFile}/> <br/>
                  Accused Id: <input type='number' onChange={this.captureFile}/> <br/><br/> */}
                  
                  Connection Type: 
                  <RadioGroup name="Conection Type" selectedValue={this.state.selectedConnectionType} onChange={this.onConnectionTypeChange} label="Connection TYpe">
                    <Radio value="Plaintiff" /> Plaintiff &nbsp;
                    <Radio value="Defendant" /> Defendant &nbsp;
                    <Radio value="Witness" /> Witness &nbsp;
                    <Radio value="Attorney" /> Attorney &nbsp;
                    <Radio value="Juror" /> Juror &nbsp;
                    <Radio value="Judge" /> Judge &nbsp;
                  </RadioGroup><br/>

                  Case Status: &nbsp;
                  <select value={this.state.selectedCaseStatus} onChange={this.onCaseStatusChange}>
                    <option value="New">New</option>
                    <option value="Tier 1 Analysis">Tier 1 Analysis</option>
                    <option value="Tier 2 New">Tier 2 New</option>
                    <option value="Tier 2 Analysis">Tier 2 Analysis</option>
                    <option value="Tier 2 Closed">Tier 2 Closed</option>
                    <option value="Pending Work Plan">Pending Work Plan</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Reopened">Reopened</option>
                    <option value="Closed">Closed</option>
                  </select> <br/><br/>
                  
                  Case Type:
                  <RadioGroup name="Case Type" selectedValue={this.state.selectedCaseType} onChange={this.onCaseTypeChange}>
                    <Radio value="Civil" /> Civil Case &nbsp;
                    <Radio value="Criminal" /> Criminal Case &nbsp;
                    <Radio value="Enforcement" /> Enforcement Case &nbsp;
                    <Radio value="Estate" /> Estate Case &nbsp;
                    <Radio value="Property" /> Property Case &nbsp;
                  </RadioGroup>
                  <br/>
                  
                  Evidence Files: <br/> <input type='file' onChange={this.captureFile} /><br/>
                  
                  <br/>
                  <input type='submit' />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}
export default App;