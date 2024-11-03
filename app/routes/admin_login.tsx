//　管理者ログイン画面
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useFetcher } from '@remix-run/react'

import styles from '~/styles/admin_login.module.css'
import { login } from './assets/admin_login'
import { useActionData } from '@remix-run/react'

import { useState, useEffect, useId } from 'react'

export const meta: MetaFunction = () => {
    return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}
export async function action({ request }: any) {
    const formData = await request.formData()
    const credentials = {
        usr_id: formData.get('usr_id')?.toString(),
        password: formData.get('password')?.toString(),
    }
    try {
        return await login(credentials)
    } catch (error: any) {
        if (error.status === 401) {
            console.log('userいないよ')
            return { error: error.message }
        }
        if (error.status === 422) {
            return { credentials: error.message }
        }
    }
}

export default function Index() {
    const actionData = useActionData()
    const [usrId, setUsrId] = useState<string>()
    const [password, setPassword] = useState<string>()
    const fetcher = useFetcher()

    const [isVisible, setIsVisible] = useState(false)

    return (
        <>
            <Form method='post'>
                <div className={styles.container} style={{ height: '250px' }}>
                    <div className={styles.container_title}>管理者用idを入力してください</div>
                    <input
                        type='text'
                        name='usr_id'
                        placeholder='admin id'
                        onChange={(e) => setUsrId(e.target.value.toString())}
                        className={styles.userinput}
                    />
                    <div className={styles.container_title}>パスワードを入力してください</div>
                    <input
                        type='password'
                        name='password'
                        placeholder='password'
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.userinput}
                    />
                    <div className={styles.flex_btn}>
                        <button type='submit' className={styles.loginbutton}>
                            ログイン
                        </button>
                        <button type='button' className={styles.loginbutton}>
                            <a href={`/admin_register`}>新規登録</a>
                        </button>
                    </div>
                </div>
            </Form>

            {actionData?.error && (
                <div className={styles.error_container}>
                    <p className={styles.error_mes}>{actionData.error}</p>
                </div>
            )}
        </>
    )
}
