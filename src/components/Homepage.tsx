import { useEthers } from "@usedapp/core"
import CommitementForm from "./CommitmentForm"
import { Text, Button } from '@chakra-ui/react'

export default function Homepage() {
    const {activateBrowserWallet, account, error} = useEthers()

    function connectWallet() {
        activateBrowserWallet()
    }

    let component
    if (error) {
        component = (
            <div>
				{error.name === "NoEthereumProviderError" ? <Text color="white">Please authorize your wallet on this page</Text> : <Text color="white">We do not support any chain other than Ethereum at the moment</Text>}
                <Button onClick={connectWallet}>Connect wallet</Button>
            </div>

        )
    } else if (!account) {
        component = <Button onClick={connectWallet}>Connect wallet</Button>
    } else {
        component = <CommitementForm account={account}/> 
    }

    return component
}
