import { v4 as uuidv4 } from 'uuid';

export type TableTextAlign = 'left' | 'center' | 'right';
export type TableVerticalAlign = 'top' | 'middle' | 'bottom';
export type TableFontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TableBorderStyle = 'solid' | 'dashed' | 'none';

export interface TableCellData {
  id: string;
  content: string;
  colSpan?: number;
  rowSpan?: number;
  hidden?: boolean;
  masterId?: string;
  textAlign?: TableTextAlign;
  verticalAlign?: TableVerticalAlign;
  backgroundColor?: string;
  textColor?: string;
  fontWeight?: TableFontWeight;
}

export interface TableColumnData {
  id: string;
  width?: string;
}

export interface TableRowData {
  id: string;
  cells: TableCellData[];
}

export interface TableData {
  columns: TableColumnData[];
  rows: TableRowData[];
}

export interface TableBlockPropsLike {
  tableData?: unknown;
  headers?: unknown;
  rows?: unknown;
}

export interface NormalizedTableProps extends Record<string, unknown> {
  tableData: TableData;
  headers: string[];
  rows: string[][];
}

export function createEmptyCell(content = ''): TableCellData {
  return {
    id: uuidv4(),
    content,
    colSpan: 1,
    rowSpan: 1,
    textAlign: 'left',
    verticalAlign: 'top',
    fontWeight: 'normal',
  };
}

function createEmptyColumn(): TableColumnData {
  return {
    id: uuidv4(),
    width: '220px',
  };
}

function createEmptyRow(columnCount: number): TableRowData {
  return {
    id: uuidv4(),
    cells: Array.from({ length: Math.max(1, columnCount) }, () => createEmptyCell()),
  };
}

function clampSpan(value: unknown, max: number) {
  const parsed = typeof value === 'number' ? value : parseInt(String(value ?? '1'), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, max);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : String(value ?? '');
}

function sanitizeCell(cell: unknown): TableCellData {
  if (!cell || typeof cell !== 'object') {
    return createEmptyCell();
  }

  const source = cell as Partial<TableCellData>;
  return {
    id: typeof source.id === 'string' && source.id ? source.id : uuidv4(),
    content: asString(source.content),
    colSpan: clampSpan(source.colSpan, 99),
    rowSpan: clampSpan(source.rowSpan, 99),
    hidden: Boolean(source.hidden),
    masterId: typeof source.masterId === 'string' ? source.masterId : undefined,
    textAlign: ['left', 'center', 'right'].includes(String(source.textAlign)) ? (source.textAlign as TableTextAlign) : 'left',
    verticalAlign: ['top', 'middle', 'bottom'].includes(String(source.verticalAlign)) ? (source.verticalAlign as TableVerticalAlign) : 'top',
    backgroundColor: typeof source.backgroundColor === 'string' ? source.backgroundColor : undefined,
    textColor: typeof source.textColor === 'string' ? source.textColor : undefined,
    fontWeight: ['normal', 'medium', 'semibold', 'bold'].includes(String(source.fontWeight))
      ? (source.fontWeight as TableFontWeight)
      : 'normal',
  };
}

function buildTableFromLegacy(props: TableBlockPropsLike): TableData {
  const headers = Array.isArray(props.headers) ? props.headers.map(asString) : ['Column 1', 'Column 2'];
  const legacyRows = Array.isArray(props.rows)
    ? props.rows.map((row) => (Array.isArray(row) ? row.map(asString) : []))
    : [['', ''], ['', '']];

  const colCount = Math.max(1, headers.length, ...legacyRows.map((row) => row.length));
  const columns = Array.from({ length: colCount }, (_, index) => ({
    id: uuidv4(),
    width: '220px',
    label: headers[index] || `Column ${index + 1}`,
  })) as TableColumnData[];

  const headerRow: TableRowData = {
    id: uuidv4(),
    cells: Array.from({ length: colCount }, (_, index) => createEmptyCell(headers[index] || `Column ${index + 1}`)),
  };

  const rows = legacyRows.length > 0 ? legacyRows : [['', '']];

  return {
    columns,
    rows: [headerRow, ...rows.map((row) => ({
      id: uuidv4(),
      cells: Array.from({ length: colCount }, (_, index) => createEmptyCell(row[index] || '')),
    }))],
  };
}

export function normalizeTableData(input: unknown): TableData {
  const fallback = buildTableFromLegacy({});
  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const source = input as Partial<TableData>;
  const columnCount = Math.max(1, Array.isArray(source.columns) ? source.columns.length : 0);
  const columns = (Array.isArray(source.columns) ? source.columns : Array.from({ length: columnCount }, () => createEmptyColumn())).map((column) => ({
    id: typeof column?.id === 'string' && column.id ? column.id : uuidv4(),
    width: typeof column?.width === 'string' && column.width ? column.width : '220px',
  }));

  const sourceRows = Array.isArray(source.rows) && source.rows.length > 0 ? source.rows : [createEmptyRow(columns.length)];
  const seededRows: TableRowData[] = sourceRows.map((row) => ({
    id: typeof row?.id === 'string' && row.id ? row.id : uuidv4(),
    cells: Array.from({ length: columns.length }, (_, columnIndex) => sanitizeCell(row?.cells?.[columnIndex])),
  }));

  const covered = new Set<string>();
  const normalizedRows: TableRowData[] = seededRows.map((row, rowIndex) => ({
    id: row.id,
    cells: row.cells.map((cell, columnIndex) => {
      const key = `${rowIndex}:${columnIndex}`;
      if (covered.has(key)) {
        return {
          ...createEmptyCell(),
          hidden: true,
        };
      }

      const colSpan = clampSpan(cell.colSpan, columns.length - columnIndex);
      const rowSpan = clampSpan(cell.rowSpan, seededRows.length - rowIndex);

      for (let y = rowIndex; y < rowIndex + rowSpan; y += 1) {
        for (let x = columnIndex; x < columnIndex + colSpan; x += 1) {
          if (y === rowIndex && x === columnIndex) continue;
          covered.add(`${y}:${x}`);
        }
      }

      return {
        ...cell,
        hidden: false,
        masterId: undefined,
        colSpan,
        rowSpan,
      };
    }),
  }));

  for (let rowIndex = 0; rowIndex < normalizedRows.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
      const key = `${rowIndex}:${columnIndex}`;
      if (!covered.has(key)) continue;

      let masterId: string | undefined;
      for (let y = rowIndex; y >= 0 && !masterId; y -= 1) {
        for (let x = columnIndex; x >= 0; x -= 1) {
          const candidate = normalizedRows[y]?.cells?.[x];
          if (!candidate || candidate.hidden) continue;
          const endX = x + (candidate.colSpan ?? 1) - 1;
          const endY = y + (candidate.rowSpan ?? 1) - 1;
          if (columnIndex <= endX && rowIndex <= endY) {
            masterId = candidate.id;
            break;
          }
        }
      }

      normalizedRows[rowIndex].cells[columnIndex] = {
        ...createEmptyCell(),
        hidden: true,
        masterId,
      };
    }
  }

  return { columns, rows: normalizedRows };
}

export function normalizeTableProps(props: TableBlockPropsLike & Record<string, unknown>): NormalizedTableProps {
  const normalizedTable = normalizeTableData(props.tableData ?? buildTableFromLegacy(props));
  const headerIndex = props.headerRow === false ? -1 : 0;
  const headers =
    headerIndex === 0
      ? normalizedTable.rows[0]?.cells.map((cell) => cell.content || '') ?? []
      : normalizedTable.columns.map((_, index) => `Column ${index + 1}`);
  const rows = normalizedTable.rows
    .slice(headerIndex === 0 ? 1 : 0)
    .map((row) => row.cells.map((cell) => cell.content || ''));

  return {
    ...props,
    tableData: normalizedTable,
    headers,
    rows,
  };
}

export function flattenTableData(table: TableData): TableData {
  const normalized = normalizeTableData(table);

  const visibleCellMap = new Map<string, TableCellData>();
  normalized.rows.forEach((row, rowIndex) => {
    row.cells.forEach((cell, columnIndex) => {
      if (!cell.hidden) {
        visibleCellMap.set(`${rowIndex}:${columnIndex}`, cell);
      }
    });
  });

  return {
    columns: normalized.columns.map((column) => ({ ...column })),
    rows: normalized.rows.map((row, rowIndex) => ({
      id: row.id,
      cells: row.cells.map((cell, columnIndex) => {
        if (!cell.hidden) {
          return {
            ...cell,
            id: uuidv4(),
            colSpan: 1,
            rowSpan: 1,
            hidden: false,
            masterId: undefined,
          };
        }

        const master = findMasterCell(normalized, rowIndex, columnIndex) ?? visibleCellMap.get(`${rowIndex}:${columnIndex}`);
        return {
          ...(master ? { ...master } : createEmptyCell()),
          id: uuidv4(),
          colSpan: 1,
          rowSpan: 1,
          hidden: false,
          masterId: undefined,
        };
      }),
    })),
  };
}

export function findMasterCell(table: TableData, rowIndex: number, columnIndex: number): TableCellData | null {
  const normalized = normalizeTableData(table);
  for (let y = rowIndex; y >= 0; y -= 1) {
    for (let x = columnIndex; x >= 0; x -= 1) {
      const cell = normalized.rows[y]?.cells[x];
      if (!cell || cell.hidden) continue;
      const endX = x + (cell.colSpan ?? 1) - 1;
      const endY = y + (cell.rowSpan ?? 1) - 1;
      if (columnIndex <= endX && rowIndex <= endY) {
        return cell;
      }
    }
  }
  return null;
}

export function updateTableCell(
  table: TableData,
  rowIndex: number,
  columnIndex: number,
  updater: (cell: TableCellData) => TableCellData,
): TableData {
  const normalized = normalizeTableData(table);
  const cell = normalized.rows[rowIndex]?.cells[columnIndex];
  if (!cell) return normalized;
  const target = cell.hidden ? findMasterCell(normalized, rowIndex, columnIndex) : cell;
  if (!target) return normalized;

  return normalizeTableData({
    columns: normalized.columns,
    rows: normalized.rows.map((row) => ({
      ...row,
      cells: row.cells.map((candidate) => (candidate.id === target.id ? updater(candidate) : candidate)),
    })),
  });
}

export function splitTableCell(table: TableData, rowIndex: number, columnIndex: number): TableData {
  const normalized = normalizeTableData(table);
  const flat = flattenTableData(normalized);
  return normalizeTableData(flat);
}

export function mergeTableCell(table: TableData, rowIndex: number, columnIndex: number, direction: 'right' | 'down'): TableData {
  const normalized = normalizeTableData(table);
  const target = normalized.rows[rowIndex]?.cells[columnIndex];
  if (!target || target.hidden) return normalized;

  if (direction === 'right') {
    const nextIndex = columnIndex + (target.colSpan ?? 1);
    const adjacent = normalized.rows[rowIndex]?.cells[nextIndex];
    if (!adjacent || adjacent.hidden) return normalized;
    return normalizeTableData({
      columns: normalized.columns,
      rows: normalized.rows.map((row, rIndex) => ({
        ...row,
        cells: row.cells.map((cell, cIndex) => {
          if (rIndex === rowIndex && cIndex === columnIndex) {
            return { ...cell, colSpan: (cell.colSpan ?? 1) + (adjacent.colSpan ?? 1) };
          }
          return cell;
        }),
      })),
    });
  }

  const nextRowIndex = rowIndex + (target.rowSpan ?? 1);
  const adjacent = normalized.rows[nextRowIndex]?.cells[columnIndex];
  if (!adjacent || adjacent.hidden) return normalized;

  return normalizeTableData({
    columns: normalized.columns,
    rows: normalized.rows.map((row, rIndex) => ({
      ...row,
      cells: row.cells.map((cell, cIndex) => {
        if (rIndex === rowIndex && cIndex === columnIndex) {
          return { ...cell, rowSpan: (cell.rowSpan ?? 1) + (adjacent.rowSpan ?? 1) };
        }
        return cell;
      }),
    })),
  });
}

export function addTableRow(table: TableData, index = normalizeTableData(table).rows.length): TableData {
  const flat = flattenTableData(table);
  const nextRows = [...flat.rows];
  nextRows.splice(index, 0, createEmptyRow(flat.columns.length));
  return normalizeTableData({ columns: flat.columns, rows: nextRows });
}

export function removeTableRow(table: TableData, rowIndex: number): TableData {
  const flat = flattenTableData(table);
  if (flat.rows.length <= 1) return flat;
  return normalizeTableData({
    columns: flat.columns,
    rows: flat.rows.filter((_, index) => index !== rowIndex),
  });
}

export function duplicateTableRow(table: TableData, rowIndex: number): TableData {
  const flat = flattenTableData(table);
  const row = flat.rows[rowIndex];
  if (!row) return flat;
  const duplicate: TableRowData = {
    id: uuidv4(),
    cells: row.cells.map((cell) => ({ ...cell, id: uuidv4() })),
  };
  const nextRows = [...flat.rows];
  nextRows.splice(rowIndex + 1, 0, duplicate);
  return normalizeTableData({ columns: flat.columns, rows: nextRows });
}

export function moveTableRow(table: TableData, rowIndex: number, direction: 'up' | 'down'): TableData {
  const flat = flattenTableData(table);
  const targetIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1;
  if (targetIndex < 0 || targetIndex >= flat.rows.length) return flat;
  const nextRows = [...flat.rows];
  const [moved] = nextRows.splice(rowIndex, 1);
  nextRows.splice(targetIndex, 0, moved);
  return normalizeTableData({ columns: flat.columns, rows: nextRows });
}

export function addTableColumn(table: TableData, index = normalizeTableData(table).columns.length): TableData {
  const flat = flattenTableData(table);
  const nextColumns = [...flat.columns];
  nextColumns.splice(index, 0, createEmptyColumn());
  const nextRows = flat.rows.map((row) => ({
    ...row,
    cells: [
      ...row.cells.slice(0, index),
      createEmptyCell(),
      ...row.cells.slice(index),
    ],
  }));
  return normalizeTableData({ columns: nextColumns, rows: nextRows });
}

export function removeTableColumn(table: TableData, columnIndex: number): TableData {
  const flat = flattenTableData(table);
  if (flat.columns.length <= 1) return flat;
  return normalizeTableData({
    columns: flat.columns.filter((_, index) => index !== columnIndex),
    rows: flat.rows.map((row) => ({
      ...row,
      cells: row.cells.filter((_, index) => index !== columnIndex),
    })),
  });
}

export function duplicateTableColumn(table: TableData, columnIndex: number): TableData {
  const flat = flattenTableData(table);
  const column = flat.columns[columnIndex];
  if (!column) return flat;
  const nextColumns = [...flat.columns];
  nextColumns.splice(columnIndex + 1, 0, { ...column, id: uuidv4() });
  const nextRows = flat.rows.map((row) => {
    const source = row.cells[columnIndex];
    return {
      ...row,
      cells: [
        ...row.cells.slice(0, columnIndex + 1),
        source ? { ...source, id: uuidv4() } : createEmptyCell(),
        ...row.cells.slice(columnIndex + 1),
      ],
    };
  });
  return normalizeTableData({ columns: nextColumns, rows: nextRows });
}

export function moveTableColumn(table: TableData, columnIndex: number, direction: 'left' | 'right'): TableData {
  const flat = flattenTableData(table);
  const targetIndex = direction === 'left' ? columnIndex - 1 : columnIndex + 1;
  if (targetIndex < 0 || targetIndex >= flat.columns.length) return flat;

  const nextColumns = [...flat.columns];
  const [movedColumn] = nextColumns.splice(columnIndex, 1);
  nextColumns.splice(targetIndex, 0, movedColumn);

  const nextRows = flat.rows.map((row) => {
    const nextCells = [...row.cells];
    const [movedCell] = nextCells.splice(columnIndex, 1);
    nextCells.splice(targetIndex, 0, movedCell);
    return { ...row, cells: nextCells };
  });

  return normalizeTableData({ columns: nextColumns, rows: nextRows });
}

export function setTableColumnWidth(table: TableData, columnIndex: number, width: string): TableData {
  const normalized = normalizeTableData(table);
  return {
    ...normalized,
    columns: normalized.columns.map((column, index) => (index === columnIndex ? { ...column, width } : column)),
  };
}

export function toLegacyTableProps(table: TableData) {
  const normalized = normalizeTableData(table);
  const headers = normalized.rows[0]?.cells.map((cell) => cell.content || '') ?? [];
  const rows = normalized.rows.slice(1).map((row) => row.cells.map((cell) => cell.content || ''));
  return { headers, rows };
}
