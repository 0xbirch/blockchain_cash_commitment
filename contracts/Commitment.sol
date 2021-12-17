//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// What licence are you going to use?

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Commitment is Ownable {
    
    struct SaveMoneyData {
        uint startingAmount;
        uint amountToSave;
    }

    uint goal;
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
        require(block.timestamp > deadline, "It is not yet the commitment deadline.");
        _;
     }

     event Transfer(
         address _from,
         address _to,
         uint _value
     );

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
            uint chainId;

            // Remove this check when deploying to mainnet, probably don't need it
            assembly {
             chainId := chainid()
            }
            address payable owner = payable(chainId == 1337 ? 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 : 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec);

            owner.transfer(cut);
            emit Transfer(address(this), owner, cut);
        }
     }

     
}