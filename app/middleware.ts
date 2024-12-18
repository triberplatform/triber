// import { NextResponse } from 'next/server';

// export function middleware(req:any) {
//   const protectedRoutes = ['/dashboard'];
//   const isProtected = protectedRoutes.includes(req.nextUrl.pathname);

//   if (isProtected) {
//     const loggedIn = req.cookies['auth-token']; // Replace with your authentication logic
//     if (!loggedIn) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }
//   }

//   return NextResponse.next();
// }
