pragma solidity ^0.4.21;

/*
Election contract that allows the owner to issue voting rights
to anybody and also end the election and announce results
*/
contract Election {

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool authorized;
        bool voted;
        uint vote;
    }

    address public owner;
    string public electionName;
    string public winner;
    uint winningCount = 0;

    mapping(address => Voter) public voters;
    Candidate[] public candidates;

    event ElectionResult(string candidateName, uint voteCount);

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    function Election(string _name) public {
        owner = msg.sender;
        electionName = _name;
    }

    function addCandidate(string name) ownerOnly public {
        candidates.push(Candidate(name, 0));
    }

    function returnCandidate(uint id) public constant returns(string) {
    return (candidates[id].name);
    }

    function authorize(address person) ownerOnly public {
        voters[person].authorized = true;
    }

    function vote(uint voteIndex) public {
        //make sure voter is authorized and has not already voted
        require(!voters[msg.sender].voted);
        require(voters[msg.sender].authorized);

        //record vote
        voters[msg.sender].vote = voteIndex;
        voters[msg.sender].voted = true;

        //increase candidate vote count by 1
        candidates[voteIndex].voteCount += 1;
    }

    function findWinner() ownerOnly public {
        for (uint i=0; i<candidates.length; i++){
            ElectionResult(candidates[i].name, candidates[i].voteCount);
            if(candidates[i].voteCount >= winningCount)
            {
                winner = candidates[i].name;
                winningCount = candidates[i].voteCount;
            }
        }
    }
    function endVoting() ownerOnly public {
        selfdestruct(owner);
    }
}
