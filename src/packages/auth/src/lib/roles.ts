import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
});

export const member = ac.newRole({
  organization: [],
  member: [],
  invitation: []
})

export const roles = {
  admin,
  member
}