"use client";

import React, { useMemo, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Columns2,
  Copy,
  GripVertical,
  Merge,
  Minus,
  PanelTop,
  Plus,
  Rows2,
  SplitSquareVertical,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  addTableColumn,
  addTableRow,
  duplicateTableColumn,
  duplicateTableRow,
  mergeTableCell,
  moveTableColumn,
  moveTableRow,
  normalizeTableProps,
  removeTableColumn,
  removeTableRow,
  setTableColumnWidth,
  splitTableCell,
  toLegacyTableProps,
  updateTableCell,
} from '@/lib/editor/tableUtils';

interface BuilderTableProps {
  blockId: string;
  props: Record<string, unknown>;
  interactive: boolean;
  onChange: (nextProps: Record<string, unknown>) => void;
  onSelect: () => void;
}

const cellPaddingMap: Record<string, string> = {
  compact: '0.45rem 0.65rem',
  normal: '0.8rem 0.95rem',
  spacious: '1rem 1.15rem',
};

const alignIcons = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
};

export function BuilderTable({ blockId, props, interactive, onChange, onSelect }: BuilderTableProps) {
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number; columnIndex: number } | null>(null);
  const tableProps = useMemo(() => normalizeTableProps(props), [props]);
  const tableData = tableProps.tableData;
  const borderColor = typeof props.borderColor === 'string' ? props.borderColor : '#dbe3ec';
  const headerBackgroundColor = typeof props.headerBackgroundColor === 'string' ? props.headerBackgroundColor : '#f8fafc';
  const cellBackgroundColor = typeof props.cellBackgroundColor === 'string' ? props.cellBackgroundColor : '#ffffff';
  const stripedColor = typeof props.stripedColor === 'string' ? props.stripedColor : '#f8fafc';
  const headerRow = props.headerRow !== false;
  const headerColumn = Boolean(props.headerColumn);
  const stickyHeader = Boolean(props.stickyHeader);
  const stickyFirstColumn = Boolean(props.stickyFirstColumn);
  const borderStyle = typeof props.borderStyle === 'string' ? props.borderStyle : 'solid';
  const cellPadding = cellPaddingMap[String(props.cellPadding || 'normal')] ?? cellPaddingMap.normal;
  const tableRadius = typeof props.borderRadius === 'string' ? props.borderRadius : '22px';
  const selectedTableCell = selectedCell ? tableData.rows[selectedCell.rowIndex]?.cells[selectedCell.columnIndex] : null;

  const saveTable = (nextTable: typeof tableData, extra: Record<string, unknown> = {}) => {
    const legacy = toLegacyTableProps(nextTable);
    onChange({
      ...extra,
      tableData: nextTable,
      headers: legacy.headers,
      rows: legacy.rows,
    });
  };

  const updateCellStyle = (patch: Record<string, unknown>) => {
    if (!selectedCell) return;
    const nextTable = updateTableCell(tableData, selectedCell.rowIndex, selectedCell.columnIndex, (cell) => ({
      ...cell,
      ...patch,
    }));
    saveTable(nextTable);
  };

  const renderToolbar = interactive ? (
    <div className="mb-4 rounded-[20px] border border-[#e4eaf0] bg-[#fbfdff] p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="builder-table-tool" onClick={() => saveTable(addTableRow(tableData))}>
          <Rows2 className="h-3.5 w-3.5" />
          Add row
        </button>
        <button type="button" className="builder-table-tool" onClick={() => saveTable(addTableColumn(tableData))}>
          <Columns2 className="h-3.5 w-3.5" />
          Add column
        </button>
        <button
          type="button"
          className="builder-table-tool"
          onClick={() => saveTable(addTableRow(tableData, 0))}
        >
          <PanelTop className="h-3.5 w-3.5" />
          Add top row
        </button>
        {selectedCell && (
          <>
            <span className="mx-1 h-5 w-px bg-[#d9e2ec]" />
            <button type="button" className="builder-table-tool" onClick={() => saveTable(duplicateTableRow(tableData, selectedCell.rowIndex))}>
              <Copy className="h-3.5 w-3.5" />
              Duplicate row
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(duplicateTableColumn(tableData, selectedCell.columnIndex))}>
              <Copy className="h-3.5 w-3.5" />
              Duplicate col
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(moveTableRow(tableData, selectedCell.rowIndex, 'up'))}>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(moveTableRow(tableData, selectedCell.rowIndex, 'down'))}>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(moveTableColumn(tableData, selectedCell.columnIndex, 'left'))}>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(moveTableColumn(tableData, selectedCell.columnIndex, 'right'))}>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(removeTableRow(tableData, selectedCell.rowIndex))}>
              <Trash2 className="h-3.5 w-3.5" />
              Remove row
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(removeTableColumn(tableData, selectedCell.columnIndex))}>
              <Trash2 className="h-3.5 w-3.5" />
              Remove col
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(mergeTableCell(tableData, selectedCell.rowIndex, selectedCell.columnIndex, 'right'))}>
              <Merge className="h-3.5 w-3.5" />
              Merge right
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(mergeTableCell(tableData, selectedCell.rowIndex, selectedCell.columnIndex, 'down'))}>
              <Merge className="h-3.5 w-3.5 rotate-90" />
              Merge down
            </button>
            <button type="button" className="builder-table-tool" onClick={() => saveTable(splitTableCell(tableData, selectedCell.rowIndex, selectedCell.columnIndex))}>
              <SplitSquareVertical className="h-3.5 w-3.5" />
              Split
            </button>
          </>
        )}
      </div>
      {selectedCell && selectedTableCell && !selectedTableCell.hidden && (
        <div className="mt-3 grid gap-3 rounded-2xl border border-[#ebf0f5] bg-white p-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Alignment</div>
            <div className="flex overflow-hidden rounded-xl border border-[#e2e8f0]">
              {(['left', 'center', 'right'] as const).map((align) => {
                const Icon = alignIcons[align];
                return (
                  <button
                    key={align}
                    type="button"
                    className={cn(
                      'flex-1 px-3 py-2 text-[#64748b] transition-colors hover:bg-[#f8fafc]',
                      (selectedTableCell.textAlign || 'left') === align && 'bg-[#fff1f4] text-[#e31c58]',
                    )}
                    onClick={() => updateCellStyle({ textAlign: align })}
                  >
                    <Icon className="mx-auto h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
          <label className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Fill</span>
            <input
              type="color"
              value={selectedTableCell.backgroundColor || '#ffffff'}
              onChange={(event) => updateCellStyle({ backgroundColor: event.target.value })}
              className="h-10 w-full rounded-xl border border-[#e2e8f0] bg-white p-1"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Text</span>
            <input
              type="color"
              value={selectedTableCell.textColor || '#0f172a'}
              onChange={(event) => updateCellStyle({ textColor: event.target.value })}
              className="h-10 w-full rounded-xl border border-[#e2e8f0] bg-white p-1"
            />
          </label>
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Weight</div>
            <div className="flex overflow-hidden rounded-xl border border-[#e2e8f0]">
              {(['normal', 'medium', 'semibold', 'bold'] as const).map((weight) => (
                <button
                  key={weight}
                  type="button"
                  className={cn(
                    'flex-1 px-2 py-2 text-[11px] capitalize text-[#475569] transition-colors hover:bg-[#f8fafc]',
                    (selectedTableCell.fontWeight || 'normal') === weight && 'bg-[#fff1f4] text-[#e31c58]',
                  )}
                  onClick={() => updateCellStyle({ fontWeight: weight })}
                >
                  {weight.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Vertical</div>
            <div className="flex overflow-hidden rounded-xl border border-[#e2e8f0]">
              {(['top', 'middle', 'bottom'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    'flex-1 px-2 py-2 text-[11px] capitalize text-[#475569] transition-colors hover:bg-[#f8fafc]',
                    (selectedTableCell.verticalAlign || 'top') === value && 'bg-[#fff1f4] text-[#e31c58]',
                  )}
                  onClick={() => updateCellStyle({ verticalAlign: value })}
                >
                  {value.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;

  if (tableData.rows.length === 0 || tableData.columns.length === 0) {
    return (
      <div className="space-y-4">
        {renderToolbar}
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d7e0ea] bg-[radial-gradient(circle_at_top,#ffffff,rgba(248,250,252,0.96))] px-6 text-center text-[#64748b]">
          <GripVertical className="mb-3 h-10 w-10 opacity-40" />
          <div className="text-sm font-semibold text-[#0f172a]">Empty table block</div>
          <div className="mt-1 text-xs">Add rows and columns to start building a comparison or data table.</div>
          {interactive && (
            <button type="button" className="builder-table-tool mt-4" onClick={() => saveTable(addTableColumn(addTableRow(tableData)))}>
              <Plus className="h-3.5 w-3.5" />
              Create starter table
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="builder-table-block space-y-4">
      {renderToolbar}
      <div
        className="builder-table-shell overflow-hidden border bg-white shadow-[0_16px_46px_rgba(15,23,42,0.08)]"
        style={{
          borderColor,
          borderStyle,
          borderRadius: tableRadius,
        }}
      >
        <div className="max-w-full overflow-x-auto overscroll-x-contain">
          <table className="builder-table min-w-full border-separate border-spacing-0 text-sm">
            <colgroup>
              {tableData.columns.map((column, index) => (
                <col key={column.id} style={{ width: column.width || '220px', minWidth: index === 0 ? '180px' : '160px' }} />
              ))}
            </colgroup>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {row.cells.map((cell, columnIndex) => {
                    if (cell.hidden) return null;

                    const isHeaderCell = (headerRow && rowIndex === 0) || (headerColumn && columnIndex === 0);
                    const isSelected = selectedCell?.rowIndex === rowIndex && selectedCell?.columnIndex === columnIndex;
                    const CellTag = isHeaderCell ? 'th' : 'td';
                    const stickyTop = stickyHeader && headerRow && rowIndex === 0;
                    const stickyLeft = stickyFirstColumn && columnIndex === 0;
                    const background = cell.backgroundColor
                      || (isHeaderCell ? headerBackgroundColor : props.striped !== false && rowIndex % 2 === 1 ? stripedColor : cellBackgroundColor);

                    return (
                      <CellTag
                        key={cell.id}
                        colSpan={cell.colSpan || 1}
                        rowSpan={cell.rowSpan || 1}
                        className={cn(
                          'relative border-b border-r text-left align-top transition-colors',
                          stickyTop && 'sticky top-0 z-[3]',
                          stickyLeft && 'sticky left-0 z-[2]',
                          stickyTop && stickyLeft && 'z-[4]',
                          interactive && 'outline-none focus:ring-2 focus:ring-[#e31c58]/30',
                          isSelected && 'ring-2 ring-inset ring-[#e31c58]',
                        )}
                        style={{
                          padding: cellPadding,
                          borderColor,
                          backgroundColor: background,
                          textAlign: (cell.textAlign || props.textAlign || 'left') as React.CSSProperties['textAlign'],
                          verticalAlign: (cell.verticalAlign || 'top') as React.CSSProperties['verticalAlign'],
                          color: cell.textColor || '#334155',
                          fontWeight: cell.fontWeight === 'bold' ? 700 : cell.fontWeight === 'semibold' ? 600 : cell.fontWeight === 'medium' ? 500 : isHeaderCell ? 600 : 400,
                          boxShadow: stickyTop || stickyLeft ? '2px 0 0 rgba(255,255,255,0.92)' : undefined,
                        }}
                        onClick={() => {
                          if (interactive) {
                            setSelectedCell({ rowIndex, columnIndex });
                            onSelect();
                          }
                        }}
                      >
                        {interactive ? (
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            className="min-h-[1.2em] outline-none"
                            onFocus={onSelect}
                            onBlur={(event: React.FocusEvent<HTMLDivElement>) => {
                              const nextTable = updateTableCell(tableData, rowIndex, columnIndex, (current) => ({
                                ...current,
                                content: event.currentTarget.innerHTML,
                              }));
                              saveTable(nextTable);
                            }}
                            dangerouslySetInnerHTML={{ __html: cell.content || '' }}
                          />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: cell.content || '&nbsp;' }} />
                        )}
                        {interactive && headerRow && rowIndex === 0 && (
                          <span
                            className="absolute right-0 top-0 h-full w-2 cursor-col-resize opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              const initialWidth = parseInt(tableData.columns[columnIndex]?.width || '220', 10) || 220;
                              const startX = event.clientX;
                              const onMove = (moveEvent: MouseEvent) => {
                                const width = Math.max(120, initialWidth + moveEvent.clientX - startX);
                                saveTable(setTableColumnWidth(tableData, columnIndex, `${width}px`));
                              };
                              const onUp = () => {
                                window.removeEventListener('mousemove', onMove);
                                window.removeEventListener('mouseup', onUp);
                              };
                              window.addEventListener('mousemove', onMove);
                              window.addEventListener('mouseup', onUp);
                            }}
                          />
                        )}
                      </CellTag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {interactive && (
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748b]">
          <button type="button" className="builder-table-pill" onClick={() => onChange({ stickyHeader: !stickyHeader })}>
            {stickyHeader ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            Sticky header
          </button>
          <button type="button" className="builder-table-pill" onClick={() => onChange({ stickyFirstColumn: !stickyFirstColumn })}>
            {stickyFirstColumn ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            Sticky first column
          </button>
          <button type="button" className="builder-table-pill" onClick={() => onChange({ striped: props.striped === false })}>
            {props.striped === false ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            Zebra rows
          </button>
          <button type="button" className="builder-table-pill" onClick={() => onChange({ headerRow: !headerRow })}>
            <PanelTop className="h-3 w-3" />
            Header row
          </button>
          <button type="button" className="builder-table-pill" onClick={() => onChange({ headerColumn: !headerColumn })}>
            <Columns2 className="h-3 w-3" />
            Header column
          </button>
        </div>
      )}
    </div>
  );
}
