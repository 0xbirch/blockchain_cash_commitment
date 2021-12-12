
const hre = require("hardhat");

async function main() {
    const Commitment = await hre.ethers.getContractFactory("Commitment")
    const goalIndex = 0;
    const date = new Date()
    const goalDate = date.setDate(date.getDate() + 1)
    const recieverWhenFail = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"
    const amountToSave = ethers.utils.parseEther("1");
    console.log(amountToSave)
    const amountStaked = ethers.utils.parseEther("0.01203511")
    console.log("amount staking: ", amountStaked)
    const commitment = await Commitment.deploy(goalIndex, goalDate, recieverWhenFail, amountToSave, {value: amountStaked})

    await commitment.deployed()

    console.log("Commitement contract deployed: ", commitment.address)
    console.log("The owner of the contract is: ", await commitment.owner())
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })