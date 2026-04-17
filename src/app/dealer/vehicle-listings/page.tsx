import { redirect } from 'next/navigation';

export default function VehicleListingsRedirect() {
  redirect('/dealer/dashboard');
}
