import { Suspense } from "react";
import { fetchData } from "../../lib/data";
import { CollectivesTable } from "../../components/CollectivesTable";

// This table is dynamically rendered but can be statically generated
export default async function CollectivesList() {
  const hosts = await fetchData();

  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <CollectivesTable data={hosts} />
    </Suspense>
  );
}
