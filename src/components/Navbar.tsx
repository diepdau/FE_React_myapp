import AvataAdmin from "../asset/avataAdmin.png";
import IconNo from "../asset/IconNotification.png";
import useStore from "../store/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuthUser, logoutUserFn } from "../api/users";
import { useEffect } from "react";
const Navbar = () => {
  const { authUser, token, logoutUser, setAuthUser, setRequestLoading } =
    useStore();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () => logoutUserFn(),
    onMutate() {
      setRequestLoading(true);
    },
    onSuccess: () => {
      setRequestLoading(false);
      logoutUser();
      toast.success("Logout successful");
      navigate("/");
    },
    onError: (error: any) => {
      setRequestLoading(false);
      toast.error(
        error.response?.data?.title || "Logout failed. Please try again."
      );
      console.error("Logout failed:", error);
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  useEffect(() => {
    if (token && !authUser) {
      getAuthUser()
        .then((user) => {
          setAuthUser(user, token);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [token, authUser, setAuthUser]);

  if (!authUser) {
    return <div>Please log in</div>;
  }
  return (
    <div className="flex items-center justify-end p-4">
      <div className="flex items-center gap-4 w-auto p-2 bg-[#262626] rounded-full">
        <div
          onClick={handleSubmit}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative"
        >
          <img src={IconNo} alt="" width={18} height={18} />
          <div className="absolute -top-[0px] -right-[0px] w-2 h-2 bg-[#EB5757] rounded-full"></div>
        </div>
        <div className="flex items-center cursor-pointer gap-2 ">
          <img
            src={AvataAdmin}
            alt=""
            width={31}
            height={32}
            className="rounded-full"
          />
          <div className="flex flex-col text-left">
            <span className="text-[12px] leading-3  text-white">
              {authUser?.username}
            </span>
            <span className="text-[12px] text-[#CBCBCB]">
              {authUser?.roles}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
