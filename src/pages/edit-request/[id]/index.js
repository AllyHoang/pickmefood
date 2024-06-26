import EditRequestForm from "@/page-components/components/EditRequestForm/EditRequestForm";
import { EditRequestLayout } from "@/page-components/layouts";
import { useRouter } from "next/router";

const EditRequestIndex = () => {
  const router = useRouter();
  const { id } = router.query;
  return <EditRequestForm id={id} />;
};

EditRequestIndex.Layout = EditRequestLayout;
export default EditRequestIndex;