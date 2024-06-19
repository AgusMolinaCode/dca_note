import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectCrypto() {
  return (
    <Select>
      <SelectTrigger className="w-full bg-gray-700">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent className="bg-gray-700">
        <SelectGroup>
          <SelectLabel>Cryptos</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
