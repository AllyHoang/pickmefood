import ResetPasswordForm from "@/page-components/components/ResetPasswordForm/ResetPasswordForm";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const router = useRouter();
  const { id } = router.query;
  return <ResetPasswordForm id={id} />;
};

export default ResetPassword;
