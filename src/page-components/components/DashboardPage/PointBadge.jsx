import useUser from "@/hook/useUser";


function PointBadge({userId}) {
    return (
        <div className="col-span-3 md:col-span-1 shadow-sm">
            <div className="overflow-hidden rounded-md bg-white p-6 shadow-lg">
                <div className="flex items-center md:flex-col xl:flex-row">
                    <span className="my-1 grow rounded-md">
                    <div className="text-sm font-medium leading-5 text-gray-500">
                        Your Points:
                        <p className="inline text-lg leading-5 text-sky-400"> {useUser(userId).user.points}</p>
                    </div>
                    </span>
                    <span className="my-1 inline-flex grow flex-row-reverse rounded-md">
                    <button className="inline-flex items-center rounded-md bg-sky-100 px-3 py-2 text-sm font-medium leading-4 text-sky-500 hover:bg-sky-200 focus:outline-none">
                        Gain more points!
                    </button>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PointBadge
