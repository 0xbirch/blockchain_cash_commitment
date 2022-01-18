
const hre = require("hardhat");

async function main() {
		const [deployer] = await ethers.getSigners();

  	console.log("Deploying contracts with the account:", deployer.address);

		const commitmentCoreContract = await hre.ethers.getContractFactory("CommitmentCore")
		const core = await commitmentCoreContract.deploy()
		await core.deployed()
/*    const Commitment = await hre.ethers.getContractFactory("Commitment")
    const date = new Date()
    const goalDate = Math.round(date.setDate(date.getDate() - 1) / 10000)
    const recieverWhenFail = "0x6468C7424e28EaE489b2A5e059a4a152A21cdb28"
    const amountToSave = ethers.utils.parseEther("0.2");
    const amountStaked = ethers.utils.parseEther("0.5")
    console.log("amount staking: ", ethers.utils.formatEther(amountStaked.toString()))
    const commitment = await Commitment.deploy(goalIndex, goalDate, recieverWhenFail, amountToSave, {value: amountStaked})

    await commitment.deployed() */

    console.log("CommitementCore contract deployed: ", commitmentCoreContract.address)
    console.log("The owner of the contract is: ", await commitmentCoreContract.owner())
}
// deployed ropsten contract is 0x1c924421351d2905D9b846FbC1EA2C4f59F1C82a
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
