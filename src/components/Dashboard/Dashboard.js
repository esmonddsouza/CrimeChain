import React, { Component } from 'react';
import Web3 from 'web3';
import { Button } from 'react-bootstrap';
import Crime from '../../abis/CrimeChain.json'
import RBAC from '../../abis/RBAC.json'
import { RadioGroup, Radio } from 'react-radio-group'
import { Link } from 'react-router-dom';



const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Dashboard extends Component {

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
    this.setState({ 
      account: accounts[0]
    })
    const networkId = await web3.eth.net.getId()
    const crimeNetworkData = Crime.networks[networkId]
    const rbacNetworkData = RBAC.networks[networkId]
    if(crimeNetworkData && rbacNetworkData) {
      const rbacContract = web3.eth.Contract(RBAC.abi, rbacNetworkData.address)
      const accountAllowed = await rbacContract.methods.hasRole(accounts[0].toString(), 'RW').call()
      this.setState({ 
        allowed: accountAllowed
      })
      if (accountAllowed) {
        const accountDetails = await rbacContract.methods.getRoleDetails(accounts[0].toString(), 'RW').call()
        this.setState({ 
          assigningAccount: accountDetails[0],
          stationId : accountDetails[1]
        })
      }
      console.log('Allowed? ', accountAllowed)
      const contract = web3.eth.Contract(Crime.abi, crimeNetworkData.address)
      this.setState({ contract })
      const hash = await contract.methods.getCaseHash().call()
      this.setState({ 
        ipfsHash : hash,
        ipfsLink : 'https://ipfs.infura.io/ipfs/' + hash
      })
      const prevName = await contract.methods.getName().call()
      this.setState({
        previousCaseName : prevName
      })
      const prevAddress = await contract.methods.getAddress().call()
      this.setState({
        previousCaseAddress : prevAddress
      })
      const prevCaseType = await contract.methods.getCaseType().call()
      this.setState({
        previousCaseType : prevCaseType
      })
      const prevCaseStatus = await contract.methods.getCaseStatus().call()
      this.setState({
        previousCaseStatus : prevCaseStatus
      })
      const prevConnectionType = await contract.methods.getCaseConnectionType().call()
      this.setState({
        previousConnectionType : prevConnectionType
      }) 
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      ipfsHash: '',
      newIpfsHash: '',
      ipfsLink: '',
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      selectedConnectionType: 'Plaintiff',
      selectedCaseStatus: 'New',
      selectedCaseType: 'Civil',
      name: '',
      address: '',
      date: '',
      previousCaseName: '',
      previousCaseAddress: '',
      previousCaseStatus: '',
      previousConnectionType: '',
      previousCaseType: '',
      previousIv: '',
      allowed: false,
      iv: '',
      encryptedData: '',
      decryptedData: '',
      fileName: '',
      previousFileName: '',
      assigningAccount: '',
      stationId : ''
    }
    this.encryptData = this.encryptData.bind(this)
    this.fetchFile = this.fetchFile.bind(this)
    this.decryptData = this.decryptData.bind(this)
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    console.log('File-->', file)
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ 
        buffer: Buffer(reader.result),
        fileName: file.name
      })
      console.log('buffer', this.state.buffer)
    }
  }
  
  encryptData() {
    console.log('Encrypting file...')
    const data = {
        "data": this.state.buffer,
        "iv": 0,
        "encrypt": true
    }
    fetch('http://localhost:8000/intel/sgx/ra', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then(response => {
        if(response){  
          const data = response['data']['data'] + '&&&&&' +  response['iv'] + '&&&&&' + this.state.fileName; 
          this.setState({
            buffer : Buffer.from(data, "utf-8"),
          })
          this.submitDataToIPFSAndBlockchain()
        }
    })
  }

  fetchFile() {
    console.log('Fetching  file..')
    ipfs.get(this.state.ipfsHash, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      console.log('Content-->', result[0].content);
      this.setState({
        encryptedData : result[0].content.toString('utf8').split('&&&&&')[0],
        iv : result[0].content.toString('utf8').split('&&&&&')[1],
        previousFileName : result[0].content.toString('utf8').split('&&&&&')[2]
      })
      this.decryptData()
    })
  }

  decryptData() {
    const data = {
      "data": this.state.encryptedData,
      "iv": this.state.iv,
      "encrypt": false
    }
    console.log('Decrypting  file...')
    fetch('http://localhost:8000/intel/sgx/ra', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then(response => {
        if(response){ 
          console.log(response)
          this.logEvent(this.state.ipfsHash, 'D')
          const data = response['data']
          const buf = Buffer.from(data); 
          this.setState({
            decryptedData : buf
          })
          console.log(buf)
          console.log("Downloading File...")
          var file = new File([buf], this.state.previousFileName)
          console.log('File-->', file)
          let url = window.URL.createObjectURL(file)
					let a = document.createElement('a');
					a.href = url;
					a.download = this.state.previousFileName;
					a.click();
        }
    })
  }

  submitDataToIPFSAndBlockchain(){
    console.log(this.state.buffer)
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result-->', result)
      if(error) {
        console.error(error)
        return
      }
      else {
        this.setState({
          newIpfsHash : result[0].hash
        })
      }
      const response = this.state.contract.methods.setCase(result[0].hash, this.state.name, this.state.address, this.state.selectedCaseType, this.state.selectedCaseStatus,
        this.state.selectedConnectionType, '').send({ from: this.state.account })
      this.logEvent(result[0].hash, 'E')
    })
  }

  logEvent(ipfsHash, action){
    const data = {
      "userId": '1234',
      "accountId": this.state.account,
      "assigningAccountId": this.state.assigningAccount,
      "ipfsHash": ipfsHash,
      "dataTime": Math.round(new Date().getTime()/1000),
      "policeStationId": this.state.stationId,
      "action": action
    }
    console.log('Logging event...')
    fetch('http://localhost:8000/logger/eventLogger', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (response.status === 200) {
        console.log('Event logged')
      }
      else {
        console.log('There was a problem while logging the event.')
      }
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.encryptData()    
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
    if (this.state.allowed){
      return (
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="https://github.com/esmonddsouza/CrimeChain" target="_blank" rel="noopener noreferrer" >
              CrimeChain
            </a>
            <Link to="/Admin">
                <Button variant="dark">Admin Page</Button>
            </Link>
          </nav>
          
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  <h2>Create New Case</h2>
                  <form onSubmit={this.onSubmit} >
                    Name: <input type='text' onBlur={this.captureName}/> <br/><br/>
                    Address: <input type='text' onBlur={this.captureAddress}/> <br/><br/>
                    
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
                    
                    Evidence Files: &nbsp; <input type='file' onChange={this.captureFile} /><br/>
                    
                    <br/>
                    <input type='submit' />
                    <br/><br/>
  
                    <h2>Previous Case Details</h2>
                    Name: {this.state.previousCaseName} &nbsp; &nbsp; <br/>
                    Address: {this.state.previousCaseAddress} <br/>
                    Case Type: {this.state.previousCaseType} <br/>
                    Connection Type: {this.state.previousConnectionType} <br/>
                    Case Status: {this.state.previousCaseStatus} <br/>
                    IPFS File Hash: <a href= {this.state.ipfsLink} target="_blank" rel="noopener noreferrer">
                    {this.state.ipfsHash}
                  </a>
                  <br/><br/>
                    <input type='button' value="Decrypt File" onClick={this.fetchFile}/>       
                  </form>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="https://github.com/esmonddsouza/CrimeChain" target="_blank" rel="noopener noreferrer" >
              CrimeChain
            </a>
            <Link to="/Admin">
                <Button variant="dark">Admin Page</Button>
            </Link>
          </nav>
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  <h2>This account is not allowed to create any cases</h2> <br/><br/>

                  <b>Previous Case Details</b><br/>
                    Name: {this.state.previousCaseName} &nbsp; &nbsp; <br/>
                    Address: {this.state.previousCaseAddress} <br/>
                    Case Type: {this.state.previousCaseType} <br/>
                    Connection Type: {this.state.previousConnectionType} <br/>
                    Case Status: {this.state.previousCaseStatus} <br/>
                    IPFS File Hash: <a href= {this.state.ipfsLink} target="_blank" rel="noopener noreferrer">
                   {this.state.ipfsHash}
                  </a>
                </div>
              </main>
            </div>
          </div>
        </div>
      )
    }
  }
}
export default Dashboard;