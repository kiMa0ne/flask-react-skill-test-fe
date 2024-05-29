import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/customers-table/CustomersDataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";

const availableProducts: string[] = ["Steam Deck", "Nintendo Switch", "PS5", "XBOX", "PC"].sort((alpha, beta) => alpha.localeCompare(beta))

export default function Home() {
  const [customersData, setCustomersData] = useState<Customer[]>([])
  const [isCreateCustomerDialogOpen, setIsCreateCustomerDialogOpen] = useState(false)
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false)
  const [currentEditingCustomer, setCurrentEditingCustomer] = useState<number | null>(null)

  const customerForm = useForm()

  const deleteCustomer = (customerId: number) => {
    axios.delete(`/api/customers/delete-customer/${customerId}`).then((response) => {
      setCustomersData(response.data)
    }).catch(error => console.error(error))
  }

  useEffect(() => {
    axios.get(`/api/customers/get-customers`).then((response) => {
      setCustomersData(response.data)
    }).catch(error => console.error(error))
  }, [])

  useEffect(() => {
    if (currentEditingCustomer) {
      const customerItem = customersData.find(customer => customer.id === currentEditingCustomer)
      customerForm.setValue("firstName", customerItem?.firstName )
      customerForm.setValue("lastName", customerItem?.lastName )
      customerForm.setValue("email", customerItem?.email )
      customerForm.setValue("favouriteProduct", customerItem?.favouriteProduct )
      customerForm.setValue("phone", customerItem?.phone )
    } else {
      customerForm.reset()
    }

  }, [currentEditingCustomer])

  useEffect(() => {
    if (isCreateCustomerDialogOpen) {
      customerForm.reset({
        "firstName": null,
        "lastName": null,
        "email": null,
        "favouriteProduct": null,
        "phone": null,
      })
    }
  }, [isCreateCustomerDialogOpen])

  const onCreateCustomerSubmit = (data: any) => {
    const customerFormData = customerForm.getValues()
    axios.post(`/api/customers/create-customer`, customerFormData).then(response => {
      const newCustomerData = response.data as Customer
      setCustomersData([...customersData, newCustomerData])
      setIsCreateCustomerDialogOpen(false)
    }).catch(error => {
      console.error(error)
    })
  }

  const onEditCustomerSubmit = () => {
    const customerFormData = customerForm.getValues()
    axios.put(`/api/customers/edit-customer/${currentEditingCustomer}`, customerFormData).then(response => {
      const editedUserData = response.data as Customer
      const editedUserIndex = customersData.findIndex(customerItem => customerItem.id === currentEditingCustomer)
      const newCustomersData = [...customersData]
      newCustomersData[editedUserIndex] = editedUserData
      setCustomersData(newCustomersData)

      setIsEditCustomerDialogOpen(false)
      setCurrentEditingCustomer(null)
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data)
      }
    })
  }

  return (
    <div>
      <Link href={"/login"}>LOGIN</Link>
      <DataTable
        data={customersData}
        deleteCustomer={deleteCustomer}
        setIsEditingCustomer={setIsEditCustomerDialogOpen}
        setCurrentCustomer={setCurrentEditingCustomer}
      />
      {/* CREATE CUSTOMER DIALOG */}
      <Dialog open={isCreateCustomerDialogOpen} onOpenChange={setIsCreateCustomerDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">New Customer</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Creation</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">

            <Form {...customerForm}>
              <form onSubmit={customerForm.handleSubmit(onCreateCustomerSubmit)} className="space-y-4 w-full">
                <FormField
                  control={customerForm.control}
                  name="firstName"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={customerForm.control}
                  name="lastName"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={customerForm.control}
                  name="email"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={customerForm.control}
                  name="phone"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" pattern="[0-9]{10}" placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={customerForm.control}
                  name="favouriteProduct"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favourite Product</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your favourite product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableProducts.map((productItem, index) => {
                          return <SelectItem key={index} value={productItem}>{productItem}</SelectItem>
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT CUSTOMER DIALOG */}
      <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Editing</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">

            <Form {...customerForm}>
              <form onSubmit={customerForm.handleSubmit(onEditCustomerSubmit)} className="space-y-4 w-full">
                <FormField
                  control={customerForm.control}
                  name="firstName"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={customerForm.control}
                  name="lastName"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={customerForm.control}
                  name="email"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={customerForm.control}
                  name="phone"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" pattern="[0-9]{10}" placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={customerForm.control}
                  name="favouriteProduct"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favourite Product</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your favourite product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableProducts.map((productItem, index) => {
                          return <SelectItem key={index} value={productItem}>{productItem}</SelectItem>
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Edit</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
