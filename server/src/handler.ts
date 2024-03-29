import WebsocketManager from './websocketManager'
import { C2S_JoinData, UserData, C2S_DrawLine } from './type'

class Handler {
  private websocketManager: WebsocketManager
  /**
   * 全部使用者資料
   */
  private userList: UserData[] = []
  private drawRecord: C2S_DrawLine[] = []
  constructor(websocketManager: WebsocketManager) {
    this.websocketManager = websocketManager
  }

  public handleDisconnect(id: string) {
    this.userList = this.userList.filter((user) => {
      return user.id !== id
    })
    if (this.userList.length === 0) {
      this.drawRecord = []
    }
    let allSocketIds = this.getAllSocketIds()
    this.websocketManager.sendUserList(allSocketIds, {
      userList: this.userList,
    })
    console.log('使用者列表', this.userList)
  }
  public handleUserJoin(id: string, data: C2S_JoinData) {
    if (this.checkSameName(data.userName)) {
      //檢查是否有同名使用者
      this.websocketManager.sendLogin(id, {
        isLogin: false,
        msg: '已有重複暱稱!',
      })
      return
    }

    let newUser = {
      id,
      userName: data.userName,
    }
    this.userList.push(newUser)

    this.websocketManager.sendLogin(id, {
      isLogin: true,
      userList: this.userList,
      drawRecord: this.drawRecord,
      msg: '登入成功',
    })

    let otherSocketIds = this.getOtherSocketIds(id)

    this.websocketManager.sendUserList(otherSocketIds, {
      userList: this.userList,
    })
    console.log('使用者列表', this.userList)
  }

  public handleSendMsg(id: string, msg: string) {
    let allSocketIds = this.getAllSocketIds()
    let userName = this.userList.find((user) => {
      return user.id === id
    })?.userName
    if (userName) {
      let timeStamp = new Date().getTime()
      this.websocketManager.sendMsg(allSocketIds, {
        userName,
        msg,
        timeStamp,
      })
    }
  }

  public handleDrawLine(id: string, data: C2S_DrawLine) {
    this.drawRecord.push(data)
    let otherSocketIds = this.getOtherSocketIds(id)
    this.websocketManager.sendDrawLine(otherSocketIds, data)
  }

  public handleClaer(id: string) {
    this.drawRecord = []
    let otherSocketIds = this.getOtherSocketIds(id)
    this.websocketManager.sendClear(otherSocketIds)
  }

  private getAllSocketIds() {
    return this.userList.map((user) => {
      return user.id
    })
  }

  private getOtherSocketIds(excludeId: string) {
    let otherSocketIds: string[] = []
    this.userList.forEach((user) => {
      if (user.id !== excludeId) otherSocketIds.push(user.id)
    })
    return otherSocketIds
  }

  /**
   * 檢查是否有相同名稱使用者
   */
  private checkSameName(userName: string) {
    return this.userList.find((user) => {
      return user.userName === userName
    })
  }
}

export default Handler
