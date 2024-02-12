'use client';

import { Button, Pagination, Text } from '@/components/atomic';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import React from 'react';

interface DataTableProps<TData> {
  readonly columns: ColumnDef<TData>[];
  readonly data: TData[];
  readonly currentPage: number;
  readonly onPageChange: (newPage: number) => void;
  readonly totalPages: number;
  readonly setSortBy?: (sortBy: string) => void;
  readonly isSortEnabled?: boolean;
  readonly border?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  currentPage,
  onPageChange,
  totalPages,
  setSortBy,
  isSortEnabled = true,
  border = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <section className="px-0 mx-0">
        <div className="flex flex-col">
          <div className="-mx-0 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                className={`overflow-hidden md:rounded-lg ${
                  border && 'border border-tints-forest-green-tint-6'
                }`}
              >
                <table className="w-full ">
                  <thead className="border-b border-5px-solid border-tints-forest-green-tint-6">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                          return (
                            <th
                              className="py-2 px-4 text-sm text-left rtl:text-right"
                              key={header.id}
                            >
                              {header.isPlaceholder ? null : (
                                <div className="flex items-center gap-x-2">
                                  <span>
                                    <Text
                                      className="text-tints-battleship-black-tint-2"
                                      size={'md'}
                                      weight={'semiBold'}
                                    >
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      )}
                                    </Text>
                                  </span>
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  ) != null &&
                                  header.column.columnDef.enableSorting &&
                                  isSortEnabled ? (
                                    <div className="space-y-0">
                                      <Button
                                        intent="ghost"
                                        onClick={() => {
                                          setSortBy!(header.column.id);
                                        }}
                                        postIcon={
                                          <ArrowUp2
                                            className="fa fa-caret-up"
                                            size="12"
                                            variant="TwoTone"
                                          />
                                        }
                                        size={'ghost'}
                                      ></Button>
                                      <Button
                                        intent="ghost"
                                        onClick={() => {
                                          setSortBy!(`-${header.column.id}`);
                                        }}
                                        postIcon={
                                          <ArrowDown2
                                            className="fa fa-caret-down"
                                            size="12"
                                            variant="TwoTone"
                                          />
                                        }
                                        size={'ghost'}
                                      ></Button>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table?.getRowModel()?.rows?.length ? (
                      table?.getRowModel()?.rows.map((row, rowIndex) => (
                        <tr
                          className={`border-b border-1px-solid border-tints-forest-green-tint-6 ${
                            rowIndex % 2 === 0
                              ? 'bg-white'
                              : 'bg-tints-battleship-grey-tint-6'
                          }`}
                          data-state={row.getIsSelected() && 'selected'}
                          key={row.id}
                        >
                          {row.getVisibleCells().map(cell => (
                            <td
                              className="py-2 px-4 text-sm font-medium whitespace-nowrap"
                              key={cell.id}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="h-24 text-center"
                          colSpan={columns.length}
                        >
                          No results.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      {totalPages > 0 && (
        <div className="flex w-full justify-end">
          <div>
            <Pagination
              currentPage={currentPage}
              onPageChange={onPageChange}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </>
  );
}
