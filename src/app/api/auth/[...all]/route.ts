// auth.ts的启动器

import { auth } from "@/lib/auth-server/auth";      //auth文件路径

import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);



