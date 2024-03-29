'use client'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { SocketContext } from '../context/socketContext'
import { UserListContext } from '../context/userListContext'
import { C2S_COMMAND, S2C_COMMAND } from '@/constants'
import Canvas from './canvas'
import Palette from './palette'

type roomViewProps = {}

const roomView: React.FC<roomViewProps> = () => {
  const [chatData, setChatData] = useState<ChatData[]>([])
  const [msg, setMsg] = useState<string>('')
  const socket = useContext(SocketContext)
  const { userList, setUserList } = useContext(UserListContext)

  const chatBoxRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    socket.on(S2C_COMMAND.USER_LIST, (data: UserList) => {
      setUserList(data.userList)
    })
    socket.on(S2C_COMMAND.SEND_MSG, (data: ChatData) => {
      setChatData((pre) => [...pre, data])
    })
  }, [])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [chatData])

  const handleSendMsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!msg) {
        return
      }
      socket.emit(C2S_COMMAND.SEND_MSG, { msg })
      setMsg('')
    }
  }
  const handleMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value)
  }
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center  p-2">
      <div className="bg-white w-[700px] mb-3 p-3">
        <Palette socket={socket} />
      </div>
      <div className="p-4  text-center rounded shadow-lg h-[600px] w-[700px]  flex flex-col bg-white">
        {/* 上半部 */}
        <div className="relative h-2/3 flex flex-auto pb-1">
          {/* 畫布區 */}
          <div className="w-3/4 h-full pr-2 pb-2 ">
            <Canvas socket={socket} />
          </div>
          {/* 使用者列表 */}
          <div className="flex-auto h-full border-l-2 border-slate-500">
            <div className="text-center text-slate-500 font-bold">USERS</div>
            <div className="text-left pl-2 overflow-auto">
              {userList.map((user) => {
                return (
                  <div
                    key={user.id}
                    className="text-slate-500 py-1 border-b border-slate-400 last:border-0 flex items-center"
                  >
                    <img src="/img/user.png" className="w-[30px]" />
                    <div>{user.userName}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 下半部 */}
        <div className="h-1/3 border-t-2 border-slate-500 pt-1  flex flex-col">
          <div
            className="  border-blue-500 flex-auto overflow-auto"
            ref={chatBoxRef}
          >
            {chatData.map((data) => {
              let key = `${data.userName}-${data.msg}-${data.timeStamp}`
              return (
                <div className="flex " key={key}>
                  <div className="text-slate-500">{data.userName}：</div>
                  <div className="text-slate-800">{data.msg}</div>
                </div>
              )
            })}
          </div>
          <input
            type="text"
            onKeyDown={handleSendMsg}
            onChange={handleMsgChange}
            value={msg}
            placeholder="輸入對話"
            className="rounded outline-0 p-2 shadow-md border-2 border-blue-500 w-full mt-1"
          />
        </div>
      </div>
    </div>
  )
}
export default roomView
