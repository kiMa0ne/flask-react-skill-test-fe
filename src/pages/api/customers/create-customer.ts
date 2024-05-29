import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  const user = (token as { user: TokenUser }).user
  const accessToken = user.token

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/create-customer`, req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res.status(200).json(response.data)
  } catch (error: any) {
    const errorType = error.response.status
    const errorResponse = error.response ? error.response.data : error
    res.status(errorType).json(errorResponse)
  }
}

export default handler