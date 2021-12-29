//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Commitment is Ownable, KeeperCompatibleInterface {
	using SafeMath for uint;    

    struct SaveMoneyData {
        uint startingAmount;
        uint amountToSave;
    }

    uint8 goal;
    uint64 deadline;
    address payable recipient;
    SaveMoneyData data;
    
     constructor(uint8 commitmentGoal, uint64 date, address payable receiver, uint amountToSave) payable {
         goal = commitmentGoal;
         deadline = date;
         recipient = receiver;
         data = SaveMoneyData(msg.sender.balance, amountToSave);
     }

     function checkUpkeep(bytes calldata /*checkData*/) external override view returns (bool, bytes memory) {
        if (block.timestamp < deadline) {
				return (false, bytes(""));
		}

		if (goal == 0) {
			address payable localRecipient;
			uint amount; 
			uint cut;

			if (owner().balance >= (data.startingAmount.add(data.amountToSave))) {
				localRecipient = payable(owner());
				amount = address(this).balance;	
            } else {
				uint balance = address(this).balance;
				localRecipient = recipient; 
				cut = balance.mul(375).div(10000);
				amount = balance.sub(cut);
            }

			bytes memory performData = abi.encode(localRecipient, amount, cut);
			return (true, performData);

		} else {
			return (false, bytes(""));
		}

     }

     function performUpkeep(bytes calldata performData) external override {
		(address localRecipient, uint amount, uint cut) = abi.decode(performData, (address, uint, uint));	
       	payable(localRecipient).transfer(amount); 
		if (cut > 0) {
			payable(0x9eE843fefFc921763025221f88e65C85de69ec11).transfer(cut);
		}
	}

     
}
