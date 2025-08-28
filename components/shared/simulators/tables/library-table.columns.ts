import type { ColumnDef } from "@tanstack/vue-table";
import type { ISimulator } from "~/types/simulators";
import type { TArray } from "~/types/globals/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import SimulatorActions from "~/components/shared/simulators/menus/SimulatorActions.vue";

export const columns: TArray<ColumnDef<ISimulator>> = [
  {
    id: "picture",
    cell: ({ row }) => {
      const url = row.getValue("picture");
      const fallback = h(AvatarFallback, row.original.title.substring(0, 2));

      if (url) {
        const image = h(AvatarImage, { src: url as string });
        return h(Avatar, { class: "size-10" }, [image, fallback]);
      }

      return h(Avatar, { class: "size-10" }, [fallback]);
    },
  },
  {
    id: "infos",
    header: () => h("div", "Informations"),
    cell: ({ row }) => {
      const title = h("p", { class: "font-semibold truncate" }, row.original.title);
      const description = h("span", { class: "text-sm text-muted-foreground truncate" }, row.original.description || "-");

      return h("div", { class: "grid" }, [title, description]);
    },
  },
  {
    accessorKey: "duration",
    header: () => h("div", "Durée"),
    cell: ({ row }) => h("div", `${row.getValue("duration")} min.`),
  },
  {
    id: "evaluations",
    header: () => h("div", "Evaluations"),
    cell: ({ row }) => h("div", { class: "text-center" }, row.original.evaluations?.length || "-"),
  },
  {
    id: "prepQuestions",
    header: () => h("div", "Questions"),
    cell: ({ row }) => h("div", { class: "text-center" }, row.original.prepQuestions?.length || "-"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => h("div", { class: "flex justify-end" }, h(SimulatorActions, { simulator: row.original })),
  },
];
