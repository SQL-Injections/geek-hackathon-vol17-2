import { json } from '@remix-run/node'
import { isValidUsr, pushUsr, addClass } from './assets/admin_dat'
import { requireUserSession } from "./assets/admin_auth.server"
import { Class } from '~/model/model'

export async function loader({ request }: any) {
    const url = new URL(request.url)
    const usrId = url.searchParams.get('usr_id')?.toString() || ''
    //いったんハッシュ化もソルトも存在しない状態で使うものとする
    const password = url.searchParams.get('password')?.toString() || ''
 
    const UserObj = { id: usrId, password: password };
    console.log(UserObj);
    return json({isValid: await isValidUsr(UserObj)});
}

export async function action({ request }: any) {
    console.log("action")
    const formData = await request.formData()
    const usrId = formData.get('usr_id')?.toString()
    const classId = formData.get('class_id')?.toString()
    const password = formData.get('password')?.toString()
    //className 追加
    const className = formData.get('class_name')?.toString()
    const func = formData.get('function')

    if (func === 'pushUsr') {
        const UserObj = { id: usrId, password: password };
        return json({ pushUsr: await pushUsr(UserObj) })
    }
    const query = await requireUserSession(request);
    if (!query){
        return json({ FoundSession: false });
    }
    
    if (func === 'addClass') {
        const newOObj = { id:classId,name:className} as Class
        return json({ addClass: await addClass(usrId, newOObj) })
    }
    return json({ item: false })
}
