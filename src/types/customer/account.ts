export interface CustomerAccount {
  accountId: number        // Long in Java maps to number in TypeScript
  estateId: number        // Long in Java maps to number in TypeScript
  estateName: string
  accountTokenAmount: number    // Integer in Java maps to number in TypeScript
  accountTokenPrice: number     // Integer in Java maps to number in TypeScript
  estateTokenPrice: number      // Integer in Java maps to number in TypeScript
  estatePrice: string          // BigDecimal in Java maps to string in TypeScript for precision
} 