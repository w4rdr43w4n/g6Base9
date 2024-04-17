import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parse_date(dateString:string) {
  const timeEnd = dateString.indexOf('.')
  const dateEnd = dateString.indexOf('T')
  const date = dateString.substring(0,dateEnd)
  const time = dateString.substring(dateEnd+1,timeEnd)
  return `${date} ${time}`
}