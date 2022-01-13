const { expect } = require("chai");
const assert = require("assert");
const exp = require("constants");

describe("CommittmentCore tests", function () {

	let commitmentContract

	beforeEach("set up commitmentCore contract", async () => {
		await ethers.provider.send("hardhat_reset", []);
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
			assert(error.message === "VM Exception while processing transaction: reverted with reason string 'Come on now, we don't want to see your ETH burned. Recipient is set to the zero address'")
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
		const tx = {
		to: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
		value: ethers.utils.parseEther("2"),
		}	
		const zaddy = commitmentContract.provider.getSigner("0xdD2FD4581271e230360230F9337D5c0430Bf44C0")
		await zaddy.sendTransaction(tx)
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
		const tx = {
		to: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
		value: ethers.utils.parseEther("2"),
		}	
		const zaddy = commitmentContract.provider.getSigner("0xdD2FD4581271e230360230F9337D5c0430Bf44C0")
		await zaddy.sendTransaction(tx)
		const tx2 = {
		to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
		value: ethers.utils.parseEther("2"),
		}	
		await zaddy.sendTransaction(tx2)
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

	it("performUpkeep should pay the recipient and the fee when goal has failed", async () => {
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)
		await commitmentContract.performUpkeep(returns[1]);	
		const endingBalance = await ethers.provider.getBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
		const endingBalanceMainAccount = await ethers.provider.getBalance("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199")
		const expectedCut = ethers.utils.parseEther("2").mul(ethers.utils.parseEther("375")).div(ethers.utils.parseEther("10000"))
		const expectedValue = ethers.utils.parseEther("10000").add(ethers.utils.parseEther("2")).sub(expectedCut)
		console.log("ending balance", endingBalance.toString(), "expexted balance", expectedValue.toString())
		assert(endingBalance.toString() === expectedValue.toString())
		assert(endingBalanceMainAccount.toString() === ethers.utils.parseEther("10000").add(expectedCut).toString())
	})	

	it("performUpkeep should send the money back to the original owner when goal was accomplished", async () => {
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const tx = {
		to: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
		value: ethers.utils.parseEther("2"),
		}	
		const newSigner = commitmentContract.provider.getSigner("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199")
		await newSigner.sendTransaction(tx)
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)
		await commitmentContract.performUpkeep(returns[1]);	
		const endingBalance = await ethers.provider.getBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
		const endingBalanceRecipient = await ethers.provider.getBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
		const expectedValue = ethers.utils.parseEther("10000")
		assert(endingBalance.toString() > expectedValue.toString())
		assert(endingBalanceRecipient.toString() === expectedValue.toString())
	})	

	it("performUpkeep should pay the mulitiple addresses that needs to be paid", async () => {
		// This tests needs to have didAccomplishGoal to return true 
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const newSigner = commitmentContract.provider.getSigner("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199")
		const newContract = commitmentContract.connect(newSigner)
		await newContract.newCommitment(0, 
			goalDate,
			"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const tx = {
		to: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
		value: ethers.utils.parseEther("2"),
		}	
		const zaddy = commitmentContract.provider.getSigner("0xdD2FD4581271e230360230F9337D5c0430Bf44C0")
		await zaddy.sendTransaction(tx)
		const tx2 = {
		to: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
		value: ethers.utils.parseEther("2"),
		}	
		await zaddy.sendTransaction(tx2)
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)
		await commitmentContract.performUpkeep(returns[1]);	
		const endingBalance = await ethers.provider.getBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
		const expectedValue = ethers.utils.parseEther("9997")
		assert(parseInt(endingBalance.toString()) > parseInt(expectedValue.toString()))

	})	

	it("performUpkeep should pay multiple recipients and the fee when goals has failed", async () => {
		// This tests needs to have didAccomplishGoal to return false
		const date = new Date()
        const goalDate = Math.round(date.setDate(date.getDate() - 1) / 1000)
		await commitmentContract.newCommitment(0, 
			goalDate,
			"0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const newSigner = commitmentContract.provider.getSigner("0x90F79bf6EB2c4f870365E785982E1f101E93b906")
		const newContract = commitmentContract.connect(newSigner)
		await newContract.newCommitment(0, 
			goalDate,
			"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", 
			ethers.utils.parseEther("1"), 
			{value: ethers.utils.parseEther("2")})
		const data = "0x00";
		const returns = await commitmentContract.checkUpkeep(data)
		await commitmentContract.performUpkeep(returns[1]);	
		const endingBalance = await ethers.provider.getBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8")
		const endingBalanceMainAccount = await ethers.provider.getBalance("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199")
		const expectedCut = ethers.utils.parseEther("2").mul(ethers.utils.parseEther("375")).div(ethers.utils.parseEther("10000"))
		const expectedValue = ethers.utils.parseEther("10000").add(ethers.utils.parseEther("2")).sub(expectedCut)
		console.log("Ending balance of the first recipient", ethers.utils.formatEther(endingBalance.toString()))
		assert(endingBalance.toString() === expectedValue.toString())
		assert(endingBalanceMainAccount.toString() === ethers.utils.parseEther("10000").add(expectedCut).add(expectedCut).toString())
	})	


})
