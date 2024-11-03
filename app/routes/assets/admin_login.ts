import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { isValidUsr } from "./admin_dat";
import { createUserSession } from "./admin_auth.server";

export async function login({
    usr_id,
    password
}: {
    usr_id: string;
    password: string;
}) {
    const UserObj = { id: usr_id, password: password };
    console.log(UserObj);
    const existingUser = await isValidUsr(UserObj);
    if (!existingUser) {
        const error: any = new Error(
            "管理者用idかパスワードが間違っています"
        );
        error.status = 401;
        throw error;
    }

    return createUserSession(usr_id, "/management_classes");
}

