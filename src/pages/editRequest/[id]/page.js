import EditRequestForm from "@/page-components/components/editRequestForm/editRequestForm";
import editRequestLayout from "@/page-components/layouts/editRequestLayout";
import { useRouter } from "next/router";


const EditRequestIndex = () => {
  const router = useRouter();
  const { id } = router.query;
  return <EditRequestForm id={id} />;
};

EditRequestIndex.Layout = editRequestLayout;

export default EditRequestIndex;
