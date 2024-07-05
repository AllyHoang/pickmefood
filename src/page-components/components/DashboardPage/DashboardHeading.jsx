import useUser from "@/hook/useUser";
import { useSelector } from "react-redux";


function DashboardHeading({ userId }) {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="col-span-3 md:col-span-2">
      <div>
        <div className="text-heading1-bold font-bold text-sky-500 ">
          {`Welcome back, ${currentUser.username}!`}
        </div>
        <h1 className="flex-auto pt-3 text-base text-gray-500">
          {" "}
          Check out your top matches donation and requests below
        </h1>
      </div>
    </div>
  );
}

export default DashboardHeading;
