import { TopBrandStatus } from "./TopBrandStatus";
import TopStats from "./TopStats";
import UserOverview from "./UserOverview";
import { UserTable } from "./UserTable";

const DashboardContainer = () => {
  return (
    <section className="space-y-6">
      <TopStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UserOverview />
        <TopBrandStatus />
      </div>

      <UserTable />
    </section>
  );
};

export default DashboardContainer;
