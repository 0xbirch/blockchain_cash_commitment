import { useContractCall } from "@usedapp/core"
import { ethers } from "ethers"
import Commitment from "../../abi/Commitment.json"

export function useCommitmentEvaluate() {
    const abiInterface = new ethers.utils.Interface(Commitment.abi)
    console.log("contract: ", abiInterface)
//    useContractCall({
//        abi: abiInterface,


//    })
}