import {
  CONTRACT_TERMS_RETAKE_COLUMNS,
  CONTRACT_TERMS_RETAKE_ROWS,
  CONTRACT_TERMS_SEMESTER_TITLE,
  CONTRACT_TERMS_TABLE_BODY_CELL_CLASS,
  CONTRACT_TERMS_TABLE_BORDER_STYLE,
  CONTRACT_TERMS_TABLE_CLASS,
  CONTRACT_TERMS_TABLE_HEADER_CELL_CLASS,
  CONTRACT_TERMS_TABLE_SECTION_CLASS,
  CONTRACT_TERMS_TABLE_SECTION_TITLE_CLASS,
  CONTRACT_TERMS_TABLE_WRAPPER_CLASS,
  type ContractTermsRetakeRow,
} from "./constants";

function ContractTermsRetakeTableRow({ row }: { row: ContractTermsRetakeRow }) {
  return (
    <tr>
      {CONTRACT_TERMS_RETAKE_COLUMNS.map((column) => (
        <td key={`${row.subject}-${column.key}`} className={CONTRACT_TERMS_TABLE_BODY_CELL_CLASS} style={CONTRACT_TERMS_TABLE_BORDER_STYLE}>
          {row[column.key]}
        </td>
      ))}
    </tr>
  );
}

export function ContractTermsRetakeTable() {
  return (
    <div className={CONTRACT_TERMS_TABLE_SECTION_CLASS}>
      <p className={CONTRACT_TERMS_TABLE_SECTION_TITLE_CLASS}>{CONTRACT_TERMS_SEMESTER_TITLE}</p>

      <div className={CONTRACT_TERMS_TABLE_WRAPPER_CLASS}>
        <table className={CONTRACT_TERMS_TABLE_CLASS} style={CONTRACT_TERMS_TABLE_BORDER_STYLE}>
          <thead>
            <tr>
              {CONTRACT_TERMS_RETAKE_COLUMNS.map((column) => (
                <th key={column.key} className={CONTRACT_TERMS_TABLE_HEADER_CELL_CLASS} style={CONTRACT_TERMS_TABLE_BORDER_STYLE}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONTRACT_TERMS_RETAKE_ROWS.map((row) => (
              <ContractTermsRetakeTableRow key={row.subject} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
