import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import type { Server } from 'miragejs'

export default function crmFakeApi(server: Server, apiPrefix: string) {
    server.get(`${apiPrefix}/crm/dashboard`, (schema) => {
        return schema.db.crmDashboardData[0]
    })

    server.get(`${apiPrefix}/crm/calendar`, (schema) => schema.db.eventsData)

    server.post(`${apiPrefix}/crm/customers`, (schema, { requestBody }) => {
        const body = JSON.parse(requestBody)
        const { pageIndex, pageSize, sort, query } = body
        const { order, key } = sort
        const users = schema.db.userDetailData
        const sanitizeUsers = users.filter((elm) => typeof elm !== 'function')
        let data = sanitizeUsers
        let total = users.length

        if (key && order) {
            if (key !== 'lastOnline') {
                data.sort(
                    sortBy(key, order === 'desc', (a) =>
                        (a as string).toUpperCase(),
                    ),
                )
            } else {
                data.sort(sortBy(key, order === 'desc', parseInt as Primer))
            }
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

    server.get(`${apiPrefix}/crm/customers-statistic`, () => {
        return {
            totalCustomers: {
                value: 2420,
                growShrink: 17.2,
            },
            activeCustomers: {
                value: 1897,
                growShrink: 32.7,
            },
            newCustomers: {
                value: 241,
                growShrink: -2.3,
            },
        }
    })

    server.get(
        `${apiPrefix}/crm/customer-details`,
        (schema, { queryParams }) => {
            const id = queryParams.id
            const user = schema.db.userDetailData.find(id as string)
            return user
        },
    )

    server.del(
        `${apiPrefix}/crm/customer/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            schema.db.userDetailData.remove({ id })
            return {}
        },
    )

    server.put(`${apiPrefix}/crm/customers`, (schema, { requestBody }) => {
        const data = JSON.parse(requestBody)
        const { id } = data
        schema.db.userDetailData.update({ id }, data)
        return {}
    })

    server.get(`${apiPrefix}/crm/mails`, (schema, { queryParams }) => {
        const { category } = queryParams
        let data = schema.db.mailData

        if (category === 'sentItem') {
            data = schema.db.mailData.where({ group: 'sentItem' })
        }

        if (category === 'deleted') {
            data = schema.db.mailData.where({ group: 'deleted' })
        }

        if (category === 'draft') {
            data = schema.db.mailData.where({ group: 'draft' })
        }

        if (category === 'starred') {
            data = schema.db.mailData.where({ starred: true })
        }

        if (
            category === 'work' ||
            category === 'private' ||
            category === 'important'
        ) {
            data = schema.db.mailData.where({ label: category })
        }

        return data
    })

    server.get(`${apiPrefix}/crm/mail`, (schema, { queryParams }) => {
        const id = queryParams.id
        const mail = schema.db.mailData.find(id as string)
        return mail
    })
}
