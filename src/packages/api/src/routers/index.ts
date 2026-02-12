import type { RouterClient } from "@orpc/server";

import { protectedProcedure } from "../index";
import { addConnection } from "../modules/connection/add-connection";
import { listConnections } from "../modules/connection/list-connections";
import { getConnectionById } from "../modules/connection/get-connection";
import { updateConnection } from "../modules/connection/update-connection";
import { deleteConnection } from "../modules/connection/remove-connection";

export const appRouter = {
  connection: protectedProcedure.prefix('/connection').router({
    insert: addConnection,
    list: listConnections,
    get: getConnectionById,
    update: updateConnection,
    remove: deleteConnection
  })
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
