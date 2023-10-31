import { redirect } from "next/navigation";
import { Dashboard } from "#dashboard";

const Page = async () => {
  if (process.env.NODE_ENV === "development") {
    return (
      <div>
        <Dashboard />
      </div>
    );
  } else {
    redirect("/");
  }
};

export default Page;
