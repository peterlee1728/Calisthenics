# Chilli Farm Management Workbook

Excel workbook mapped to the **9-domain Successful Chilli Farm** framework (Cili Kulai, polybag, Malaysia).

## File

- **`Chilli_Farm_Management_Workbook.xlsx`** — open in Excel, Google Sheets, or LibreOffice

## Sheets

| Sheet | Purpose |
|---|---|
| `00_README` | How to use this workbook |
| `01_DASHBOARD` | KPIs, targets, domain health scores |
| `02_DAILY_CHECKLIST` | 14 daily tasks across all domains |
| `03_WEEKLY_CHECKLIST` | 18 weekly review tasks |
| `04_CYCLE_CHECKLIST` | 38 stage-gate tasks (sow → harvest → reset) |
| `05_PRODUCTION` | Per-plant / per-bag tracker |
| `06_FINANCIALS` | CAPEX & OPEX log |
| `07_WATER_FERTILIZER` | EC, pH, volume, feed log |
| `08_PEST_DISEASE` | Scouting, treatment, loss log |
| `09_HARVEST_QUALITY` | Pick, grade, reject log |
| `10_MARKET_SALES` | Buyers, price, revenue |
| `11_SCALING_ROADMAP` | Start small → prove profit → expand |
| `12_MASTER_INDEX` | All 81 goals mapped to sheets |

## Regenerate

```bash
python3 generate_farm_workbook.py
```

Requires: `openpyxl`

## Tip

Duplicate the `.xlsx` file per crop cycle (e.g. `Chilli_Cycle1_2026.xlsx`).
