import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box, Text, FormControl, Select, FormLabel, FormErrorMessage, Button, InputGroup, InputRightAddon, Stack, NumberInput, NumberInputField, RadioGroup, Radio } from "@chakra-ui/react";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "react-datepicker/dist/react-datepicker.css";
import { useContractFunction, useEtherBalance, TransactionState, getStoredTransactionState } from "@usedapp/core"
import { formatEther } from '@ethersproject/units'
import { ethers } from "ethers"
import Commitment from "../abi/Commitment.json"

export default function CommitementForm(props: any) {

    const { register, setValue, handleSubmit, formState: { errors } } = useForm();
    const [startDate, setStartDate] = useState(new Date())
    const [recipient, setRecipient] = useState("1")
    let etherBalance = useEtherBalance(props.account)

    const deployContract = async (data: any) => {
	//	const newContract = new ethers.ContractFactory(Commitment.abi, Commitment.bytecode)
		console.log(data)
	//	newContract.deploy(data.goal, data.)
    }
	

    let alert = <h1>This is where an alert would go</h1>
    function onSubmit(data: any) {
        deployContract(data)
        alert = (
            <Alert status="success">
                <AlertIcon />
                <AlertTitle mr={2}>Title goes here man</AlertTitle>
                <CloseButton position='absolute' right='8px' top='8px' />
            </Alert>
        )
    }

    return (
        <div>
            <Box>
                <Text color="white" fontSize="md">
                    Account: {props.account}
                </Text>
                <Text color="white" fontSize="md">
                    Balance: {etherBalance ? formatEther(etherBalance) : 0} ETH
                </Text>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.name}>
                    <FormLabel pt={10} htmlFor="goal" color="white">What is your goal?</FormLabel>
                    <Select color="white" placeholder='Select option' id="goal">
                        <option {...register("goal", {
                            required: "This is required"
                        })} value='0'>Save or Make Money</option>
                    </Select>
                    <FormLabel pt={10} htmlFor="timeframe" color="white">When do you want to accomplish your goal by?</FormLabel>
                            <DatePicker {...register('deadline', { value: startDate})} selected={startDate} onChange={(date: any) => {
								setValue("deadline", date)
								return setStartDate(date)
							}} />
                    <FormLabel pt={10} htmlFor="amountStaked" color="white">How much do you want to stake?</FormLabel>
                    <InputGroup>
                        <NumberInput defaultValue={1.0} precision={10} max={10000} min={0.0000000001}>
                            <NumberInputField
                                color="white"
                                id="amountStaked"
                                placeholder="1"
                                {...register("amountStaked", {
                                    required: "This is required"
                                })} />
                        </NumberInput>
                        <InputRightAddon children="ETH" />
                    </InputGroup>
                    <FormLabel pt={10} htmlFor="recipient" color="white">Who do you want your stake to go to if you don't meet your goal?</FormLabel>
                    <RadioGroup onChange={setRecipient} value={recipient}>
                        <Stack>
                            <Radio {...register("recipient")} value="1" color="white">Trump</Radio>
                            <Radio {...register("recipient")} value="2" color="white">Biden</Radio>
                        </Stack>
                    </RadioGroup>
                    <FormErrorMessage>
                        {errors.name && errors.name.message}
                    </FormErrorMessage>
                </FormControl>
                <Button mt={4} colorScheme="teal" type="submit">
                    Submit
                </Button>
            </form>
            {alert && alert} 
        </div>
    )
}
