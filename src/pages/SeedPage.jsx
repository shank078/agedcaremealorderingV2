import { useEffect } from "react";
import { seedMenus } from "../services/seedMenus";
import { seedResidents } from "../services/seedResidents";

export default function SeedPage() {

  useEffect(() => {
    // Only allow seeding in development mode
    if (import.meta.env.DEV) {
      async function runSeed() {
        await seedResidents();
        await seedMenus();
        console.log("✅ Seeding complete");
      }

      runSeed();
    } else {
      console.warn("⛔ Seeding blocked in production");
    }
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Seeding Database...</h2>
      <p>Check console for status.</p>
    </div>
  );
}