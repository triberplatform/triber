'use client'
import FundabilityForm from "@/app/components/dashboard/FundabilityForm";
import { useParams } from "next/navigation";


export default function Page() {
  const { id } = useParams() as { id: string }; // Extract the dynamic ID from the route and assert it as a string
  
  return (
    <div>
      <FundabilityForm id={id} />
    </div>
  );
}