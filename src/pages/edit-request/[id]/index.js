import EditRequestForm from "@/page-components/components/EditRequestForm/EditRequestForm";
import editRequestLayout from "@/page-components/layouts/EditRequestLayout";
import { useRouter } from "next/router";

const EditRequestIndex = () => {
  const router = useRouter();
  const { id } = router.query;
  return <EditRequestForm id={id} />;
};

EditRequestIndex.Layout = editRequestLayout;

export default EditRequestIndex;
