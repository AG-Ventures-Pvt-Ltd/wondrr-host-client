export type ScheduleType = 'weekly' | 'monthly' | 'custom'

export interface WeeklySchedule {
  daysOfWeek: number[]   // 0=Sun … 6=Sat
  months: string[]        // 'YYYY-MM'
}

export interface MonthlySchedule {
  dayOfMonth: number      // 1–31
  months: string[]        // 'YYYY-MM'
}

export interface CustomSchedule {
  startDates: string[]    // 'YYYY-MM-DD'
}

export type Schedule = WeeklySchedule | MonthlySchedule | CustomSchedule

export interface DuplicateBatchPayload {
  sourceBatchId: string
  scheduleType: ScheduleType
  schedule: Schedule
}

export interface PreviewDate {
  startDate: string   // 'YYYY-MM-DD'
  endDate: string     // 'YYYY-MM-DD'
}
