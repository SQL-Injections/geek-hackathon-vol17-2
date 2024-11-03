import { json } from "@remix-run/node"
import { pushUsr } from "./assets/student_dat" // Assume these are your server-side utility functions
import { requireUserSession } from "./assets/student_auth.server"

// Validate class
export async function loader({ request }: any) {
    
}


// Add Class
export async function action({ request }: any) {
    console.log("action")
    const query = await requireUserSession(request)
    if (!query){
        return json({ notFoundSession: false })
    }
    const formData = await request.json()
    console.log("formData,",formData);
    const classId = formData.classId.toString()
    // Todo : この辺りの処理はidとパスワードを求めるべき
    const users = JSON.parse(formData.student_ids)
    // console.log(classInfo[0]);
    return await pushUsr(users ,classId)
}
