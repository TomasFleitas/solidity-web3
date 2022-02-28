import { Navigate, Outlet } from "react-router-dom";
import { useContract } from "../../providers/contractProvider";

const Security = ({ direction }: { direction: "forward" | "backward" }) => {
  const { active } = useContract();
  /*   return (active && <Outlet />) || <Navigate to="/login" />; */

  return direction === "forward" ? (
    active ? (
      <Outlet />
    ) : (
      <Navigate to="/login" />
    )
  ) : direction === "backward" ? (
    active ? (
      <Navigate to="/" />
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/login" />
  );
};

export default Security;
