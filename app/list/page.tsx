import { Suspense } from "react";
import { fetchData } from "../lib/data";
import { CollectivesTable, Collective } from "../components/CollectivesTable";

// This table is dynamically rendered but can be statically generated
export default async function CollectivesList() {
  const collectives = (await fetchData()) as Collective[];

  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <CollectivesTable data={collectives} />
    </Suspense>
  );
}
