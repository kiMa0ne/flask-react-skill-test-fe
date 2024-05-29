import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { Pencil, Trash2 } from "lucide-react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction, useState } from "react"

interface DataTableProps<TData> {
  data: TData[]
  deleteCustomer: (customerId: number) => void
  setIsEditingCustomer: Dispatch<SetStateAction<boolean>>
  setCurrentCustomer: Dispatch<SetStateAction<number | null>>
}

export function DataTable<TData extends { id: number }>({ data, deleteCustomer, setIsEditingCustomer, setCurrentCustomer }: DataTableProps<TData>) {
  const columns: ColumnDef<TData>[] = [
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

            <Button size="icon" onClick={() => {setIsEditingCustomer(true); setCurrentCustomer(customerItem.id)}} className="bg-green-600">
              <Pencil  size={16}/>
            </Button>
            <Button size="icon" onClick={() => deleteCustomer(customerItem.id)} className="bg-red-600">
              <Trash2  size={16}/>
            </Button>
          </div>

        )
      }
    }
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}