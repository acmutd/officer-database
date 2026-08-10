import * as React from "react"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatePickerProps {
	value?: string
	onChange?: (date: string) => void
	placeholder?: string
	className?: string
	minDate?: Date
	maxDate?: Date
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
	(
		{ value, onChange, placeholder = "Select date", className, minDate, maxDate },
		ref
	) => {
		const [month, setMonth] = React.useState<number>(
			value ? parseInt(value.split("-")[1]) - 1 : new Date().getMonth()
		)
		const [year, setYear] = React.useState<number>(
			value ? parseInt(value.split("-")[0]) : new Date().getFullYear()
		)
		const [day, setDay] = React.useState<number | null>(
			value ? parseInt(value.split("-")[2]) : null
		)
		const [isOpen, setIsOpen] = React.useState(false)

		const isDateDisabled = (selectedDay: number, selectedMonth: number, selectedYear: number) => {
			const selectedDate = new Date(selectedYear, selectedMonth, selectedDay)
			if (minDate) {
				const minDateOnly = new Date(minDate.getUTCFullYear(), minDate.getUTCMonth(), minDate.getUTCDate())
				if (selectedDate < minDateOnly) return true
			}
			if (maxDate) {
				const maxDateOnly = new Date(maxDate.getUTCFullYear(), maxDate.getUTCMonth(), maxDate.getUTCDate())
				if (selectedDate > maxDateOnly) return true
			}
			return false
		}

		const getDaysInMonth = (month: number, year: number) => {
			return new Date(year, month + 1, 0).getDate()
		}

		const getFirstDayOfMonth = (month: number, year: number) => {
			return new Date(year, month, 1).getDay()
		}

		const handleDayClick = (selectedDay: number) => {
		if (!isDateDisabled(selectedDay, month, year)) {
			setDay(selectedDay)
			const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
			onChange?.(formattedDate)
			setIsOpen(false)
		}
	}

	const handleMonthChange = (newMonth: string) => {
		setMonth(parseInt(newMonth))
	}

		const daysInMonth = getDaysInMonth(month, year)
		const firstDayOfMonth = getFirstDayOfMonth(month, year)
		const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
		const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		]

		const currentYear = new Date().getFullYear()
	let yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i)

	// Filter years based on min/max constraints
	if (minDate) {
		yearOptions = yearOptions.filter(y => y >= minDate.getUTCFullYear())
	}
	if (maxDate) {
		yearOptions = yearOptions.filter(y => y <= maxDate.getUTCFullYear())
	}

		const displayValue = value
			? `${monthNames[parseInt(value.split("-")[1]) - 1]} ${value.split("-")[2]}, ${value.split("-")[0]}`
			: placeholder

		const handleYearChange = (newYear: string) => {
			setYear(parseInt(newYear))
		}

		return (
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						variant="outline"
						className={cn(
							"w-full justify-start text-left font-normal border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white",
							!value && "text-muted-foreground",
							className
						)}
					>
						<Calendar className="mr-2 h-4 w-4" />
						{displayValue}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-0 border-white/10 bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-xl"
					align="center"
				>
					<div className="p-4 space-y-4">
						{/* Month and Year Selectors */}
						<div className="flex gap-2">
							<Select value={month.toString()} onValueChange={handleMonthChange}>
								<SelectTrigger className="flex-1 border-white/10 bg-white/5 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{monthNames.map((name, index) => (
										<SelectItem key={index} value={index.toString()}>
											{name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={year.toString()} onValueChange={handleYearChange}>
								<SelectTrigger className="flex-1 border-white/10 bg-white/5 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{yearOptions.map((y) => (
										<SelectItem key={y} value={y.toString()}>
											{y}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Calendar Grid */}
						<div className="space-y-2">
							{/* Day headers */}
							<div className="grid grid-cols-7 gap-1 mb-2">
							{["S", "M", "T", "W", "T", "F", "S"].map((dayName, index) => (
								<div
									key={`${dayName}-${index}`}
									className="text-xs font-medium text-white/70 h-8 flex items-center justify-center"
								>
									{dayName}
								</div>
							))}
							</div>

							{/* Calendar days */}
							<div className="grid grid-cols-7 gap-1">
								{/* Empty cells for days before month starts */}
								{emptyDays.map((_, index) => (
									<div
										key={`empty-${index}`}
										className="h-8"
									/>
								))}

								{/* Day cells */}
								{daysArray.map((d) => {
									const isDisabled = isDateDisabled(d, month, year)
									return (
										<button
											key={d}
											onClick={() => handleDayClick(d)}
											disabled={isDisabled}
											className={cn(
												"h-8 text-xs rounded font-medium transition-colors",
												isDisabled
													? "text-white/20 cursor-not-allowed"
													: d === day
													? "bg-white/20 text-white"
													: "text-white/70 hover:bg-white/10 hover:text-white"
											)}
										>
											{d}
										</button>
									)
								})}
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		)
	}
)

DatePicker.displayName = "DatePicker"
