'use client'
import StartupFundability from "@/app/components/dashboard/StartupFundability";
import { useParams } from "next/navigation";


export default function Page() {
  const { id } = useParams() as { id: string }; // Extract the dynamic ID from the route and assert it as a string
  
  return (
    <div>
      <StartupFundability id={id} />
    </div>
  );
}