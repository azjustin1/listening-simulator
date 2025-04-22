import React, { useEffect, useState } from "react";
interface FillInTableComponentProps {
  initialData: string[][];
  onChange: (data: string[][]) => void;
}

const FillInTableComponent: React.FC<FillInTableComponentProps> = ({
  initialData,
  onChange,
}) => {
  const [rows, setRows] = useState<string[][]>(initialData);
  const [menuPosition, setMenuPosition] = useState<{
    rowIndex: number;
    colIndex: number;
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    onChange(rows);
  }, [rows, onChange]);
  const addRow = (rowIndex: number, position: "above" | "below") => {
    const newRows = [...rows];
    const newRow = Array(newRows[0].length).fill("");
    if (position === "above") {
      newRows.splice(rowIndex, 0, newRow);
    } else {
      newRows.splice(rowIndex + 1, 0, newRow);
    }
    setRows(newRows);
    setMenuPosition(null); // Close menu after adding row
  };
  const addColumn = (colIndex: number, position: "left" | "right") => {
    const newRows = rows.map((row) => {
      const newRow = [...row];
      if (position === "left") {
        newRow.splice(colIndex, 0, "");
      } else {
        newRow.splice(colIndex + 1, 0, "");
      }
      return newRow;
    });
    setRows(newRows);
    setMenuPosition(null); // Close menu after adding column
  };
  const handleChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };
  const showMenu = (
    rowIndex: number,
    colIndex: number,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    setMenuPosition({ rowIndex, colIndex, x: event.clientX, y: event.clientY });
  };
  return (
    <div style={{ position: "relative" }}>
      <table>
        <thead>
          <tr>
            {rows[0].map((_, colIndex) => (
              <th
                key={colIndex}
                onContextMenu={(e) => showMenu(-1, colIndex, e)}
              >
                Column {colIndex + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} onContextMenu={(e) => showMenu(rowIndex, -1, e)}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) =>
                      handleChange(rowIndex, colIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {menuPosition && (
        <div
          style={{
            position: "absolute",
            left: menuPosition.x,
            top: menuPosition.y,
            background: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
          {menuPosition.rowIndex === -1 ? (
            <>
              <button onClick={() => addColumn(menuPosition.colIndex, "left")}>
                Add Column Left
              </button>
              <button onClick={() => addColumn(menuPosition.colIndex, "right")}>
                Add Column Right
              </button>
            </>
          ) : (
            <>
              <button onClick={() => addRow(menuPosition.rowIndex, "above")}>
                Add Row Above
              </button>
              <button onClick={() => addRow(menuPosition.rowIndex, "below")}>
                Add Row Below
              </button>
            </>
          )}
          <button onClick={() => setMenuPosition(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
export default FillInTableComponent;
