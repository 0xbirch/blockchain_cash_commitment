const { expect } = require("chai");
const { ethers } = require("hardhat");
require("hardhat");
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
		assert(events[0].args[1] === await commitmentContract.getCommitment("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"))
	})	

	it("Should validate that check up keep should return false if there are no commitments to execute", async () => {
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() + 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)
		assert(returns[0] === false)
	})	
	
	it("Should validate that check up keep should return true if there are commitments to execute", async () => {
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)
		assert(returns[0] === true)
	})	
	
	it("Should validate that check up keep should return the correct address list if there are commitments to execute", async () => {
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)
		assert(returns[1].includes("f39fd6e51aad88f6f4ce6ab8827279cfffb92266")) 
		assert(returns[1].includes("1bc16d674ec80000"))

	})	
	
	it("Should validate that check up keep should return the correct address list when there is more than one address", async () => {
		// This should only pass if the did accomplish method is returning true; 
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const newSigner = commitmentContract.provider.getSigner("0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
		const newContract = commitmentContract.connect(newSigner)
        const goalDate2 = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await newContract.newCommitment(0, 
			goalDate2,
			"0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("1")})
		const data2 = "0x00";
		const returns = await commitmentContract.checkUpkeep(data2)
		assert(returns[1].includes("f39fd6e51aad88f6f4ce6ab8827279cfffb92266")) 
		assert(returns[1].includes("1bc16d674ec80000"))
		assert(returns[1].includes("70997970c51812dc3a010c7d01b50e0d17dc79c8")) 
		assert(returns[1].includes("de0b6b3a76400000"))

	})	
	
	it("Should validate that checkUpkeep returns the recipent and cut if someone diddnt accomplish their goal", async () => {
		// This should only pass if the did accomplish method is returning false; 
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)

		const balance = ethers.utils.parseEther("2")  
		console.log("balance", balance)
		const cut = balance.mul(375).div(10000)
		const expectedBytes = ethers.utils.defaultAbiCoder.encode(["uint", "uint"],[balance.sub(cut).toString(), cut.toString()])
	 	assert(returns[1].includes("70997970c51812dc3a010c7d01b50e0d17dc79c8"))
		assert(returns[1].includes("10a741a46278000"))
		assert(returns[1].includes("1ab6f94d08a08000"))

	})	

	it.only("performUpkeep should pay the address that needs to be paid the right amount no fee", async () => {
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const beginningBalance = ethers.getDefaultProvider().getBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)
//		console.log(returns[1])
		await commitmentContract.performUpkeep(returns[1]);	
		const endingBalance = ethers.getDefaultProvider().getBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
		assert(endingBalance.sub(beginningBalance) === ethers.utils.parseEther("2"))
	})	
	it("performUpkeep should pay the address that needs to be paid the right amount with fee", async () => {
	})	
	it("performUpkeep should pay the addresses that needs to be paid the right amount with fee", async () => {
	})	


})
