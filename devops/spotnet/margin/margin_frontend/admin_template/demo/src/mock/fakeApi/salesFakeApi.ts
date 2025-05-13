import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import type { Server } from 'miragejs'

export default function salesFakeApi(server: Server, apiPrefix: string) {
    server.post(`${apiPrefix}/sales/dashboard`, (schema) => {
        return schema.db.salesDashboardData[0]
    })

    server.post(`${apiPrefix}/sales/products`, (schema, { requestBody }) => {
        const body = JSON.parse(requestBody)
        const { pageIndex, pageSize, sort, query } = body
        const { order, key } = sort
        const products = schema.db.productsData
        const sanitizeProducts = products.filter(
            (elm) => typeof elm !== 'function',
        )
        let data = sanitizeProducts
        let total = products.length

        if ((key === 'category' || key === 'name') && order) {
            data.sort(
                sortBy(key, order === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(key, order === 'desc', parseInt as Primer))
        }

        if (query) {
            data = wildCardSearch(data, query)
            total = data.length
        }

        data = paginate(data, pageSize, pageIndex)

        const responseData = {
            data: data,
            total: total,
        }
        return responseData
    })

    server.del(
        `${apiPrefix}/sales/products/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            schema.db.productsData.remove({ id })
            return true
        },
    )

    server.get(`${apiPrefix}/sales/product`, (schema, { queryParams }) => {
        const id = queryParams.id
        const product = schema.db.productsData.find(id as string)
        return product
    })

    server.put(
        `${apiPrefix}/sales/products/update`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            const { id } = data
            schema.db.productsData.update({ id }, data)
            return true
        },
    )

    server.post(
        `${apiPrefix}/sales/products/create`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            schema.db.productsData.insert(data)
            return true
        },
    )

    server.get(`${apiPrefix}/sales/orders`, (schema, { queryParams }) => {
        const { pageIndex, pageSize, query } = queryParams
        const order = queryParams['sort[order]']
        const key = queryParams['sort[key]']
        const orders = schema.db.ordersData
        const sanitizeProducts = orders.filter(
            (elm) => typeof elm !== 'function',
        )
        let data = sanitizeProducts
        let total = orders.length

        if (key) {
            if (
                (key === 'date' ||
                    key === 'status' ||
                    key === 'paymentMehod') &&
                order
            ) {
                data.sort(sortBy(key, order === 'desc', parseInt as Primer))
            } else {
                data.sort(
                    sortBy(key as string, order === 'desc', (a) =>
                        (a as string).toUpperCase(),
                    ),
                )
            }
        }

        if (query) {
            data = wildCardSearch(data, query as string)
            total = data.length
        }

        data = paginate(
            data,
            parseInt(pageSize as string),
            parseInt(pageIndex as string),
        )

        const responseData = {
            data: data,
            total: total,
        }
        return responseData
    })

    server.del(
        `${apiPrefix}/sales/orders/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            id.forEach((elm: string) => {
                schema.db.ordersData.remove({ id: elm })
            })
            return true
        },
    )

    server.get(
        `${apiPrefix}/sales/orders-details`,
        (schema, { queryParams }) => {
            const { id } = queryParams
            const orderDetail = schema.db.orderDetailsData
            orderDetail[0].id = id
            return orderDetail[0]
        },
    )
}
