import { json, useFetcher, useLoaderData,Form } from '@remix-run/react'
import { useState,useEffect } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { SeatArrangement } from '~/original-components'
import { idToClassSeats } from './assets/class_dat'
import { LoaderFunctionArgs } from '@remix-run/node'
import { requireUserSession } from './assets/admin_auth.server'
import { getClassList } from './assets/admin_dat'
import { getStudentList } from './assets/student_dat'
import { Room } from '~/model/model'
import styles from '~/styles/write_my_seats.module.css'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const data = await requireUserSession(request)
    const adminId = data.usrId
    const classListPromise = getClassList(adminId)
    const classList = await classListPromise

    const classId = params.class_id || ''
    const existClass = classList.find((cls) => cls.id === classId)

    if (!existClass) {
        return json({ classId, room: null, studentList: [] })
    }

    const room = idToClassSeats(classId)
    const studentListPromise = getStudentList(classId)
    const studentList = await studentListPromise

    return json({ classId, room, studentList })
}

export default function Index() {
    const { classId, room: r, studentList } = useLoaderData<typeof loader>()

    if (!r) {
        return (
            <Box className='mx-auto'>
                <Text>クラスを作成してください。</Text>
            </Box>
        )
    }

    const [finished, setFinished] = useState(r?.finished || false)
    const [room, setRoom] = useState<Room>(r)
    const fetcher = useFetcher()

    console.log(room)
 
    const handleFinish = () => {

        fetcher.submit(
            {
                classId: classId,
                function: 'toggleFinished',
            },
            { method: 'post', action: `/class_dat`, encType: 'application/json' },
        )
    }

    useEffect(() => {
        // fetcherのレスポンスをチェック
        console.log("fetcher.data", fetcher.data)
        
        if (fetcher.data) {
            setFinished(fetcher.data.finished)
            setRoom((prevRoom) => ({
                ...prevRoom,
                seats: fetcher.data.seat,
                finished:fetcher.data.finished,
            }))
        }
    }, [fetcher.data])
    return (
        <div className={styles.seats_container} style={{ display: 'block' }}>
            <div className={styles.seats}>
                <Box className={`mx-auto ${styles.seats_boxes}`}>
                    <SeatArrangement room={room} />
                </Box>
                    
            </div> 
            {finished ? (
                        <Button onClick={handleFinish} className={styles.seats_submit_button} type='submit' colorScheme='teal' mt={4}>
                            座席配置を編集
                        </Button>
                    ) : (
                        <Button onClick={handleFinish} className={styles.seats_submit_button} type='submit' colorScheme='teal' mt={4}>
                            座席配置を確定
                        </Button>
                    )}
            <button type='button' className={styles.loginbutton}>
                <a href={`/management_classes`}>戻る</a>
            </button>
        </div>
    )
}
