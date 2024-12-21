import * as React from "react";
import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { RawJson } from "./RawData";

export default function StockMarketGrid() {
    // Mapping raw data to ensure each row has a unique `id`
    const rawRows = RawJson[0].Sheet1.map((row, index) => ({
        ...row,
        id: index + 1,
    }));

    const [rows, setRows] = useState(rawRows);
    const [filteredRows, setFilteredRows] = useState(rawRows);
    const [filters, setFilters] = useState({
        mcapFrom: "",
        mcapTo: "",
        avFrom: "",
        avTo: "",
    });

    // Handle range filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [name]: value };
            applyFilters(updatedFilters);
            return updatedFilters;
        });
    };

    // Apply filters to rows
    const applyFilters = (newFilters) => {
        const { mcapFrom, mcapTo, avFrom, avTo } = newFilters;

        const filteredData = rawRows.filter((row) => {
            const mcap = row.mcap;
            const av = row.AV;

            const mcapValid =
                (mcapFrom === "" || mcap >= parseFloat(mcapFrom)) &&
                (mcapTo === "" || mcap <= parseFloat(mcapTo));
            const avValid =
                (avFrom === "" || av >= parseFloat(avFrom)) &&
                (avTo === "" || av <= parseFloat(avTo));

            return mcapValid && avValid;
        });

        setFilteredRows(filteredData);
    };

    const columns = [
        {
            field: "symbol",
            headerName: "Symbol",
            width: 400,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "mcap",
            headerName: "Market Cap",
            width: 400,
            headerAlign: "center",
            align: "center",
            valueFormatter: ({ value }) => new Intl.NumberFormat().format(value),
        },
        {
            field: "AV",
            headerName: "AV",
            width: 400,
            headerAlign: "center",
            align: "center",
            valueFormatter: ({ value }) => value.toFixed(4),
        },
    ];

    return (
        <div>
            <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                fontFamily: 'Arial, sans-serif'
            }}>
                <h1 style={{
                    fontSize: '3em',
                    fontWeight: 'bold',
                    letterSpacing: '2px'
                }}>
                    Stock Market Research
                </h1>
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h3>Apply Filters</h3>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="number"
                        name="mcapFrom"
                        value={filters.mcapFrom}
                        onChange={handleFilterChange}
                        placeholder="Market Cap From"
                        style={{ marginRight: '10px' }}
                    />
                    <input
                        type="number"
                        name="mcapTo"
                        value={filters.mcapTo}
                        onChange={handleFilterChange}
                        placeholder="Market Cap To"
                        style={{ marginRight: '10px' }}
                    />
                    <input
                        type="number"
                        name="avFrom"
                        value={filters.avFrom}
                        onChange={handleFilterChange}
                        placeholder="AV From"
                        style={{ marginRight: '10px' }}
                    />
                    <input
                        type="number"
                        name="avTo"
                        value={filters.avTo}
                        onChange={handleFilterChange}
                        placeholder="AV To"
                        style={{ marginRight: '10px' }}
                    />
                </div>
            </div>
            <div style={{ height: 300, width: '100%' }}><DataGrid
                columns={columns}
                rows={filteredRows}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                autoHeight
                components={{ Toolbar: GridToolbar }}
            /></div>
        </div>
    );
}
