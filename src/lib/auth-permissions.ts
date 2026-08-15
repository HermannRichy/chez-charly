import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  user: ["list", "set-role", "ban", "delete", "get", "update"],
} as const;

export const ac = createAccessControl(statement);

export const STAFF = ac.newRole({
  user: ["list", "set-role", "ban", "delete", "get", "update"],
});

export const CLIENT = ac.newRole({
  user: [],
});
