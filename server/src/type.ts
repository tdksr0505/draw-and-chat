export type PlayerData = {
  id: string
  userName: string
}

type Point = {
  x: number
  y: number
}

/**
 * S2C 玩家資料
 */
export type S2C_PlayerList = {
  playerList: PlayerData[]
}

/**
 * S2C 聊天資料
 */
export type S2C_ChatData = {
  userName: string
  msg: string
  timeStamp: number
}

/**
 * S2C 登入資料
 */
export type S2C_Login = {
  isLogin: boolean
  playerList?: PlayerData[]
  msg?: string
}

/**
 * S2C 繪畫資料
 */
export type S2C_DrawLine = {
  prevPoint: Point | null
  currentPoint: Point
}

/**
 * S2C 新局資料
 */
export type S2C_NewRound = {
  countDown: number
  painterId: string
  topic: string
}

/**
 * C2S 聊天資料
 */
export type C2S_ChatData = {
  msg: string
}
/**
 * C2S 玩家加入資料
 */
export type C2S_JoinData = {
  userName: string
}

/**
 * C2S 聊天資料
 */
export type C2S_DrawLine = {
  prevPoint: Point | null
  currentPoint: Point
}
