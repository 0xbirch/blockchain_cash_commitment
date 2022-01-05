//SPDX-L cense-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Commitment.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CommitmentCore is KeeperCompatibleInterface {
	using EnumerableMap for EnumerableMap.UintToAddressMap;
	using SafeMath for uint;
	
	event CommitmentContractCreated(address indexed owner, address contractAddress);
	EnumerableMap.UintToAddressMap private eoaToContractAddressCommitments;

	modifier validateParams(uint8 goal, uint64 date, address payable recipient, uint amountToSave) {
		// Validate other params here	
		require(recipient != address(0), "Come on now, we don't want to see your ETH burned. Recipient is set to the zero address");
        _;
	}

	function newCommitment(uint8 goal, uint64 date, address payable recipient, uint amountToSave) validateParams(goal, date, recipient, amountToSave) external payable {
			Commitment commitmentContract = new Commitment{value: msg.value}(goal, date, recipient, amountToSave); 
			address commitmentAddress = address(commitmentContract);
			eoaToContractAddressCommitments.set(uint256(uint160(msg.sender)), commitmentAddress);
			emit CommitmentContractCreated(msg.sender, commitmentAddress);
	}	
	
	function checkUpkeep(bytes calldata checkdata) external override view returns (bool, bytes memory) {
		bool upKeep = false;
		address[] memory payableAddresses;
		uint ownerFee;
		for (uint i = 0; i < eoaToContractAddressCommitments.length(); i++) {
			(uint256 committer, address contractAddress) = eoaToContractAddressCommitments.at(i);			
			Commitment commitment = Commitment(contractAddress);
		    if (commitment.isTimeToEvaluate()) {
				upKeep = true;
				if (commitment.didAccomplishGoal()) {
				//	payableAddresses.push(committer);
				} else {
				//	payableAddresses.push(commitment.getRecipient());
					ownerFee.add(commitment.calculateOwnerFee());
			}
				
		}
				
		}			
		return (upKeep, abi.encode(payableAddresses, ownerFee));
	}


	function performUpkeep(bytes calldata performData) external override {
			
	}
	
	function getCommitment(address committer) external view returns (address) {
		return eoaToContractAddressCommitments.get(convertToUint(committer));	
	}

	function convertToUint(address addr) private pure returns (uint) {
		return uint256(uint160(addr));	
	}

	receive() external payable {}
}
