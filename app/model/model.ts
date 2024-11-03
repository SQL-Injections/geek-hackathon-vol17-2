export type ClassList = {
    [managerId: string]: Array<Class>
}

export type SeatsInfo = {
    [classId: string]: Room
}

// 今後使うかも　使わなかったら消して
// export type RoomList = {
//     [classId: string]: Array<Room>
// }

// いるかわからん
export type ClassStudents = {
    [classId: string]: Array<Student>
}

// これより上は、本来各ページで定義されるものだが、わかりやすいようにここで定義する。

export type Manager = {
    id: string
    password: string
}

export type Student = {
    id: string
    displayName: string
}

export type Class = {
    id: string
    name: string
}

export type Room = {
    row: number // 縦
    column: number // 横
    seatAmount: number
    finished?: boolean
    seats: Array<Array<Seat>>
}

export type Seat = boolean | Array<Student>
