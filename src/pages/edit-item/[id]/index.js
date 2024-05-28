import { EditItemLayout } from "@/page-components/layouts";
import EditItem from "@/page-components/components/EditItemForm/EditItemForm";
import { useRouter } from "next/router";

const EditItemIndex = () => {
  const router = useRouter();
  const { id } = router.query;
  return <EditItem id={id} />;
};

EditItemIndex.Layout = EditItemLayout;

export default EditItemIndex;
