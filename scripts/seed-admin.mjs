import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminEmail = process.env.FENNBY_ADMIN_EMAIL ?? "admin-demo@fennby.test";
const adminPassword = process.env.FENNBY_ADMIN_PASSWORD ?? "Fennby123!";
const adminName = process.env.FENNBY_ADMIN_NAME ?? "Fennby Admin Demo";

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run this with production Supabase env loaded.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  let page = 1;

  while (true) {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=1000`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Auth user list failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const users = data.users ?? [];
    const user = users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (users.length < 1000) return null;
    page += 1;
  }
}

async function createAuthUser() {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: adminName, role: "admin" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Auth user create failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function updateAuthUser(userId) {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: "PUT",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: adminName, role: "admin" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Auth user update failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function main() {
  const existing = await findUserByEmail(adminEmail);
  const authUser = existing ? await updateAuthUser(existing.id) : await createAuthUser();
  const userId = authUser.id;
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    role: "admin",
    full_name: adminName,
    email: adminEmail,
    status: "active",
    subscription_status: "active",
    updated_at: new Date().toISOString(),
  });

  if (profileError) throw profileError;

  console.log(`Admin ready: ${adminEmail}`);
  console.log("Temporary password is set from FENNBY_ADMIN_PASSWORD, or Fennby123! if not provided.");
}

main().catch((error) => {
  console.error("Admin seed failed:");
  console.error(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  process.exit(1);
});
