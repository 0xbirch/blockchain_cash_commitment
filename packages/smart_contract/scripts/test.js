
async function main() {
   const contract = await ethers.getContractAt("Commitment", "0xc469e7ae4ad962c30c7111dc580b4adbc7e914dd") 
   const amount = await ethers.provider.getBalance(contract.address)
    console.log("Contract balance: ", ethers.utils.formatEther(amount))
    console.log("response from evalutate: ", await contract.evaluate())
}


main()
