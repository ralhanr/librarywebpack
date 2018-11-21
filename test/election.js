import "babel-polyfill";
var Election = artifacts.require("..contracts/Election.sol");


let election;
let accounts;

beforeEach( async () => {
// Deploy the contract and get available accounts
  election = await Election.deployed();
  await contract('Udacity', function(acc) {
    accounts = acc;
  })
  });
  
  describe('all tests', () => {

    it('can create an Election owner', async () => {
      const owner = await election.owner();
      assert.equal(owner, accounts[0]);

    })

    it('can give and Election Name', async () => {
      const name = await election.electionName();
      assert.equal(name, 'Udacity');

    })

    it('can add a Candidate', async () => {
      await election.addCandidate("Rachna", {from: accounts[0]});
      const result = await election.candidates(0);
      assert.equal(result[0], "Rachna");

    })
  })
