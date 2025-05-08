import DashboardLayout from "@/app/components/layouts/dashboardLayout";
import 'react-quill/dist/quill.snow.css';
export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
