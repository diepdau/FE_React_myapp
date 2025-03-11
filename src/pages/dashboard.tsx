
import { useMutation } from "@tanstack/react-query";
import useStore from "../store";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUserFn } from "../api/authApi";

const Dashboard = () => {
  const store = useStore();
  const authUser = store.authUser;
  const token = store.token;
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () => logoutUserFn(token),
    onMutate(variables) {
      store.setRequestLoading(true);
    },
    onSuccess: () => {
      store.setRequestLoading(false);
      store.logoutUser(); 
      toast.success("Logout successful");
      console.log("Logout successful");
      navigate("/login"); 
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      toast.error(error.response?.data?.title || "Logout failed. Please try again.");
      console.error("Logout failed:", error);
    },
  });
  const handleSubmit =()=>{
    mutation.mutate();
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
        <strong className="text-2xl text-blue-400">HELLO</strong>
        {authUser ? (
          <div className="mt-6 space-y-4 text-lg text-gray-700 text-left">
            <p>
              <strong className="text-blue-400">UserName:</strong> {authUser.username}
            </p>
            <p>
              <strong className="text-blue-400">Email:</strong> {authUser.email}
            </p>
            <p>
              <strong className="text-blue-400">Role:</strong> {authUser.roles}
            </p>
            <button className="underline hover:text-orange-600" onClick={handleSubmit}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <p className="mt-6 text-red-500 text-lg font-semibold">
              User not found. Please login.
            </p>
            <Link to="/" className="hover:text-orange-600" >
                Login Here
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
