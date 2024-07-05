import useUser from "@/hook/useUser";

function DashboardHeading({ userId }) {
  return (
    <div className="col-span-3 md:col-span-2">
      <div>
        <div className="text-heading1-bold font-bold text-sky-500 ">
          {`Welcome back, ${useUser(userId).user.firstName}!`}

          {console.log(userId)}
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
