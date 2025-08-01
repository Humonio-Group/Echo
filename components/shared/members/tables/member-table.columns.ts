import type { ColumnDef } from "@tanstack/vue-table";
import type { IWorkspaceMember } from "~/types/workspaces";
import { Button } from "~/components/ui/button";
import { MoreVertical } from "lucide-vue-next";

export const columns: ColumnDef<IWorkspaceMember>[] = [
  {
    accessorKey: "userId",
    header: () => h("div", "User ID"),
    cell: ({ row }) => h("div", row.getValue("userId")),
  },
  {
    accessorKey: "role",
    header: () => h("div", "Role"),
    cell: ({ row }) => h("div", useNuxtApp().$i18n.t(`labels.enums.role.${row.getValue("role")}`)),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => h("div", { class: "flex justify-end" }, h(Button, { variant: "ghost", size: "icon" }, h(MoreVertical))),
  },
];
