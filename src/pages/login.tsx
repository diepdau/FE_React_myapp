import { object, string, TypeOf } from "zod";
import { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../components/InputField";
import { LoadingButton } from "../components/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/auth";
import { loginUserFn } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import Hello from "../../src/asset/hello.png";
import { toast } from "react-toastify";
const loginSchema = object({
  email: string(),
  // .min(1, { message: "Please enter an email address" })
  // .email({ message: "Please enter a valid email address" }),
  password: string(),
  // .min(8, { message: "Password must be at least 8 characters" })
  // .regex(/[A-Z]/, {
  //   message: "Password must contain at least one uppercase letter",
  // })
  // .regex(/\d/, { message: "Password must contain at least one number" })
  // .regex(/[\W_]/, {
  //   message: "Password must contain at least one special character",
  // })
  // .nonempty({ message: "Please enter a password" }),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const store = useStore();
  const mutation = useMutation({
    mutationFn: loginUserFn,
    onMutate(variables) {
      store.setRequestLoading(true);
    },
    onSuccess: (data) => {
      store.setRequestLoading(false);
      store.setAuthUser(data.user, data.token);
      if (store.loginSuccess) {
        toast.success("Login successful");
        navigate("/dashboard");
      }
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      toast.error(error.response?.data || "Login failed. Please try again.");
      console.error("Login failed:", error);
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

  // const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
  //   mutation.mutate(values);
  // };
  const onSubmitHandler: SubmitHandler<LoginInput> = () => {
    mutation.mutate({ email: "admin@example.com", password: "Admin123@" });
    // mutation.mutate({ email: "Diep12345@mail.com", password: "Diep12345@" });
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="form bg-transparent p-10 rounded-[20px] shadow-lg inset-shadow-2xs w-[450px] max-w-full"
        >
          <img className="p-3 mx-auto mb-[12%]" src={Hello} alt="Hello" />
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Example@gmail.com"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Example123@"
          />
          <div className="text-right">
            <Link to="/login" className="">
              Forgot Password?
            </Link>
          </div>
          <LoadingButton loading={store.requestLoading}>Login</LoadingButton>
          <span className="block mt-4">
            Need an account?{" "}
            <Link to="/register" className="hover:text-orange-600">
              Sign Up Here
            </Link>
          </span>
        </form>
      </FormProvider>
    </div>
  );
};

export default Login;
