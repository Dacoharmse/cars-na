import { redirect } from 'next/navigation';

export default function VehicleListingsRedirect() {
  redirect('/admin?tab=sell-your-car');
}
