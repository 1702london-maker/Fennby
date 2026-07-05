import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Route-prefix -> allowed roles. This is the fast-fail UX guard;
// RLS is the real security boundary (see docs/architecture/02-auth-architecture.md).
const ROLE_ROUTES: { prefix: string; roles: string[] }[] = [
  { prefix: "/child", roles: ["child"] },
  { prefix: "/parent", roles: ["parent"] },
  { prefix: "/tutor", roles: ["tutor"] },
  { prefix: "/school", roles: ["school_admin", "teacher"] },
  { prefix: "/teacher", roles: ["teacher"] },
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/safeguarding", roles: ["safeguarding", "admin"] },
  { prefix: "/authority", roles: ["authority"] },
];

const roleHome: Record<string, string> = {
  child: "/child/today",
  parent: "/parent",
  tutor: "/tutor",
  school_admin: "/school",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard",
  safeguarding: "/safeguarding/dashboard",
  authority: "/authority/dashboard",
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const match = ROLE_ROUTES.find((r) => request.nextUrl.pathname.startsWith(r.prefix));
  if (!match) return response;

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "active") {
    await supabase.auth.signOut();
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!match.roles.includes(profile.role)) {
    const home = roleHome[profile.role] ?? "/";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/child/:path*",
    "/parent/:path*",
    "/tutor/:path*",
    "/school/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/safeguarding/:path*",
    "/authority/:path*",
  ],
};
