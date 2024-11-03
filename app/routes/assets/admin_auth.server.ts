import { redirect } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";

const cookieSessionStorage = createCookieSessionStorage({
    cookie: {
        secure: process.env.NODE_ENV === "production",
        //一旦直で
        secrets: ["kRyDcxor1dQgCXM4b4wtCeIoRi7dveedI/ZDUOwT96A="],
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
    },
});

export async function createUserSession(userId: string, redirectPath: string) {
    const session = await cookieSessionStorage.getSession();
    session.set("usrId", userId);
    session.set("role", "admin");
    return redirect(redirectPath, {
        headers: {
            "Set-Cookie": await cookieSessionStorage.commitSession(session),
        },
    });
}


export async function requireUserSession(request: Request) {
    const data  = await getUserFromSession(request);
    

    if (!data) {
        throw redirect("/admin_login");
    }

    return data;
}
export async function getUserFromSession(request: Request) {
    const session = await cookieSessionStorage.getSession(
        request.headers.get("Cookie")
    );

    const usrId: string = session.get("usrId");

    if (!usrId) {
        return null;
    }

    return {usrId};
}