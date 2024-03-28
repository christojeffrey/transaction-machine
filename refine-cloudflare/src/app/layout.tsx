import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { authProvider } from "@providers/auth-provider";
import { dataProvider, liveProvider } from "@providers/data-provider";
import "@refinedev/antd/dist/reset.css";

export const metadata: Metadata = {
  title: "Transaction Machine",
  description: "IOT Transaction Machine",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineKbarProvider>
            <AntdRegistry>
              <ColorModeContextProvider defaultMode={defaultMode}>
                <Refine
                  routerProvider={routerProvider}
                  dataProvider={dataProvider}
                  liveProvider={liveProvider}
                  authProvider={authProvider}
                  notificationProvider={useNotificationProvider}
                  resources={[
                    {
                      name: "660270358d5a10efebf5", // resource ID
                      list: "/accounts",
                      create: "/accounts/create",
                      edit: "/accounts/edit/:id",
                      meta: {
                        canDelete: true,
                        label: "Accounts", // https://refine.dev/docs/core/refine-component/#label
                      },
                    },
                    {
                      name: "6602717c258ab09ec073", // resource ID
                      list: "/transactions",
                      meta: {
                        canDelete: true,
                        label: "Transactions", // https://refine.dev/docs/core/refine-component/#label
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    projectId: "SCNPhj-cQ41OW-W39tR8",
                    liveMode: "auto",
                  }}
                >
                  {children}
                  <RefineKbar />
                </Refine>
              </ColorModeContextProvider>
            </AntdRegistry>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
