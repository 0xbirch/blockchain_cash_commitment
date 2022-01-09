//SPDX-L cense-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Commitment.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

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
		address[50] memory payableAddresses;
		uint[50] memory amountsStaked;
		uint ownerFee;
		uint8 count = 0;
		for (uint i = 0; i < eoaToContractAddressCommitments.length(); i++) {
			(uint256 committer, address contractAddress) = eoaToContractAddressCommitments.at(i);			
			Commitment commitment = Commitment(contractAddress);
		    if (commitment.isTimeToEvaluate()) {
				if (commitment.didAccomplishGoal()) {
					payableAddresses[count] = address(uint160(committer));
					amountsStaked[count] = contractAddress.balance;
				} else {
					payableAddresses[count] = commitment.getRecipient();
					(uint recipientAmount, uint ownerAmount) = calculateOwnerSplit(contractAddress);
					amountsStaked[count] = recipientAmount;
					ownerFee = ownerFee.add(ownerAmount);
			}
			upKeep = true;
			++count;	
		}
				
		}			
		return (upKeep, abi.encode(payableAddresses, amountsStaked, ownerFee));
	}


	function performUpkeep(bytes calldata performData) external override {
		(address[50] memory payableAddresses, uint[50] memory amountsStaked, uint ownerFee) = abi.decode(performData, (address[50], uint[50], uint));	
		for (uint8 i = 0; i < payableAddresses.length; i++) {
			if (payableAddresses[i] == address(0)) {
				break;
			}	
			console.log(amountsStaked[i]);
			// This is failing when it goes to estimate the gas. is there something wrong with the wei thats being passed in?
      		payable(payableAddresses[i]).transfer(amountsStaked[i]); 
		}
		if (ownerFee > 0) {
			payable(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199).transfer(ownerFee);
		}
	}
	
	function getCommitment(address committer) external view returns (address) {
		return eoaToContractAddressCommitments.get(convertToUint(committer));	
	}

	function convertToUint(address addr) private pure returns (uint) {
		return uint256(uint160(addr));	
	}

	 function calculateOwnerSplit(address contractAddress) private view returns (uint, uint) {
		uint balance = contractAddress.balance;
		uint ownerAmount = balance.mul(375).div(10000);
		return (balance.sub(ownerAmount), ownerAmount);
	 }

	receive() external payable {}
}
