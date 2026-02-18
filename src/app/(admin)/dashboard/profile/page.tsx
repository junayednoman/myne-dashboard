import AContainer from "@/components/AContainer";
import { Metadata } from "next";
import ProfileContainer from "./ProfileContainer";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfilePage = () => {
  return (
    <main>
      <AContainer>
        <ProfileContainer />
      </AContainer>
    </main>
  );
};

export default ProfilePage;
