import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
     async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  console.log("DEBUG adminEmail:", JSON.stringify(adminEmail));
  console.log("DEBUG adminPasswordHash:", JSON.stringify(adminPasswordHash));
  console.log("DEBUG submitted email:", JSON.stringify(credentials.email));
  console.log("DEBUG submitted password:", JSON.stringify(credentials.password));

  if (!adminEmail || !adminPasswordHash) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set in .env.local");
    return null;
  }

  const emailMatches = credentials.email.toLowerCase() === adminEmail.toLowerCase();
  console.log("DEBUG emailMatches:", emailMatches);

  if (!emailMatches) return null;

  const valid = await bcrypt.compare(credentials.password, adminPasswordHash);
  console.log("DEBUG password valid:", valid);

  if (!valid) return null;

  return { id: "admin", email: adminEmail, name: "Admin" };
},
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
};

