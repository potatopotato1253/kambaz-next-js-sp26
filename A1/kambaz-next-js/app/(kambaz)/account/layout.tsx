"use client";

import { ReactNode } from "react";
import AccountNavigation from "./Navigation";
import Session from "./Session";
import { Provider } from "react-redux";
import store from "../store";

export default function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div id="wd-kambaz">
          <table>
            <tbody>
              <tr>
                <td valign="top">
                  <AccountNavigation />
                </td>
                <td valign="top" width="100%" className="wd-account-content">
                  {children}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Session>
    </Provider>
  );
}
