import { useForm } from "react-hook-form";

export default function CommitementForm() {

    const { register, handleSubmit, formState: { errors } } = useForm();
   
    function onSubmit(data: any) {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="First Name" {...register("firstname")} />
            <input type="submit" />
        </form>
    )
}