import { db } from "@acontia/db";
import * as schema from "@acontia/db/schema/auth";
import { env } from "@acontia/env/server";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { polarClient, products } from "./lib/payments";
import { bearer, emailOTP, lastLoginMethod, openAPI, organization } from "better-auth/plugins";
import { ac, roles } from "./lib/roles";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
    },
  },
  advanced: {
    database: {
      generateId: false,
    }
  },
  plugins: [
    organization({
      ac,
      roles,
      creatorRole: 'admin',
      sendInvitationEmail: async ({ email, invitation }) => console.log(`Invitation with id: ${invitation.id} sended to: ${email}`),
      organizationHooks: {
        afterAcceptInvitation: async ({ user, organization }) => console.log(`Sended welcome to org: ${organization.name} to user: ${user.email}`),
        afterCreateOrganization: async ({ organization, user }) => console.log(`Sended welcome to ${user.email} for create org ${organization.name}`)
      }
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      enableCustomerPortal: true,
      use: [
        usage(),
        checkout({
          products,
          successUrl: env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
          theme: 'dark',
          redirect: true,
          returnUrl: `${env.BETTER_AUTH_URL}/subscription`
        }),
        portal({ returnUrl: `${env.BETTER_AUTH_URL}/subscription` }),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET ?? '',
          onPayload: async ({ data, type }) => console.log(`Event ${data.id} of type ${type}`),
        }),
      ],
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      sendVerificationOnSignUp: true,
      allowedAttempts: 5,
      sendVerificationOTP: async ({ email, otp, type }) => console.log(`Sended to ${email} the code ${otp} for operation ${type}`)
    }),
    nextCookies(),
    lastLoginMethod(),
    bearer(),
    openAPI()
  ],
});


export type BetterSession = typeof auth.$Infer.Session;
export type BetterUser = typeof auth.$Infer.Session.user;
export type BetterOrganization = typeof auth.$Infer.Organization;