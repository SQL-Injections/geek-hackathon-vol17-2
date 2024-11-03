
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useFetcher } from '@remix-run/react'
import styles from '~/styles/login_students.module.css'
import { idToClassSeats } from '~/routes/assets/class_dat'
import { useState, useEffect } from 'react'
import { login } from "./assets/student_login"

export const meta: MetaFunction = () => {
    return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export async function action({ request }: any) {
    const formData = await request.formData();
    const credentials = {
        usr_id: formData.get("usr_id")?.toString(),
        class_id: formData.get("class_id")?.toString(),
        usr_name: formData.get("usr_name")?.toString(),
    };
    try {
        return await login(credentials);
    } catch (error: any) {
        if (error.status === 401) {
            return { credentials: error.message };
        }
        if (error.status === 422) {
            return { credentials: error.message };
        }
    }
}

export default function Index() {
    const [usrId, setUsrId] = useState<number>()
    const [usrName, setUsrName] = useState('')
    const [classId, setClassId] = useState<string>('')
    const [isInputted, setIsInputted] = useState(false)
    const fetcher = useFetcher()

    function clickedLogin() {
        // 一応確認
        // 二つ目のコンテナを表示する
        fetcher.load("/class_dat?class_id=" + classId)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault() // すぐに送信せず待機
    }

    useEffect(() => {
        // fetcherのレスポンスをチェック
        console.log("fetcher.data", fetcher.data)
        if (fetcher.data) {
            if (fetcher.data) {
                setIsInputted(true)
                
            }
        }
    }, [fetcher.data])
    return (
        <>
            <Form method="post">
                <div className={styles.container} style={{height: "250px"}}>
                    <div className={styles.container_title}>class idを入力してください</div>
                    <input type="text" name="class_id" placeholder="class id" onChange={(e) => setClassId(e.target.value)} className={styles.userinput} disabled={isInputted} style={{top: "47%"}} />
                    <button type="button" className={styles.loginbutton} style={{top: "75%"}} disabled={isInputted} onClick={clickedLogin}>確認</button>
                </div>
                {isInputted && (
                    <>
                        <input type="hidden" name="class_id" value={classId} />
                        <div className={`${styles.container_invisible}  ${isInputted ? styles.container_visible : ""}`} style={{height: "250px"}}>
                            <div className={styles.container_title}>user idとusernameを入力してください</div>
                            <input type="text" name="usr_id" placeholder="id" defaultValue={usrId} onChange={(e) => setUsrId(parseInt(e.target.value))} className={styles.userinput} style={{left: "30%", width: "10%"}} />
                            <input type="text" name="usr_name" placeholder="表示名" onChange={(e) => setUsrName(e.target.value)} className={styles.userinput} style={{left: "56%", width: "38%"}} />
                            <button type="submit" className={styles.loginbutton} style={{top: "75%"}}>ログイン</button>
                        </div>
                    </>
                    )
                }
            </Form>
        </>
    )
}
