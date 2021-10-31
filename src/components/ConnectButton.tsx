import {Button, Box, Text} from "@chakra-ui/react"
import {useEthers, useEtherBalance} from "@usedapp/core"

export default function ConnectButton() {
    const {activateBrowserWallet, account} = useEthers()
    const etherBalance = useEtherBalance(account)

    function connectWallet() {
        activateBrowserWallet()
    }

    return account ? (
        <Box>
            <Text color="white" fontSize="md">
                {etherBalance ? etherBalance : 0} ETH
            </Text>
        </Box>
    ) : (
        <Button onClick={connectWallet}>Connect to a wallet</Button>
    )
}