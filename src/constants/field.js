import { format } from "date-fns";

export const FIELDS = [
  {
    label: "Title",
    name: "title",
    required: true,
    type: "TEXT",
  },
  {
    label: "Description",
    name: "description",
    required: false,
    type: "LONG_TEXT",
  },
  {
    label: "Due date",
    name: "dueDate",
    required: true,
    type: "DATE",
    minDate: format(new Date(), "yyyy-MM-dd"),
  },
];
