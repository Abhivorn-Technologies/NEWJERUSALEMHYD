import { redirect } from 'next/navigation';

export default function WhatWeBelievesRedirectPage() {
  redirect('/about#what-we-believe');
}
