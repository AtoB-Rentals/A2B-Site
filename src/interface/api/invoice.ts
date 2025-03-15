import { z } from "zod"

export type InvoiceItemTypeT =
    | "Singular"
    | "Quantitative"

export const InvoiceItemList: InvoiceItemTypeT[] = [
    "Singular",
    "Quantitative"
] as const

export const ReqInvoiceItemSchema = z.object({
    name: z.string().min(1, "Name must be provided"),
    type: z.string().refine(value => {
        return InvoiceItemList.includes(value as InvoiceItemTypeT)
    }, "Invoice type must be provided"),
    description: z.string(),
    amount: z.string().refine(num => {
        return parseInt(num) < 0
    }, "Amount cannot be a negative number")
})

export interface ReqInvoiceItemI {
    name: string
    description: string
    amount: number
    type: InvoiceItemTypeT
}

export interface InvoiceItemI {
    id?: string
    ItemNum?: number
    name: string
    description: string
    amount: number
    type: InvoiceItemTypeT
}