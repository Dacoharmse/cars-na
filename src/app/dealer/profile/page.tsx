import { redirect } from 'next/navigation';

export default function ProfilePage() {
  redirect('/dealer/dashboard?tab=sales-profile');
}
