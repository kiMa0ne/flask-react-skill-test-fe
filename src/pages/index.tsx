import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/customers-table/CustomersDataTable";

export default function Home() {

  const {data: session} = useSession()
  const [customersData, setCustomersData] = useState<Customer[]>([])

  const deleteCustomer = (customerId: number) => {
    axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/delete-customer/${customerId}`, { headers: {"Authorization" : `Bearer ${session?.user.token}`} }).then((response) => {
      console.log(response)
      setCustomersData(response.data)
    }).catch(error => console.error(error))
  }

  useEffect(() => {
    // GET CUSTOMERS
    console.log({session})
    axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/get-customers`, { headers: {"Authorization" : `Bearer ${session?.user.token}`} }).then((response) => {
      console.log(response)
      setCustomersData(response.data)
    }).catch(error => console.error(error))

    // ADD CUSTOMER
    // axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/create-customer`, {
    //   firstName: "TestName",
    //   lastName: "TestLastName",
    //   email: "testEmail@email.it",
    //   phone: "3315556789",
    //   favouriteProduct: "Nintendo Switch",
    // }).then(response => {
    //   console.log(response)
    // }).catch(error => {
    //   console.error(error)
    //   alert(error.response.data.error)
    // })

    // UPDATE CUSTOMER

  }, [session?.user.token])

  return (
    <div>
      <Link href={"/login"}>LOGIN</Link>
      <DataTable data={customersData} deleteCustomer={deleteCustomer}/>
    </div>
  );
}
