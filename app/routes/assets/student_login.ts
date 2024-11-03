import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { isValidUsr } from "./student_dat";
import { createUserSession } from "./student_auth.server";


export async function login({
    class_id,
    usr_id,
    usr_name
}: {
    class_id: string;
    usr_id: string;
    usr_name: string;
}) {
    const existingUser = await isValidUsr(usr_id, class_id);
    console.log("bool:",existingUser);
    if (!existingUser) {
        const error: any = new Error(
            "id又はpasswordに誤りがあります。"
        );
        error.status = 401;
        throw error;
    }

    return createUserSession(usr_id, class_id, usr_name, "/write_my_seats");
}

