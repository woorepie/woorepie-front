export interface CustomerTrade {
  tradeId: number
  estateId: number
  estateName: string
  tradeTokenAmount: number
  tradeTokenPrice: number
  tradeDate: string // LocalDateTime → ISO 문자열로 온다고 가정
  tradeType: "매수" | "매도" | "배당"

}
