// 响应代理因无法获取x-host转发的400请求
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return res.status(400).end();
}
