import AvataAdmin from "../asset/avataAdmin.png";
import IconNo from "../asset/IconNotification.png";
import useStore from "../store";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUserFn } from "../api/users";
const Navbar = () => {
  const store = useStore();
  const authUser = store.authUser;
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () => logoutUserFn(),
    onMutate(variables) {
      store.setRequestLoading(true);
    },
    onSuccess: () => {
      store.setRequestLoading(false);
      store.logoutUser();
      toast.success("Logout successful");
      console.log("Logout successful");
      navigate("/");
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      toast.error(
        error.response?.data?.title || "Logout failed. Please try again."
      );
      console.error("Logout failed:", error);
    },
  });
  const handleSubmit = () => {
    mutation.mutate();
  };
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
