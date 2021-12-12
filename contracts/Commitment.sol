//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// What licence are you going to use?

import "@openzeppelin/contracts/access/Ownable.sol";

contract Commitment is Ownable {
    
    struct SaveMoneyData {
        uint startingAmount;
        uint amountToSave;
    }

    uint goal;
    // Can this date be smaller size?
    uint64 deadline;
    address payable recipient;
    SaveMoneyData data;
    
    // New contract for every goal? or can this be reused? does it make sense to resue?
     constructor(uint commitmentGoal, uint64 date, address payable receiver, uint amountToSave) payable {
         goal = commitmentGoal;
         deadline = date;
         recipient = receiver;
         data = SaveMoneyData(msg.sender.balance, amountToSave);
     }

     modifier isTime() {
        require(block.timestamp >= deadline, "It is not yet the commitment deadline.");
        _;
     }

     function didSaveMoney() internal view returns (bool) {
        return owner().balance >= (data.startingAmount + data.amountToSave);
     }

     function evaluate() external isTime onlyOwner {
        bool accomplished = false;
        if (goal == 0) {
            accomplished = didSaveMoney();
        } else if (goal == 1) {
            // Did they accomplish goal 2?
        } else if (goal == 2) {
            // did they accomplish goal 3?
        }
        if (accomplished) {
            payable(owner()).transfer(address(this).balance);
        } else {
            uint amount = address(this).balance;
            uint cut = amount * 375 / 10000;
            recipient.transfer(amount - cut);
            payable(0x058243BD7F888cBcff798df3Fa4c7BFc7a1f86a7).transfer(cut);
        }
     }

     
}