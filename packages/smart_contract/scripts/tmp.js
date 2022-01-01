
const hre = require("hardhat");

async function main() {
    const Commitment = await hre.ethers.getContractFactory("Tmp")
    const commitment = await Commitment.deploy()

    await commitment.deployed()

    console.log("Commitement contract deployed: ", commitment.address)
	await commitment.addMapping()
    console.log("Got passed the first addMapping") 
	await commitment.addMapping()
    console.log("Got passed the second addMapping") 
	const test = await commitment.test(2)
	console.log("The mapping looks like:", test)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
