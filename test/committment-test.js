const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Committment", function () {
    let Commitment
    let goalIndex
    let date
    let recieverWhenFail
    let amountToSave
    let amountStaked
    let defaultCommitment
    let amountStakedInEtherString = "0.01203511"
  before('Set up commitmnt contract', async () => {
    Commitment = await ethers.getContractFactory("Commitment")
    goalIndex = 0;
    date = Date.now()
    recieverWhenFail = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"
    amountToSave = ethers.utils.parseEther("1");
    amountStaked = ethers.utils.parseEther(amountStakedInEtherString)
    defaultCommitment = await Commitment.deploy(goalIndex, date, recieverWhenFail, amountToSave, {value: amountStaked})

    await defaultCommitment.deployed()
  })
  it("Should reject the evaluate transaction if the goal deadline has not been reached", async function () {
    const date = new Date()
    goalDate = date.setDate(date.getDate() + 1)
    const newCommitment = await Commitment.deploy(goalIndex, goalDate, recieverWhenFail, amountToSave, {value: amountStaked})
    await newCommitment.deployed()
    expect(newCommitment.evaluate()).to.be.revertedWith("It is not yet the commitment deadline.")
  });

//   it("Should send the balance back the owner if goal was reached", async () => {
//       const signer = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", ethers.provider)
//       await signer.sendTransaction({to: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", value: ethers.utils.parseEther("2")})
//       const balanceBeforeGoalTransaction = await ethers.provider.getBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
//       await defaultCommitment.evaluate()
//       const balanceAfterGoalTransaction = await ethers.provider.getBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
//       const diff = parseFloat(ethers.utils.formatEther(balanceAfterGoalTransaction.sub(balanceBeforeGoalTransaction).toString())).toFixed(3)
//       const staked = parseFloat(amountStakedInEtherString).toFixed(3)
//      expect(diff).to.equal(staked)
//   })
});
