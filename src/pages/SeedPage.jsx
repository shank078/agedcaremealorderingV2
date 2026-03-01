import { useEffect } from "react";
import { seedMenus } from "../services/seedMenus";
import { seedResidents } from "../services/seedResidents";

<button onClick={seedResidents}>
  Seed 50 Residents
</button>

export default function SeedPage() {
  useEffect(() => {
    async function runSeed() {
      await seedResidents();
      await seedMenus();
      console.log("✅ Seeding complete");
    }

    runSeed();
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Seeding Database...</h2>
      <p>Check Firebase Console after a few seconds.</p>
    </div>
  );
}