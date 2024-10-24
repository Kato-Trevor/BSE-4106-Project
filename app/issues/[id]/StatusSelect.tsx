"use client";

import { Issue } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const StatusEnum = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  CLOSED: "CLOSED",
};

const getStatusOptions = () => {
  return Object.values(StatusEnum);
};

const StatusSelect = ({ issue }: { issue: Issue }) => {
  const statusOptions = getStatusOptions();

  const changeStatus = (status: string) => {
    axios
      .patch("/api/issues/" + issue.id, {
        status,
      })
      .catch((error) => {
        console.log(error)
        toast.error("Changes could not be saved.");
      });
  };

  return (
    <>
      <Select.Root
        defaultValue={issue.status}
        onValueChange={changeStatus}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Select a status</Select.Label>
              {statusOptions.map((status) => (
                <Select.Item key={status} value={status}>
                  {status}
                </Select.Item>
              ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default StatusSelect;
