"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "1",
    label: "Item name: Apple. Discritipon: I really want it for my kids. Quantity: 5.",
  },
  {
    value: "2",
    label: "Item name: Banana. Description: They are perfect for my morning smoothies. Quantity: 10.",
  },
  {
    value: "3",
    label: "Item name: Orange. Description: My kids love them for their lunchboxes. Quantity: 8.",
  },
  {
    value: "4",
    label: "Item name: Grapes. Description: They make a great healthy snack. Quantity: 3.",
  },
  {
    value: "5",
    label: "Item name: Milk. Description: We need it for breakfast cereals. Quantity: 2.",
  },
  {
    value: "6",
    label: "Item name: Apple. Discritipon: I really want it for my kids. Quantity: 5.",
  },
  {
    value: "7",
    label: "Item name: Banana. Description: They are perfect for my morning smoothies. Quantity: 10.",
  },
  {
    value: "8",
    label: "Item name: Orange. Description: My kids love them for their lunchboxes. Quantity: 8.",
  },
  {
    value: "9",
    label: "Item name: Grapes. Description: They make a great healthy snack. Quantity: 3.",
  },
  {
    value: "10",
    label: "Item name: Milk. Description: We need it for breakfast cereals. Quantity: 2.",
  },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[700px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Existence Requests"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[700px] p-0">
        <Command>
          <CommandInput placeholder="Search existence requests" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-72 rounded-md border">
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
