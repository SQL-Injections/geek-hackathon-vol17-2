import { Box } from '@chakra-ui/react'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json, useLoaderData, Form, useFetcher } from '@remix-run/react'
import { create } from 'framer-motion/client'
import { useEffect, useState } from 'react'
import { SeatArrangement } from '~/original-components'
import Seat from '~/original-components/Seat'
import { requireUserSession } from './assets/admin_auth.server'
import styles from '~/styles/input_seats_amount.module.css'
import { Seat as SeatType } from '~/model/model'

export const meta: MetaFunction = () => {
    return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // sessionからデータを取り出す
    const data = await requireUserSession(request)
    const usrId = data.usrId

    return json({ usrId: usrId })
}

export default function Index() {
    //clientでやってほしいので
    const [seatsAmount, setSeatsAmount] = useState(1)
    const [className, setClassName] =  useState('')
    const [isInputted, setIsInputted] = useState(false)
    const [height, setHeight] = useState<number>(0)
    const [width, setWidth] = useState<number>(0)
    const [errMsg, setErrMsg] = useState('')
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [SeatsArray, setSeatsArray] = useState<Array<SeatType[]>>([])
    const fetcher = useFetcher()
    const admin = useLoaderData() as { usrId: string }
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * input seats amount and show the second container
     * @returns {void}
     */
    /******  3d251e3f-7e9e-4df8-840c-b57c63aa7efc  *******/

    const createSeatArray = (row: number, column: number) => {
        return Array.from({ length: row }, () => Array.from({ length: column }, () => true))
    }

    useEffect(() => {
        setSeatsArray(createSeatArray(height, width))
    }, [height, width])

    function clickedSeatsAmount() {
        // 一応確認
        console.log('isinputted:' + isInputted)
        // 二つ目のコンテナを表示する
        setIsInputted(true)
        //いい感じにheightとwidthの初期値を決定する
        const sqrt = Math.sqrt(seatsAmount)
        //整数に
        setHeight(Math.floor(sqrt) + 1)
        setWidth(Math.floor(sqrt))
    }

    function clickedWHAmount() {
        // 一応確認
        console.log(isInputted)
        // 二つ目のコンテナを表示する
        if(!validateInputs()){
            return
        }
        setIsConfirmed(true)
    }

    function validateInputs() {
        if (height * width < seatsAmount) {
            setErrMsg(
                `入力された${height}×${width} = ${height * width}席では要求された${seatsAmount}席を満たしません。`,
            )
            return false
        }
        setErrMsg('')
        return true
    }

    // function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    //     // フォーム送信前にバリデーションを実行
    //     if (!validateInputs()) {
    //         event.preventDefault() // バリデーションに失敗した場合、送信をブロック
    //     }
    //     // 動的にURLを設定する
    //     const form = event.currentTarget
    //     form.action = `/management_classes`
    // }

    const handleValueChange = (newValue: Array<Array<SeatType>>) => {
        console.log('newValue:', newValue)
        setSeatsArray(newValue)
    }

    function createClass(event: React.FormEvent<HTMLFormElement>) {
        //クラス情報を追加する
        //とりあえずidをランダム生成
        const id = Math.floor(Math.random() * 10000000)
        console.log('Seats:', SeatsArray)
        console.log('id:', id)
        // SeatsArrayの有効座席がSeatsAmount個なら
        if (SeatsArray.flat().filter((seat) => seat).length === seatsAmount) {
            console.log('クラス作成')
            //クラスを作成する
            const roomDat = {
                row: height,
                column: width,
                seatAmount: seatsAmount,
                isFinished: false,
                seats: SeatsArray,
            }
            fetcher.submit(
                { classId: String(id), classInfo: JSON.stringify(roomDat) },
                { method: 'post', action: `/class_dat`, encType: 'application/json' },
            )

            const formData = new FormData()
            formData.append("usr_id", admin.usrId)
            formData.append("class_id", id.toString())
            formData.append("class_name", className.toString())
            formData.append("function", "addClass")

            fetcher.submit(formData, { method: 'post', action: '/admin_dat' })

            const student_ids = []
            const id_set = [...Array(1000)].map((_, i) => i)
            for (let i = 0; i < seatsAmount; i++) {
                let rand = Math.floor(Math.random() * id_set.length)
                if (rand === id_set.length) rand = id_set.length - 1
                const value = id_set.splice(rand, 1)
                student_ids.push({ id: value.toString(), name: '' })
            }

            fetcher.submit(
                {
                    classId: id.toString(),
                    student_ids: JSON.stringify(student_ids),
                },
                { method: 'post', action: '/student_dat', encType: 'application/json' },
            )
            // event.currentTarget.action = `/management_classes`
        } else {
            console.log('有効な座席を入力してください')
            // とりあえず
            alert(
                `選択した席数${seatsAmount}に対して現在選択中の席数は${
                    SeatsArray.flat().filter((seat) => seat).length
                }個です。`,
            )
            // キャンセル
            event.preventDefault()
        }
    }

    const onClick = (rowCountIndex: number, columnIndex: number) => {
        setSeatsArray((prevSeats) => {
            const newSeats = prevSeats.map((row, rowIndex) =>
                row.map((seat, colIndex) => (rowIndex === rowCountIndex && colIndex === columnIndex ? !seat : seat)),
            )
            return newSeats
        })
    }

    const room = {
        row: height,
        column: width,
        seatAmount: seatsAmount,
        finished: false,
        seats: SeatsArray,
    }

    return (
        <>
            <div className={styles.seats_amount_container}>
                <div className={styles.seats_attribute}>
                    <div className={styles.seats_amount_text}>クラスの名前を入力してください</div>
                    <input
                        type='text'
                        name='class_name'
                        id='class_name'
                        placeholder='クラス名'
                        disabled={isInputted}
                        onChange={(e) => setClassName(String(e.target.value))}
                        className={styles.seats_amount_input}
                    />
                    <br />
                    <div className={styles.seats_amount_text}>クラスの人数を入力してください</div>
                    <input
                        type='number'
                        name='seats_amount'
                        id='seats_amount'
                        min='1'
                        defaultValue={seatsAmount}
                        disabled={isInputted}
                        onChange={(e) => setSeatsAmount(Number(e.target.value))}
                        className={styles.seats_amount_input}
                    />
                    <button
                        type='submit'
                        className={styles.seats_amount_button}
                        disabled={isInputted}
                        onClick={clickedSeatsAmount}
                    >
                        確定
                    </button>
                </div>
            </div>
            {isInputted && (
                <div
                    className={`${styles.wh_length_container} ${isInputted ? styles.wh_length_container_visible : ''}`}
                >
                    <div className={styles.seats_amount_text}>縦横幅を入力してください</div>
                    <div className={styles.wh_length_text} style={{ top: '45%' }}>
                        縦
                    </div>
                    <input
                        type='number'
                        name='wh_length'
                        id='h_length'
                        min='1'
                        defaultValue={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className={styles.wh_length_input}
                        style={{ top: '45%' }}
                        disabled={isConfirmed}
                    />
                    <div className={styles.wh_length_text} style={{ top: '60%' }}>
                        横
                    </div>
                    <input
                        type='number'
                        name='wh_length'
                        id='w_length'
                        min='1'
                        defaultValue={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className={styles.wh_length_input}
                        style={{ top: '60%' }}
                        disabled={isConfirmed}
                    />
                    <button
                        type='submit'
                        className={styles.wh_length_button}
                        disabled={isConfirmed}
                        onClick={() => {
                            setIsConfirmed(true)
                        }}
                    >
                        確定
                    </button>
                    <div className={styles.wh_err_msg}>{errMsg}</div>
                </div>
            )}
            <div className={styles.seats_container} style={{ display: isConfirmed ? 'block' : 'none' }}>
                <div className={styles.seats_amount_text}>使用しない座席をクリックで選択してください</div>
                <div className={styles.seats}>
                    <Box className={`mx-auto ${styles.seats_boxes}`}>
                        <SeatArrangement room={room} onClick={onClick} />
                    </Box>
                </div>

                <Form action='/management_classes' method='get' onSubmit={createClass}>
                    <button type='submit' className={styles.seats_submit_button}>
                        クラスを生成する
                    </button>
                </Form>
            </div>
        </>
    )
}
