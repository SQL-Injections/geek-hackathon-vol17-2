import { LoaderFunctionArgs } from "@remix-run/node"
import { studentDat ,ClassStudents } from "./assets/student_dat"

export async function action({ request } : LoaderFunctionArgs) {
    const formData = await request.formData()
    console.log(formData)
    const classId = formData.get("class_id")
    console.log("classId : ",classId )
    console.log("classId : ",typeof(classId) )
    if (classId != undefined) {
        console.log(studentDat)
        const studentList = studentDat[classId]
        console.log(studentList)
        if (!studentList) {
            return false
        }
        else{
             // CSVデータを生成
             const csvContent = generateCsv(studentList);
            console.log(csvContent)
             return new Response(csvContent, {
                 headers: {
                     "Content-Type": "text/csv; charset=cp932",
                     "Content-Disposition": `attachment; filename="data.csv"`,
                 },
             });
        }
    }
    else{
        return new Response("Invalid request", { status: 400 });
    }
}
// CSV生成関数
function generateCsv(data: ClassStudents) {
    const header = "id\n"; // 必要に応じてヘッダーを変更
    const rows = data.map(student => `${student.id}`).join("\n");
    return header + rows;
}