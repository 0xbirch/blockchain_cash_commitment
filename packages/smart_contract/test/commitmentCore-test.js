const { expect } = require("chai");
const { ethers } = require("hardhat");
const assert = require("assert")
describe("CommittmentCore tests", function () {

	let commitmentContract

	beforeEach("set up commitmentCore contract", async () => {
		const CommitmentCore = await ethers.getContractFactory("CommitmentCore")
		commitmentContract = await CommitmentCore.deploy()
		await commitmentContract.deployed()
	})

	it("Should validate that the address is not the zero address", async () => {
		try {
		  await commitmentContract.newCommitment(0, 
			Date.now(), 
			"0x0000000000000000000000000000000000000000", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		} catch (error) {
			assert(error.message === "Error: VM Exception while processing transaction: reverted with reason string 'Come on now, we don't want to see your ETH burned. Recipient is set to the zero address'")
		}
	})	

	it("Should validate that a commitment was set up", async () => {
		await commitmentContract.newCommitment(0, 
			Date.now(), 
			"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const events = await commitmentContract.queryFilter("CommitmentContractCreated")
		assert(events[0].args[0] === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
	})	

	it("Should validate that the new commitment contract address is the same as the address listed in the mapping", async () => {
		await commitmentContract.newCommitment(0, 
			Date.now(), 
			"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const events = await commitmentContract.queryFilter("CommitmentContractCreated")
		assert(events[0].args[1] === await commitmentContract.commitments("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"))
	})	
})
