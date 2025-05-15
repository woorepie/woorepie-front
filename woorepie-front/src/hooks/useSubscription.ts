"use client"

import { useState, useEffect } from "react"
import {
  subscriptionService,
  type SubscriptionDetailsResponse,
  type SubscriptionSimpleResponse,
} from "../services/subscriptionService"

// 청약 상세 정보 조회 훅
export const useSubscriptionDetails = (estateId: number | string | undefined) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<SubscriptionDetailsResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!estateId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await subscriptionService.getSubscriptionDetails(Number(estateId))
        setData(response)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        console.error("Failed to fetch subscription details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [estateId])

  return { data, loading, error }
}

// 청약 목록 조회 훅
export const useActiveSubscriptions = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<SubscriptionSimpleResponse[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await subscriptionService.getActiveSubscriptions()
        setData(response)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        console.error("Failed to fetch active subscriptions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
