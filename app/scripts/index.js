// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import ElectionArtifact from '../../build/contracts/Election.json'

// Election is our contract abstract, which we'll use through the code below.
const Election = contract(ElectionArtifact)

// The following code is simple to show off interacting with your contracts.
 let accounts;
 let account;

const getOwner = async () => {
  const instance = await Election.deployed();
  const response = await instance.owner.call();
  var owner = document.getElementById("owner");
      owner.innerHTML = response;
}


const getElectionName = async () => {
  const instance = await Election.deployed();
  const response = await instance.electionName.call();
  const owner = document.getElementById("name");
      owner.innerHTML = response;
}

const list = async () => {
  const instance = await Election.deployed();
  const response = await instance.returnCandidate.call(0);
  document.getElementById("list").innerHTML = response;
}

const add = async () => {
  const instance = await Election.deployed();
  const candidateName = document.getElementById("add").value;
  let response = await instance.addCandidate(candidateName, {from: account});
  App.setStatus("New Candidate " + candidateName + " has added successfully!");
}


const App = {
  start: function (){
    const self = this;

    Election.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
      accounts = accs;
      account = accounts[0];
    })
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  owner: function () {
    getOwner();
  },

  electionName: function () {
    getElectionName();
  },

  addCandidate: function () {
    add();
  },

  listCandidates: function () {
    list();
  },
}

window.App = App
// Add an event listener, and call the App.start() function to set the providers
// and to make sure we can load available Ethereum accounts

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
