//　管理者新規登録画面
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import styles from "~/styles/admin_login.module.css";

import { useState, useEffect } from "react";
import { style } from "framer-motion/client";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export default function Index() {
    const [usrId, setUsrId] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [classId, setClassId] = useState<string>();
    const fetcher = useFetcher();

    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        // fetcherのレスポンスをチェック
        if (fetcher.data) {
            console.log("Fetcher data:", fetcher.data);

            // バリデーションが成功した場合のみフォーム送信
            if (fetcher.data.pushUsr) {
                console.log("バリデーション成功: ユーザーが存在します");
                window.location.href = "/admin_login"
            } else {
                console.log("バリデーション失敗: ユーザーが存在しません");
                setIsVisible(true);
            }
        }
    }, [fetcher.data]);

    if(fetcher.state=="submitting"){
        console.log(fetcher.data);
    }
    return(
        <>
            <fetcher.Form method="post" action="/admin_dat">
                <div className={styles.container} style={{height: "250px"}}>
                    <div className={styles.container_title}>管理者用idを入力してください</div>
                    <input type="text" name="usr_id" placeholder="admin id" onChange={(e) => setUsrId(e.target.value)} className={styles.userinput} />
                    <div className={styles.container_title}>パスワードを入力してください</div>
                    <input type="password" name="password" minLength={8} placeholder="password" onChange={(e) => setPassword(e.target.value)} className={styles.userinput} />
                    <input type="hidden" name="function" value="pushUsr" />
                    <div className={styles.flex_btn}>
                        <button type="submit" className={styles.loginbutton} style={{top: "75%"}}>新規登録</button>
                    </div>
                </div>
                
                {isVisible && <div className={styles.error_container}>
                    <div>
                    <p className={styles.error_mes}>該当のユーザidは既に利用されています</p>
                    </div>
                </div>}
            </fetcher.Form>
        </>
    );
}