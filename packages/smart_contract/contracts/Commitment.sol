//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Commitment is Ownable {
	using SafeMath for uint;    

		event CommitmentPayout(address indexed to, uint amount);

    struct SaveMoneyData {
        uint startingAmount;
        uint amountToSave;
    }

    uint64 deadline;
    address payable recipient;
		address commiter;
    SaveMoneyData data;

     constructor(uint64 date, address payable receiver, address originalCommiter, uint amountToSave) payable {
         deadline = date;
         recipient = receiver;
				 commiter = originalCommiter;
         data = SaveMoneyData(originalCommiter.balance, amountToSave);
     }

	 function isTimeToEvaluate() public view onlyOwner returns (bool) {
        if (block.timestamp < deadline) {
					return false;
				} else {
					return true;
				}
	 }

	 function didAccomplishGoal() public view onlyOwner returns (bool) {
		return commiter.balance >= (data.startingAmount.add(data.amountToSave)); 
	 }

	 function getRecipient() public view onlyOwner returns (address payable) {
		return recipient;	 
	 }

	function executePayout(address payable to, uint amount) public onlyOwner {
			to.transfer(amount);
			emit CommitmentPayout(to, amount);
	}	
}
