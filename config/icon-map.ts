import {
  Banknote,
  CarFront,
  ChartNoAxesCombined,
  CreditCard,
  Gift,
  HandCoins,
  House,
  Lightbulb,
  MoreHorizontal,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Telescope,
  WalletCards,
} from 'lucide-react'

export const financeIconMap = {
  house: {
    icon: House,
    tone: 'green',
  },
  investment: {
    icon: ChartNoAxesCombined,
    tone: 'blue',
  },
  car: {
    icon: CarFront,
    tone: 'purple',
  },
  cash: {
    icon: WalletCards,
    tone: 'orange',
  },
  debt: {
    icon: CreditCard,
    tone: 'red',
  },
  income: {
    icon: HandCoins,
    tone: 'green',
  },
  expense: {
    icon: ReceiptText,
    tone: 'orange',
  },
  clue: {
    icon: Lightbulb,
    tone: 'purple',
  },
  ai: {
    icon: Sparkles,
    tone: 'blue',
  },
  future: {
    icon: Telescope,
    tone: 'purple',
  },
  salary: {
    icon: Banknote,
    tone: 'blue',
  },
  risk: {
    icon: ShieldCheck,
    tone: 'green',
  },
  bonus: {
    icon: Gift,
    tone: 'red',
  },
  shopping: {
    icon: ShoppingCart,
    tone: 'green',
  },
  more: {
    icon: MoreHorizontal,
    tone: 'slate',
  },
} as const

export type FinanceIconKey = keyof typeof financeIconMap
