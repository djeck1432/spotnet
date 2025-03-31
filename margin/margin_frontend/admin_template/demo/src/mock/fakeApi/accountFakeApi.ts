/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Server } from 'miragejs'

export default function accountFakeApi(server: Server, apiPrefix: string) {
    server.get(`${apiPrefix}/account/setting`, (schema) => {
        return schema.db.settingData[0]
    })

    server.get(`${apiPrefix}/account/setting/integration`, (schema) => {
        return schema.db.settingIntergrationData[0]
    })

    server.get(`${apiPrefix}/account/setting/billing`, (schema) => {
        return schema.db.settingBillingData[0]
    })

    server.get(`${apiPrefix}/account/invoice`, (schema, { queryParams }) => {
        const { id } = queryParams
        const invoice = schema.db.invoiceData
        invoice[0].id = id
        return invoice[0]
    })

    server.post(`${apiPrefix}/account/log`, (schema, { requestBody }) => {
        const { filter, activityIndex } = JSON.parse(requestBody)
        let loadable = true
        const maxGetItem = 3
        const count = (activityIndex - 1) * maxGetItem
        let logs = schema.db.logData
        if (count >= logs.length) {
            loadable = false
        }
        logs = logs.slice(count, activityIndex * maxGetItem) as any
        logs = logs.map((log) => {
            log.events = log.events.filter((event: any) =>
                filter.includes(event.type),
            )
            return log
        }) as any
        const response = {
            data: logs,
            loadable,
        }
        return response
    })

    server.get(`${apiPrefix}/account/form`, (schema) => {
        return schema.db.accountFormData[0]
    })
}
