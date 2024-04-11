import { editItemLayout } from "@/page-components/layouts";
import EditItem from "@/page-components/components/editItemForm/editItemForm";
import { useRouter } from "next/router";

const EditItemIndex = () => {
  const router = useRouter();
  const { id } = router.query;
  return <EditItem id={id} />;
};

EditItemIndex.Layout = editItemLayout;

export default EditItemIndex;
