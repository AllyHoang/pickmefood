/**
 * 3 sub pages: Profile, My donations and requests, Processing donations and requests
 *
 */
import { useRouter } from "next/router";
import { TabBar } from "./TabBar";

const UserPage = ({ userId }) => {
  const router = useRouter();
  const { tab } = router.query;
  const firstName = "Giang";
  const lastName = "Pham";
  return (
    <div>
      <TabBar
        userId={userId}
        firstName={firstName}
        lastName={lastName}
      ></TabBar>
    </div>
  );
};

export default UserPage;
