
import { useStateContext } from "../miscallenious/contextprovider";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    const {isLoggedIn} = useStateContext();

    if(isLoggedIn){
      return <Navigate to="/dashboard"/>
    }

  return (
   <div>
    <Outlet/>
   </div>
  );
}