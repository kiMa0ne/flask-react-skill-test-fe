import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req

  const token = await getToken({ req })
  const user = (token as { user: TokenUser }).user
  const accessToken = user.token

  const page = Number(query.page) - 1 || 0
  const size = query.size || 10000

  try {
    switch (method) {
      case 'GET': {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`, {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        })
        res.status(200).json(response.data)
        break;
      }
      case 'POST': {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/create-customer`, req.body, {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        })
        res.status(200).json(response.data)
        break;
      }
      case 'DELETE': {
        console.log({req})
        // const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/delete-customer/${req.body}`, {
        //   headers: {
        //     Authorization: accessToken,
        //     "Content-Type": "application/json",
        //   },
        // })
        // res.status(200).json(response.data)
        break;
      }
      case 'PUT': {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/update-customer`, req.body, {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        })
        res.status(200).json(response.data)
        break;
      }
    }
  } catch (error: any) {
    console.error("CUSTOMER API ERROR ### ", error)
    const errorType = error.response.status
    res.status(errorType).json(error)
  }
}

export default handler