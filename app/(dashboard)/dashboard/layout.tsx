import DashboardLayout from "@/app/components/layouts/dashboardLayout";

export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
