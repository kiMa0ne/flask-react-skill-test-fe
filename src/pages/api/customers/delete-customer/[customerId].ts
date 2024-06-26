import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  const user = (token as { user: TokenUser }).user
  const accessToken = user.token
  const { customerId } = req.query

  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/delete-customer/${customerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res.status(200).json(response.data)
  } catch (error: any) {
    const errorType = error.response.status
    res.status(errorType).json(error)
  }
}

export default handler