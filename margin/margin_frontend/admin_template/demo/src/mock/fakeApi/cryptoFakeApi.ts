import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import type { Server } from 'miragejs'

export default function cryptoFakeApi(server: Server, apiPrefix: string) {
    server.get(`${apiPrefix}/crypto/dashboard`, (schema) => {
        return schema.db.cryptoDashboardData[0]
    })

    server.get(`${apiPrefix}/crypto/portfolio`, (schema) => {
        return schema.db.portfolioData[0]
    })

    server.get(`${apiPrefix}/crypto/wallets`, (schema) => {
        return schema.db.walletsData
    })

    server.post(
        `${apiPrefix}/crypto/wallets/history`,
        (schema, { requestBody }) => {
            const { tab, pageIndex, pageSize, sort } = JSON.parse(requestBody)

            let data = schema.db.transactionHistoryData[0][tab]
            const total = data.length
            const { order, key } = sort

            if (key && order) {
                if (key !== 'action') {
                    data.sort(sortBy(key, order === 'desc', parseInt as Primer))
                } else {
                    data.sort(
                        sortBy(key, order === 'desc', (a) =>
                            (a as string).toUpperCase(),
                        ),
                    )
                }
            }
            data = paginate(data, pageSize, pageIndex)

            return {
                data,
                total,
            }
        },
    )

    server.post(`${apiPrefix}/crypto/market`, (schema, { requestBody }) => {
        const { tab, pageIndex, pageSize, sort, query } =
            JSON.parse(requestBody)

        let data = schema.db.marketData[0][tab]
        let total = data.length
        const { order, key } = sort

        if (key && order) {
            if (key !== 'action') {
                data.sort(sortBy(key, order === 'desc', parseInt as Primer))
            } else {
                data.sort(
                    sortBy(key, order === 'desc', (a) =>
                        (a as string).toUpperCase(),
                    ),
                )
            }
        }

        if (query) {
            data = wildCardSearch(data, query)
            total = data.length
        }

        data = paginate(data, pageSize, pageIndex)

        return {
            data,
            total,
        }
    })
}
