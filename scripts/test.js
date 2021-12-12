
async function main() {
   const contract = await ethers.getContractAt("Commitment", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0") 
   const amount = await ethers.provider.getBalance(contract.address)
    console.log("Contract balance: ", ethers.utils.formatEther(amount))
    console.log("response from evalutate: ", await contract.evaluate())
}


main()