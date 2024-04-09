import { ActiveRequestLayout } from "@/page-components/layouts";
import RequestList from "@/page-components/components/RequestList/RequestList";

const ActiveRequestIndex = () => {
  return <RequestList />;
};

ActiveRequestIndex.Layout = ActiveRequestLayout;

export default ActiveRequestIndex;
