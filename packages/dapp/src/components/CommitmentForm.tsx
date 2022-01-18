import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box, Text, FormControl, Select, FormLabel, FormErrorMessage, Button, InputGroup, InputRightAddon, Stack, NumberInput, NumberInputField, RadioGroup, Radio } from "@chakra-ui/react";
import DatePicker from "react-datepicker"
import { useContractFunction, useEtherBalance, TransactionState, getStoredTransactionState } from "@usedapp/core"
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "react-datepicker/dist/react-datepicker.css";
import { formatEther } from '@ethersproject/units'
import { ethers } from "ethers"
import Commitment from "../abi/Commitment.json"

export default function CommitementForm(props: any) {

    const { watch, register, setValue, handleSubmit, formState: { errors } } = useForm();
    const [startDate, setStartDate] = useState(new Date())
    const [recipient, setRecipient] = useState("1")
	let etherBalance = useEtherBalance(props.account)
	const provider = props.provider
	const watchGoal = watch('goal')
	
    const deployContract = async (goal: number, deadline: number, beneficiary: string | undefined, amountStaked: number, amountToSave: number) => {
		console.log(goal, deadline, beneficiary, amountStaked, amountToSave)
		const newContract = new ethers.ContractFactory(Commitment.abi, Commitment.bytecode, provider.getSigner())
		try {
			await newContract.deploy(goal, deadline, beneficiary, amountToSave, {value: amountStaked})
		} catch(error) {
			console.error(error)
		}
	}	

    let alert = <h1>This is where an alert would go</h1>
    function onSubmit(data: any) {
		console.log("data", data)	
		const beneficiaryMapping = new Map<string, string>([
			["0", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"],
			["1", "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"],
			["2", "0x90f79bf6eb2c4f870365e785982e1f101e93b906"],
			["3", "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65"],
			["4", "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc"]
		])

		data.amountStaked = ethers.utils.parseEther(data.amountStaked)
		data.amountSaved = ethers.utils.parseEther(data.amountSaved)
        // deployContract(data.goal, data.deadline.getTime(), beneficiaryMapping.get(data.recipient), data.amountStaked, data.amountSaved)
        alert = (
            <Alert status="success">
                <AlertIcon />
                <AlertTitle mr={2}>Title goes here man</AlertTitle>
                <CloseButton position='absolute' right='8px' top='8px' />
            </Alert>
        )
    }

	const amountToSaveComponent = (
		<div>
			<FormLabel pt={10} htmlFor="amountSaved" color="white">How much would you like to save?</FormLabel>
			<InputGroup>
				<NumberInput defaultValue={1.0} precision={10} max={10000} min={0.0000000001}>
					<NumberInputField
						color="white"
						id="amountSaved"
						placeholder="3"
						{...register("amountSaved", {
							required: "This is required"
						})} />
				</NumberInput>
				<InputRightAddon children="ETH" />
			</InputGroup>
		</div>
	)

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
                    <Select {...register("goal", {required: "This is required"})} color="white" placeholder='Select option' id="goal">
                        <option value='0'>Save or Make Money</option>
						<option value='1'>Another Goal</option>
                    </Select>
					{watchGoal === '0' && amountToSaveComponent}
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
		// Git coin grants matching pool?
                            <Radio {...register("recipient")} value="0" colorScheme="white"><Text color="white">Test Account 1</Text></Radio>
                            <Radio {...register("recipient")} value="1" color="white"><Text color="white">Test Account 2</Text></Radio>
                            <Radio {...register("recipient")} value="2" color="white"><Text color="white">Test Account 3</Text></Radio>
                            <Radio {...register("recipient")} value="3" color="white"><Text color="white">Test Account 4</Text></Radio>
                            <Radio {...register("recipient")} value="4" color="white"><Text color="white">Test Account 5</Text></Radio>
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
	
