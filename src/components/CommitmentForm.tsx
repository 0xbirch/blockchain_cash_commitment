import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Box, Text, FormControl, Select, FormLabel, FormErrorMessage, Button, InputGroup, InputRightAddon, Stack, NumberInput, NumberInputField, RadioGroup, Radio } from "@chakra-ui/react";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "react-datepicker/dist/react-datepicker.css";
import { useEtherBalance } from "@usedapp/core"
import { formatEther } from '@ethersproject/units'

export default function CommitementForm(props: any) {

    const { register, control, handleSubmit, formState: { errors } } = useForm();
    const [startDate, setStartDate] = useState(new Date())
    const [recipient, setRecipient] = useState("1")
    console.log("props account", props.account)
    let etherBalance = useEtherBalance(props.account)
    console.log("Balance:", etherBalance)

    function onSubmit(data: any) {
        console.log(data)
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
                    <Controller
                        control={control}
                        name='date-input'
                        render={({ field }) => (
                            <DatePicker selected={startDate} onChange={(date: any) => setStartDate(date)} />
                        )}
                    />
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
        </div>
    )
}