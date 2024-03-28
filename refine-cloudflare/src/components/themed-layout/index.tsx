"use client";

import { Header } from "@components/header";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import React from "react";

export const ThemedLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayoutV2
      Header={() => <Header sticky />}
      Title={({ collapsed }) => (
        <ThemedTitleV2
          // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
          collapsed={collapsed}
          text="Transaction Machine"
        />
      )}
    >
      {children}
    </ThemedLayoutV2>
  );
};
