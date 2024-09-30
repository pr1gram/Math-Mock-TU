// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import apiFunction from '@/components/api';

export async function POST(request: Request) {
  // Parse the incoming request
  const { email, firstname, lastname, username, tel, school } = await request.json();

  try {
    // Call the apiFunction with the provided data
    const response = await apiFunction('POST', '/authentication', {
      email,
      firstname,
      lastname,
      username,
      tel,
      school,
    });

    // Return the API response
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('API call error:', error);
    return NextResponse.json({ error: 'มีชื่อบัญชีนี้แล้ว' }, { status: 400 });
  }
}
