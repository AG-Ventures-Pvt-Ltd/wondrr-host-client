import React from 'react'
import Card from '../Card'


export interface TableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  width: string
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, item: T, index: number) => React.ReactNode
}

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  height?: string
  className?: string
  headerClassName?: string
  bodyClassName?: string
  rowClassName?: string
  keyExtractor?: (item: T, index: number) => string | number
}

function Table<T = Record<string, unknown>>({
  columns,
  data,
  height = 'h-[calc(100vh-300px)]',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  rowClassName = '',
  keyExtractor
}: TableProps<T>) {
  const gridCols = columns.map((col: TableColumn<T>) => col.width).join('_')

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'justify-center text-center'
      case 'right':
        return 'justify-end text-right'
      default:
        return 'justify-start'
    }
  }

  return (
    <Card className={`bg-background rounded-lg overflow-hidden p-0! ${className}`}>
      <div className={`bg-neutral-50 border-b border-subtext sticky top-0 z-10 ${headerClassName}`}>
        <div className={`grid grid-cols-[${gridCols}] px-6 py-4`}>
          {columns.map((column) => (
            <div
              key={column.key}
              className={`text-xs font-medium text-subtext uppercase tracking-wide ${
                column.align === 'center' ? 'text-center' : ''
              }`}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>
      <div className={`${height} overflow-y-auto ${bodyClassName}`}>
        <div className="divide-y divide-[#E5E5E599]">
          {data.map((item, index) => (
            <div
              key={keyExtractor ? keyExtractor(item, index) : index}
              className={`grid grid-cols-[${gridCols}] px-6 py-3 hover:bg-primary-bg transition-colors ${rowClassName}`}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={`flex items-center ${getAlignmentClass(column.align)}`}
                >
                  {column.render
                    ? column.render(item[column.key as keyof T], item, index)
                    : <span className="text-sm text-maintext">{String(item[column.key as keyof T])}</span>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default Table