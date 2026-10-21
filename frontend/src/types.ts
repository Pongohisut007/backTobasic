export interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

export interface ServerInfo {
  hostname: string
  version: string
  environment: string
}
