import { json } from '@remix-run/node'
import {
    assignSeats,
    idToClassSeats,
    pushIdAndClass,
    modifyClass,
    toggleFinished,
    handleFinish
} from './assets/class_dat' // Assume these are your server-side utility functions
import { requireUserSession as requireStudentSession } from './assets/student_auth.server'
import { requireUserSession as requireAdminSession } from './assets/admin_auth.server'

// Validate class
export async function loader({ request }: any) {
    const url = new URL(request.url)
    //　クラスID　String型にします
    const classId = String(url.searchParams.get('class_id'))
    const isValid = await idToClassSeats(classId)
    return isValid === undefined ? false : isValid
}

// Add Class
export async function action({ request }: any) {
    const formData = await request.json()
    // console.log(formData);
    const classId = String(formData.classId)
    // Todo : この辺りの処理はidとパスワードを求めるべき
    const func = String(formData.function)

    switch (func) {
        case 'modifyClass': {
            const query = await requireStudentSession(request)
            if (!query) {
                return json({ notFoundSession: false })
            }
            const x = Number(formData.x)
            const y = Number(formData.y)
            const usrName = formData.user.displayName
            const usrId = formData.user.id
            return await modifyClass(classId, usrId, usrName, x, y)
        }
        case 'toggleFinished': {
            const query = await requireAdminSession(request)
            if (!query) {
                return json({ notFoundSession: false })
            }
            return await toggleFinished(classId)
        }
        case 'handleFinishedSeats': {
            const query = await requireAdminSession(request)
            if (!query) {
                return json({ notFoundSession: false })
            }
            const room = formData.room
            return await handleFinish(classId, room)
        }
        case 'assignSeats': {
            const query = await requireAdminSession(request)
            if (!query) {
                return json({ notFoundSession: false })
            }
            return await assignSeats(classId)
        }
    }
    // console.log(classId);
    const classInfo = JSON.parse(formData.classInfo)
    // console.log(classInfo[0]);
    return await pushIdAndClass(classId, classInfo)
}
