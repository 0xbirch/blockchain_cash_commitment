New Contract that is the commitment process

	mapping (address -> commitmentID)?
	struct Commitment {
		goal,
		recipient,
 		deadline,
		goalData
  	}

	struct goalData {
		startingValue
		endingValue
}

	newCommitment(goal, recipient, deadline, {startingValue, endingValue}, {value: amount} {
		mapping[msg.sender] = new Commitment(goal, recipient, ) 
}
