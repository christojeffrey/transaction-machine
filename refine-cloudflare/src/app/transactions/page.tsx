"use client";

import { DeleteButton, EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function CategoryList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });
  console.log(tableProps);
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex={`account`}
          title={"NFC ID"}
          render={(value) => {
            return value ? value["nfc-id"] : "no id";
          }}
        />
        <Table.Column dataIndex="amount" title={"amount"} />
        <Table.Column dataIndex="$createdAt" title={"Created At"} />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
