export interface IPagination<T> {
  data: T[]
  count: number
}

export interface IBaseModel {
  id: string
  version_id: bigint
  created_at: Date
  updated_at: Date
  deleted_at?: Date // <= SOFT DELETE
}
