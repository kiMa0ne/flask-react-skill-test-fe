import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Pencil, Trash2 } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"

const { data: session } = useSession()

const deleteCustomer = (customerId: number) => {
  axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/delete-customer/${customerId}`, { headers: {"Authorization" : `Bearer ${session?.user.token}`} }).then((response) => {
    console.log(response)
  }).catch(error => console.error(error))
}

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "favouriteProduct",
    header: "Favourite Product",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customerItem = row.original
      return (
        <div className="flex gap-2">
          <Button size="icon" onClick={() => console.log(customerItem)} className="bg-green-800">
            <Pencil size={16} />
          </Button>
          <Button size="icon" onClick={() => deleteCustomer(customerItem.id)} className="bg-red-600">
            <Trash2  size={16}/>
          </Button>
        </div>

      )
    }
  }
]