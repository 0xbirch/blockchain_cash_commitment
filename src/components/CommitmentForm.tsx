import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormControl, Input, FormLabel, FormErrorMessage, Button } from "@chakra-ui/react";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default function CommitementForm() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [startDate, setStartDate] = useState(new Date())

    function onSubmit(data: any) {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="goal" color="white">What is your goal?</FormLabel>
                <Input
                    color="white"
                    id="goal"
                    placeholder="Goal"
                    {...register("goal", {
                        required: "This is required",
                        minLength: { value: 2, message: "Minimum length should be 2" }
                    })}
                />
                <FormLabel htmlFor="timeframe" color="white">When do you want to accomplish your goal by?</FormLabel>
               <DatePicker selected={startDate} onChange={(date: any) => setStartDate(date)}/> 
                <Input
                    color="white"
                    id="timeframe"
                    placeholder="Timeframe"
                    {...register("timeframe", {
                        required: "This is required",
                        minLength: { value: 2, message: "Minimum length should be 4" }
                    })}
                />
                <FormErrorMessage>
                    {errors.name && errors.name.message}
                </FormErrorMessage>
            </FormControl>
            <Button mt={4} colorScheme="teal" type="submit">
                Submit
            </Button>
            {/* <input type="text" placeholder="Committment" {...register("committment")} />
            <input type="text" placeholder="Where should your money go?" {...register("destination")} />
            <input type="text" placeholder="How often will you report?" {...register("reportFrequency")} />
            <input type="text" placeholder="How much?" {...register("amountCommitted")} />
            <input type="text" placeholder="How long with your commitment last?" {...register("lengthOfCommitment")} />
            <input type="submit" /> */}
        </form>
    )
}