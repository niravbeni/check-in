"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  date?: Date
  onDateTimeChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateTimePicker({
  date,
  onDateTimeChange,
  placeholder = "Select date and time",
  disabled = false,
  className
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // If we have an existing date with time, preserve the time
      if (date) {
        selectedDate.setHours(date.getHours())
        selectedDate.setMinutes(date.getMinutes())
      }
      onDateTimeChange?.(selectedDate)
    }
  }

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const newDate = date ? new Date(date) : new Date()
    
    if (type === "hour") {
      newDate.setHours(parseInt(value))
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value))
    }
    
    onDateTimeChange?.(newDate)
  }

  return (
    <div className={cn("space-y-2 date-time-picker", className)}>
      <Label className="text-sm font-medium">Meeting Date & Time *</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-11",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "MMM dd, yyyy 'at' HH:mm")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto scroll-area">
                <div className="flex sm:flex-col p-2">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={date && date.getHours() === hour ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto scroll-area">
                <div className="flex sm:flex-col p-2">
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("minute", minute.toString())}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 