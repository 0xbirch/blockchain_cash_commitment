//SPDX-L cense-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Commitment.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract CommitmentCore is KeeperCompatibleInterface {

	event CommitmentContractCreated(address indexed owner, address contractAddress);
	mapping(address => address) public commitments;

	modifier validateParams(uint8 goal, uint64 date, address payable recipient, uint amountToSave) {
		// Validate other params here	
		require(recipient != address(0), "Come on now, we don't want to see your ETH burned. Recipient is set to the zero address");
        _;
	}

	function newCommitment(uint8 goal, uint64 date, address payable recipient, uint amountToSave) validateParams(goal, date, recipient, amountToSave) external payable {
			Commitment commitmentContract = new Commitment{value: msg.value}(goal, date, recipient, amountToSave); 
			address commitmentAddress = address(commitmentContract);
			commitments[msg.sender] = commitmentAddress; 
			emit CommitmentContractCreated(msg.sender, commitmentAddress);
	}	
	
	function checkUpkeep(bytes calldata checkdata) external override view returns (bool, bytes memory) {
			
	}

	function performUpkeep(bytes calldata performData) external override {
			
	}

	receive() external payable {}
}
