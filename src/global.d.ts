type UserData = {
  id: string
  userName: string
}

type LoginInfo = {
  isLogin: boolean
  userList?: UserData[]
  msg?: string
  drawRecord?: DrawLine[]
}

type ChatData = {
  userName: string
  msg: string
  timeStamp: number
}

type CanvasProps = {
  socket: Socket
}

type PaletteProps = {
  socket: Socket
}

type Point = {
  x: number
  y: number
}

type DrawLine = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

type UserList = {
  userList: UserData[]
}

type JoinData = {
  userName: string
}
