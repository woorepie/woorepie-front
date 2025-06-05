// api/notification.ts
import { api } from "./api"

export interface Notification {
  notificationId: number
  title: string
  content: string
  isRead: boolean
  createdAt: string
}

// 프론트에서 쓰기 좋게 변환된 타입
export interface NotificationDisplay {
  id: string          // ← 프론트에서는 id로 씀
  title: string
  message: string     // ← content → message로 alias
  date: string
  read: boolean
}

export const getAllNotifications = async (): Promise<NotificationDisplay[]> => {
  const raw = await api.get<Notification[]>("/notifications")

  return raw.map(n => ({
    id: n.notificationId.toString(),
    title: n.title,
    message: n.content,
    date: n.createdAt.slice(0, 10).replace(/-/g, "/"),
    read: n.isRead,
  }))
}

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await api.post(`/notifications/${notificationId}/read`)
}

