"use client"

import { useState, useEffect } from "react"
import {
  customerService,
  type CustomerResponse,
  type CustomerAccountResponse,
  type CustomerSubscriptionResponse,
  type CustomerTradeResponse,
} from "../services/customerService"

// 고객 정보 조회 훅
export const useCustomerInfo = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<CustomerResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await customerService.getCustomerInfo()
        setData(response)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        console.error("Failed to fetch customer info:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// 계좌 내역 조회 훅
export const useCustomerAccount = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<CustomerAccountResponse[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await customerService.getCustomerAccount()
        setData(response)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        console.error("Failed to fetch customer account:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// 청약 내역 조회 훅
export const useCustomerSubscription = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<CustomerSubscriptionResponse[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await customerService.getCustomerSubscription()
        setData(response)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        console.error("Failed to fetch customer subscription:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// 거래 내역 조회 훅
export const useCustomerTrade = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<CustomerTradeResponse[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await customerService.getCustomerTrade()
        setData(response)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        console.error("Failed to fetch customer trade:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
