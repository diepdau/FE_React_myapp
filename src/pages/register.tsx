import { object, string, TypeOf } from "zod";
import { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../components/InputField";
import { LoadingButton } from "../components/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store";
import { RegisterUserFn } from "../api/authApi";
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
const RegisterUserSchema = object({
    username:string().nonempty({ message: "Please enter a username" }),
    email: 
      string()
      .min(1, { message: "Please enter an email address" })
      .email({ message: "Please enter a valid email address" }),
    password: string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, { message: 'Password must contain at least one special character' })  
      .nonempty({ message: "Please enter a password" }),
    confirmPassword: string()
    .min(8, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterInput = TypeOf<typeof RegisterUserSchema>;

const Register = () => {
  const navigate = useNavigate();
  const methods = useForm<RegisterInput>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const store = useStore();

  const mutation = useMutation({
    mutationFn: RegisterUserFn,
    onMutate(variables) {
      store.setRequestLoading(true);
    },
    onSuccess: (data) => {
      store.setRequestLoading(false);
      toast.success("Registration successful");
      console.log("Registration successful:", data);
      navigate("/login"); 
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      console.error("Registration failed:", error?.response);
      if(!error.response)toast.error("Registration failed. Please try again.");
      else{
        var err = error.response?.data;
        for(let i=0;i<err.length ;i++){  
          toast.error(err[i].description)}
      }
    },
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
   useEffect(() => {
     if (isSubmitSuccessful) {
       reset();
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isSubmitSuccessful]);
 
   const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
     mutation.mutate(values);
   };
 

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="form bg-transparent p-10 rounded-[20px] shadow-lg inset-shadow-2xs w-[450px] max-w-full">
          <h1 className="text-4xl font-extrabold flex items-center justify-center my-6 tracking-tight text-foreground">Register</h1>
          <InputField label="Name" name="username"  placeholder="Example"/>    
          <InputField label="Email" name="email" type="email" placeholder="Example@gmail.com"/>
          <InputField label="Password" name="password" type="password" placeholder="Example123@"/>
          <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="Example123@"/>
          <span className="block"> Already have an account?{" "}
            <Link to="/" className="hover:text-orange-600" >
              Login Here
            </Link>
          </span>
          <LoadingButton  loading={store.requestLoading}  >
            Sign Up
          </LoadingButton>
        </form>
      </FormProvider>

    </div>
  );
};

export default Register;
