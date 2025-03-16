// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $account_settings from "./routes/account_settings.tsx";
import * as $api_create_project from "./routes/api/create_project.ts";
import * as $api_create_user from "./routes/api/create_user.ts";
import * as $api_login from "./routes/api/login.ts";
import * as $api_send_debug_log from "./routes/api/send_debug_log.ts";
import * as $create from "./routes/create.tsx";
import * as $index from "./routes/index.tsx";
import * as $login from "./routes/login.tsx";
import * as $sign_up from "./routes/sign_up.tsx";
import * as $AccountSettingsPage from "./islands/AccountSettingsPage.tsx";
import * as $CreatePage from "./islands/CreatePage.tsx";
import * as $LoginPage from "./islands/LoginPage.tsx";
import * as $SignUpPage from "./islands/SignUpPage.tsx";
import * as $TopNavUser from "./islands/TopNavUser.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/account_settings.tsx": $account_settings,
    "./routes/api/create_project.ts": $api_create_project,
    "./routes/api/create_user.ts": $api_create_user,
    "./routes/api/login.ts": $api_login,
    "./routes/api/send_debug_log.ts": $api_send_debug_log,
    "./routes/create.tsx": $create,
    "./routes/index.tsx": $index,
    "./routes/login.tsx": $login,
    "./routes/sign_up.tsx": $sign_up,
  },
  islands: {
    "./islands/AccountSettingsPage.tsx": $AccountSettingsPage,
    "./islands/CreatePage.tsx": $CreatePage,
    "./islands/LoginPage.tsx": $LoginPage,
    "./islands/SignUpPage.tsx": $SignUpPage,
    "./islands/TopNavUser.tsx": $TopNavUser,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
