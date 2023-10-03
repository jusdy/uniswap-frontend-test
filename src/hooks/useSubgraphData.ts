import { useState, useEffect, useCallback, useRef } from 'react'
import { subgraphUrl } from '@/config'
import { createHttpLink } from 'apollo-link-http'
import { DocumentNode } from 'graphql/language/ast'
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = createHttpLink({
  uri: subgraphUrl,
})

export const subgraphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
}) as ApolloClient<NormalizedCacheObject>

export const useSubgraphData = (
  query: DocumentNode,
  variables: object = {}
) => {
  const timerRef = useRef<NodeJS.Timeout>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>()
  const [isLoading, setLoading] = useState<boolean>(false)

  const update = useCallback(async () => {
    if (!subgraphClient || !query) {
      return
    }

    for (const param of Object.values(variables)) {
      if (param === undefined || param === null) {
        return
      }
    }

    try {
      setLoading(true)
      const response = await subgraphClient.query({
        query: query,
        variables,
      })
      setData(response.data)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }, [query, variables])

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => update(), 300)

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [update])

  return { isLoading, data, update }
}
