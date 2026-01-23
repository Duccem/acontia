import { polarClient } from "@polar-sh/better-auth";
import { emailOTPClient, lastLoginMethodClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [polarClient(), lastLoginMethodClient(), organizationClient(), emailOTPClient()],
});
