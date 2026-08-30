#!/usr/bin/env python3
"""Generate Chilli Farm Management Excel workbook mapped to 9-domain framework."""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from datetime import date

OUTPUT = "/workspace/chilli-farm/Chilli_Farm_Management_Workbook.xlsx"

# Colour palette
HEADER_FILL = PatternFill("solid", fgColor="1F4E79")
DOMAIN_FILLS = {
    "1. Production": "E2EFDA",
    "2. Financials": "FFF2CC",
    "3. Farm Management": "DDEBF7",
    "4. Water & Fertilizer": "D9E1F2",
    "5. Pest & Disease": "FCE4D6",
    "6. Harvest & Quality": "E4DFEC",
    "7. Market & Sales": "F8CBAD",
    "8. Data & Technology": "D0CECE",
    "9. Scaling": "C6E0B4",
}
HEADER_FONT = Font(bold=True, color="FFFFFF", size=11)
TITLE_FONT = Font(bold=True, size=14, color="1F4E79")
BOLD = Font(bold=True)
THIN = Side(style="thin", color="B4B4B4")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
STATUS_LIST = '"Pending,Done,Skip,N/A,Issue"'


def style_header_row(ws, row, cols, fill=HEADER_FILL):
    for c in range(1, cols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = fill
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER


def auto_width(ws, widths):
    for col, w in widths.items():
        ws.column_dimensions[col].width = w


def add_status_validation(ws, col_letter, start_row, end_row):
    dv = DataValidation(type="list", formula1=STATUS_LIST, allow_blank=True)
    dv.error = "Choose: Pending, Done, Skip, N/A, Issue"
    ws.add_data_validation(dv)
    dv.add(f"{col_letter}{start_row}:{col_letter}{end_row}")


def sheet_readme(wb):
    ws = wb.active
    ws.title = "00_README"
    ws["A1"] = "🌶️ CHILLI FARM MANAGEMENT WORKBOOK"
    ws["A1"].font = Font(bold=True, size=16, color="C00000")
    ws["A3"] = "Mapped to 9-Domain Success Framework | Cili Kulai Polybag | Malaysia"
    ws["A5"] = "HOW TO USE"
    ws["A5"].font = TITLE_FONT
    instructions = [
        ("1", "Start on sheet 01_DASHBOARD — enter farm name, cycle dates, plant count."),
        ("2", "Use 02_DAILY_CHECKLIST every morning (15 min). Mark Status: Done / Issue."),
        ("3", "Use 03_WEEKLY_CHECKLIST once per week (Sunday recommended)."),
        ("4", "Use 04_CYCLE_CHECKLIST at each crop stage gate (sow → transplant → harvest)."),
        ("5", "Log data in sheets 05–10 as events happen (water, pests, harvest, sales)."),
        ("6", "Review 01_DASHBOARD monthly — update KPIs and financial summary."),
        ("7", "Use 11_SCALING_ROADMAP when ready to expand beyond baseline."),
        ("8", "Sheet 12_MASTER_INDEX lists every item in the 9×9 framework."),
        ("", ""),
        ("TIP", "Duplicate this file per crop cycle: Chilli_Cycle1_2026.xlsx"),
        ("TIP", "Red 'Issue' status = action needed before next checklist."),
        ("TIP", "Targets are for ~50–200 polybag home/small farm. Adjust in Dashboard."),
    ]
    r = 6
    for step, text in instructions:
        ws.cell(r, 1, step).font = BOLD
        ws.cell(r, 2, text)
        r += 1

    ws["A22"] = "SHEET INDEX"
    ws["A22"].font = TITLE_FONT
    sheets = [
        ("01_DASHBOARD", "KPI summary, targets, financial snapshot"),
        ("02_DAILY_CHECKLIST", "Daily farm operations (9 domains)"),
        ("03_WEEKLY_CHECKLIST", "Weekly reviews and deeper checks"),
        ("04_CYCLE_CHECKLIST", "Stage-gate tasks: nursery → harvest → reset"),
        ("05_PRODUCTION", "Variety, density, growth stage tracker"),
        ("06_FINANCIALS", "CAPEX, OPEX, cost/kg, profit, ROI"),
        ("07_WATER_FERTILIZER", "EC, pH, volume, feed log"),
        ("08_PEST_DISEASE", "Scouting, ID, treatment, loss"),
        ("09_HARVEST_QUALITY", "Pick log, grading, rejects"),
        ("10_MARKET_SALES", "Buyers, price, quantity, revenue"),
        ("11_SCALING_ROADMAP", "Start small → prove profit → expand"),
        ("12_MASTER_INDEX", "Full 9-domain framework reference"),
    ]
    r = 23
    style_header_row(ws, r, 2)
    ws.cell(r, 1, "Sheet")
    ws.cell(r, 2, "Purpose")
    r += 1
    for name, purpose in sheets:
        ws.cell(r, 1, name)
        ws.cell(r, 2, purpose)
        r += 1
    auto_width(ws, {"A": 22, "B": 70})


def sheet_dashboard(wb):
    ws = wb.create_sheet("01_DASHBOARD")
    ws["A1"] = "FARM KPI DASHBOARD"
    ws["A1"].font = TITLE_FONT

    fields = [
        ("Farm / Operator", ""),
        ("Location", ""),
        ("Variety", "Cili Kulai"),
        ("Cycle #", "1"),
        ("Cycle Start (sow date)", ""),
        ("Transplant Date", ""),
        ("Target Harvest Start", ""),
        ("Number of Polybags", "100"),
        ("Plants Alive (current)", ""),
        ("Polybag Size (L)", "7"),
        ("Saleable Yield Target (kg)", ""),
        ("Sale Price Target (RM/kg)", "12"),
    ]
    r = 3
    style_header_row(ws, r, 2, PatternFill("solid", fgColor="2F5496"))
    ws.cell(r, 1, "Field")
    ws.cell(r, 2, "Value")
    r += 1
    for label, default in fields:
        ws.cell(r, 1, label).font = BOLD
        ws.cell(r, 2, default)
        r += 1
    value_row_start = 4
    value_row_end = r - 1

    r += 2
    ws.cell(r, 1, "LIVE KPIs (auto-calculated where linked)").font = TITLE_FONT
    r += 1
    style_header_row(ws, r, 4)
    headers = ["KPI", "Target", "Actual", "Status"]
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    r += 1

    kpis = [
        ("Plant survival rate (%)", "≥90%", "=IF(B8=0,\"\",IFERROR(B9/B8*100,\"\"))", ""),
        ("Saleable yield (kg total)", "=B12", "=SUM('09_HARVEST_QUALITY'!J:J)", ""),
        ("Yield per plant (kg)", "0.8–1.5", "=IF(B9=0,\"\",IFERROR(SUM('09_HARVEST_QUALITY'!J:J)/B9,\"\"))", ""),
        ("Total revenue (RM)", "", "=SUM('10_MARKET_SALES'!G:G)", ""),
        ("Total OPEX (RM)", "", "=SUM('06_FINANCIALS'!E:E)", ""),
        ("Total CAPEX (RM)", "", "=SUMIF('06_FINANCIALS'!C:C,\"CAPEX\",'06_FINANCIALS'!E:E)", ""),
        ("Cost per kg (RM)", "<8", "=IF(SUM('09_HARVEST_QUALITY'!J:J)=0,\"\",IFERROR(SUM('06_FINANCIALS'!E:E)/SUM('09_HARVEST_QUALITY'!J:J),\"\"))", ""),
        ("Cost per plant (RM)", "", "=IF(B9=0,\"\",IFERROR(SUM('06_FINANCIALS'!E:E)/B9,\"\"))", ""),
        ("Gross profit (RM)", ">0", "=IFERROR(SUM('10_MARKET_SALES'!G:G)-SUM('06_FINANCIALS'!E:E),\"\")", ""),
        ("Break-even kg", "", "=IF(B13=0,\"\",IFERROR(SUM('06_FINANCIALS'!E:E)/B13,\"\"))", ""),
        ("Reject rate (%)", "<10%", "=IF(SUM('09_HARVEST_QUALITY'!I:I)=0,\"\",IFERROR(SUM('09_HARVEST_QUALITY'!K:K)/SUM('09_HARVEST_QUALITY'!I:I)*100,\"\"))", ""),
        ("Pest/disease loss (%)", "<5%", "", ""),
    ]
    kpi_start = r
    for kpi, target, actual, status in kpis:
        ws.cell(r, 1, kpi)
        ws.cell(r, 2, target)
        ws.cell(r, 3, actual)
        ws.cell(r, 4, status)
        r += 1

    r += 2
    ws.cell(r, 1, "9-DOMAIN HEALTH SCORE (manual weekly 1–5)").font = TITLE_FONT
    r += 1
    style_header_row(ws, r, 3)
    ws.cell(r, 1, "Domain")
    ws.cell(r, 2, "Score (1–5)")
    ws.cell(r, 3, "Notes")
    r += 1
    for domain in DOMAIN_FILLS:
        ws.cell(r, 1, domain)
        ws.cell(r, 2, "")
        ws.cell(r, 3, "")
        ws.cell(r, 1).fill = PatternFill("solid", fgColor=DOMAIN_FILLS[domain])
        r += 1

    auto_width(ws, {"A": 32, "B": 18, "C": 22, "D": 14})


def sheet_checklist(wb, name, title, tasks):
    ws = wb.create_sheet(name)
    ws["A1"] = title
    ws["A1"].font = TITLE_FONT
    ws["A2"] = f"Date: ___________    Operator: ___________    Weather: ___________"

    headers = ["#", "Domain", "Category", "Task / Check", "Target / Standard", "Actual / Reading", "Status", "Notes / Action"]
    r = 4
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    r += 1

    for i, (domain, category, task, target) in enumerate(tasks, 1):
        ws.cell(r, 1, i)
        ws.cell(r, 2, domain)
        ws.cell(r, 3, category)
        ws.cell(r, 4, task)
        ws.cell(r, 5, target)
        ws.cell(r, 6, "")
        ws.cell(r, 7, "Pending")
        ws.cell(r, 8, "")
        fill = DOMAIN_FILLS.get(domain, "FFFFFF")
        ws.cell(r, 2).fill = PatternFill("solid", fgColor=fill)
        for c in range(1, 9):
            ws.cell(r, c).alignment = Alignment(wrap_text=True, vertical="top")
            ws.cell(r, c).border = BORDER
        r += 1

    add_status_validation(ws, "G", 5, r - 1)
    ws.freeze_panes = "A5"
    auto_width(ws, {"A": 5, "B": 20, "C": 18, "D": 45, "E": 28, "F": 16, "G": 12, "H": 30})


DAILY_TASKS = [
    ("3. Farm Management", "Daily checklist", "Walk all bags — note wilt, yellowing, pests", "All bags checked"),
    ("3. Farm Management", "Irrigation", "Finger-test media 3 cm deep; water if dry", "No waterlogging"),
    ("4. Water & Fertilizer", "Volume", "Record total water/fertigation per bag (ml)", "Per stage target"),
    ("4. Water & Fertilizer", "EC", "Check feed EC if fertigating (leachate sample)", "1.2–2.5 mS/cm"),
    ("4. Water & Fertilizer", "pH", "Check feed pH if meter available", "5.5–6.5"),
    ("5. Pest & Disease", "Scouting", "Check leaf undersides, new growth, fruit", "<5% plants affected"),
    ("5. Pest & Disease", "Detection", "Log any aphids, thrips, mites, snails", "Record in sheet 08"),
    ("1. Production", "Growth", "Note plant height/stage anomalies", "Uniform growth"),
    ("6. Harvest & Quality", "Harvest", "Pick mature fruit (green or red per market)", "Every 1–2 days in peak"),
    ("6. Harvest & Quality", "Rejects", "Separate damaged/rotten fruit — do not mix", "Reject bin separate"),
    ("8. Data & Technology", "Records", "Log harvest kg, water, issues in log sheets", "Same day entry"),
    ("3. Farm Management", "Maintenance", "Check stakes, drippers, shade net, drainage", "No blocked drippers"),
    ("7. Market & Sales", "Quantity", "Update today's harvest ready for sale (kg)", "Logged"),
    ("2. Financials", "Cash flow", "Record any purchases or sales today (RM)", "Logged in sheet 06/10"),
]

WEEKLY_TASKS = [
    ("4. Water & Fertilizer", "Salt flush", "Plain water flush 15–20% leachate all bags", "Once per week"),
    ("4. Water & Fertilizer", "Fertilizer", "Side-dress or adjust fertigation EC per stage", "Per schedule"),
    ("5. Pest & Disease", "Prevention", "Yellow sticky traps check / replace", "Traps clean"),
    ("5. Pest & Disease", "Monitoring", "Calculate % plants with pest/disease", "<5% threshold"),
    ("5. Pest & Disease", "Sanitation", "Remove dead leaves, fallen fruit, weeds", "Clean aisles"),
    ("1. Production", "Plant density", "Confirm 1 plant/bag; remove volunteers", "1 plant per bag"),
    ("1. Production", "Flowering/Fruit set", "Count flowers and small fruit per sample plant", "10 sample plants"),
    ("3. Farm Management", "SOP", "Review any deviations from SOP this week", "Document fixes"),
    ("6. Harvest & Quality", "Grading", "Review grade mix — adjust picking timing", "Grade A >70%"),
    ("6. Harvest & Quality", "Loss reduction", "Calculate weekly reject %", "<10%"),
    ("7. Market & Sales", "Buyers", "Contact buyers for next week's demand", "1+ buyer confirmed"),
    ("7. Market & Sales", "Price", "Check market price (wet market/wholesale)", "Logged"),
    ("2. Financials", "OPEX", "Sum weekly expenses", "Sheet 06 updated"),
    ("2. Financials", "Revenue", "Sum weekly sales", "Sheet 10 updated"),
    ("8. Data & Technology", "Analytics", "Update Dashboard KPIs", "Sheet 01 reviewed"),
    ("8. Data & Technology", "Weather", "Log rainfall, max temp, humidity notes", "Logged"),
    ("9. Scaling", "Measure", "Compare yield/cost to baseline targets", "On track?"),
    ("3. Farm Management", "Records", "Backup notebook / photos / spreadsheet", "Weekly backup"),
]

CYCLE_TASKS = [
    # PRE-CYCLE
    ("9. Scaling", "Start small", "Define cycle size (# bags) and budget cap", "Written plan"),
    ("9. Scaling", "Baseline", "Record starting media, seed lot, costs", "Sheet 05/06"),
    ("2. Financials", "CAPEX", "List all one-time purchases (bags, drip, net)", "Sheet 06"),
    ("2. Financials", "OPEX", "Budget seeds, media, fertiliser, labour", "Sheet 06"),
    # NURSERY
    ("1. Production", "Variety", "Label all seed lots; record germination %", ">70% germination"),
    ("1. Production", "Nursery", "Seed treatment (captan); sow 0.5 cm depth", "DOA protocol"),
    ("1. Production", "Nursery", "Seedling mix: 60–70% cocopeat + 30–40% compost", "pH 5.5–6.5"),
    ("4. Water & Fertilizer", "Water quality", "Use clean water; note source (tap/bore/rain)", "No contamination"),
    ("1. Production", "Nursery", "Week 2 foliar feed (½ strength)", "Once only"),
    ("1. Production", "Nursery", "Seedlings 4–6 true leaves, 15–25 cm", "Week 4–6"),
    ("3. Farm Management", "SOP", "Harden seedlings 5–7 days before transplant", "Mandatory"),
    # TRANSPLANT
    ("1. Production", "Transplanting", "Transplant late afternoon; 7 L horizontal bag", "Same depth as seedling"),
    ("1. Production", "Plant density", "1 plant per bag; spacing 45–60 cm", "Confirmed"),
    ("4. Water & Fertilizer", "Fertilizer", "Compost mixed INTO media at fill (not raw manure)", "20–40 g composted CM/bag"),
    ("6. Harvest & Quality", "Loss reduction", "Shade 5–7 days post-transplant", "Semi-shade"),
  # GROWTH
    ("1. Production", "Growth", "Stake plants week 4–5 post-transplant", "1 bamboo/plant"),
    ("4. Water & Fertilizer", "Irrigation", "Set fertigation EC schedule OR manual side-dress", "Week 2,5,8 feed"),
    ("4. Water & Fertilizer", "Experiments", "Log any trials (soak vs no-soak, bag size, etc.)", "Sheet 05 notes"),
    ("5. Pest & Disease", "Prevention", "Insect net on nursery; farm sanitation", "Ongoing"),
    # FLOWERING / FRUIT
    ("1. Production", "Flowering", "First flowers expected ~week 8–10 post-transplant", "Logged date"),
    ("1. Production", "Fruit set", "Monitor flower drop — check K, water stress", "<30% drop"),
    ("4. Water & Fertilizer", "Concentration", "Shift to higher K during fruiting", "EC 2.0–2.5"),
    ("5. Pest & Disease", "Treatment", "Fruit fly traps at flowering", "Active traps"),
    # YIELD
    ("1. Production", "Yield", "Track cumulative kg per plant", "0.8–1.5 kg target"),
    ("1. Production", "Saleable yield", "Saleable = total − rejects", ">90% saleable"),
    ("6. Harvest & Quality", "Maturity", "Pick at correct stage for buyer", "Per buyer spec"),
    ("6. Harvest & Quality", "Sorting", "Sort by size, colour, damage", "3 grades min"),
    ("6. Harvest & Quality", "Packaging", "Clean ventilated packs; label grade & date", "No free moisture"),
    ("6. Harvest & Quality", "Storage", "Store cool, shaded; sell within 24–48 h", "No condensation"),
    # FINANCIAL CLOSE
    ("2. Financials", "Cost/kg", "Calculate total cost ÷ saleable kg", "Target <RM 8/kg"),
    ("2. Financials", "Break-even", "Break-even kg = total cost ÷ price/kg", "Logged"),
    ("2. Financials", "Profit", "Revenue − OPEX − CAPEX (amortised)", "Positive?"),
    ("2. Financials", "ROI", "ROI = profit ÷ total investment × 100", "Logged"),
    ("7. Market & Sales", "Multiple buyers", "Maintain 2+ buyer relationships", "Risk reduction"),
    # RESET / SCALING
    ("5. Pest & Disease", "Recovery", "Solarize media 2–4 weeks if reusing bags", "EC <2.0 before reuse"),
    ("9. Scaling", "Improve", "List top 3 problems this cycle", "Action plan"),
    ("9. Scaling", "Repeat", "Document what to keep/change next cycle", "Written"),
    ("9. Scaling", "Prove profit", "Confirm profit per bag before expanding", "RM/plant known"),
    ("9. Scaling", "Expand", "Increase bags only if survival >90% & profit >0", "Go/no-go"),
    ("9. Scaling", "Replicate", "Copy SOP to new site/operator", "SOP document"),
    ("9. Scaling", "SOP", "Update SOP with lessons learned", "Version +1"),
]


def sheet_production(wb):
    ws = wb.create_sheet("05_PRODUCTION")
    ws["A1"] = "PRODUCTION TRACKER"
    ws["A1"].font = TITLE_FONT
    headers = [
        "Plant ID / Bag #", "Variety", "Seed Lot", "Sow Date", "Germ %", "Transplant Date",
        "Bag Size (L)", "Media Mix", "Growth Stage", "Height (cm)", "Flowering Date",
        "First Harvest", "Total Yield (kg)", "Saleable (kg)", "Notes", "Experiment Tag"
    ]
    r = 3
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    stages = '"Nursery,Vegetative,Flowering,Fruit set,Harvesting,Ended"'
    dv = DataValidation(type="list", formula1=stages, allow_blank=True)
    ws.add_data_validation(dv)
    dv.add("I4:I203")
    for row in range(4, 54):
        ws.cell(row, 1, row - 3)
    auto_width(ws, {get_column_letter(i): 14 for i in range(1, 17)})


def sheet_financials(wb):
    ws = wb.create_sheet("06_FINANCIALS")
    ws["A1"] = "FINANCIAL TRACKER (CAPEX + OPEX)"
    ws["A1"].font = TITLE_FONT
    headers = ["Date", "Category", "Type", "Item", "Amount (RM)", "Qty", "Unit Cost", "Payment Method", "Notes"]
    r = 3
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    type_dv = DataValidation(type="list", formula1='"CAPEX,OPEX"', allow_blank=True)
    ws.add_data_validation(type_dv)
    type_dv.add("C4:C500")
    cat_dv = DataValidation(type="list", formula1='"Seeds,Media,Fertiliser,Pesticide,Labour,Utilities,Packaging,Transport,Equipment,Other"', allow_blank=True)
    ws.add_data_validation(cat_dv)
    cat_dv.add("B4:B500")

    samples = [
        ("CAPEX", "Equipment", "Drip irrigation kit", 350),
        ("CAPEX", "Equipment", "EC/pH meter", 80),
        ("CAPEX", "Equipment", "Shade net 30%", 200),
        ("OPEX", "Seeds", "Kulai F1 seed 10g", 25),
        ("OPEX", "Media", "Cocopeat 5kg × 20", 120),
        ("OPEX", "Media", "Compost 50kg", 40),
        ("OPEX", "Fertiliser", "NPK 12:12:17 25kg", 55),
        ("OPEX", "Packaging", "Plastic crates", 30),
        ("OPEX", "Labour", "Transplanting (own)", 0),
    ]
    r = 4
    for typ, cat, item, amt in samples:
        ws.cell(r, 2, cat)
        ws.cell(r, 3, typ)
        ws.cell(r, 4, item)
        ws.cell(r, 5, amt)
        r += 1
    auto_width(ws, {"A": 12, "B": 14, "C": 10, "D": 30, "E": 14, "F": 8, "G": 12, "H": 14, "I": 25})


def sheet_water_fert(wb):
    ws = wb.create_sheet("07_WATER_FERTILIZER")
    ws["A1"] = "WATER & FERTILIZER LOG"
    ws["A1"].font = TITLE_FONT
    headers = [
        "Date", "Time", "Bag #/Zone", "Method", "Water (ml)", "Fertiliser Used",
        "EC (mS/cm)", "pH", "Leachate EC", "Weather", "DAT*", "Stage", "Notes"
    ]
    r = 3
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    ws["A2"] = "*DAT = Days After Transplant"
    method_dv = DataValidation(type="list", formula1='"Hand water,Fertigation drip,Flush only,Rain (no action)"', allow_blank=True)
    ws.add_data_validation(method_dv)
    method_dv.add("D4:D500")
    stage_dv = DataValidation(type="list", formula1='"Seedling,Establishment,Vegetative,Flowering,Fruiting,Flush"', allow_blank=True)
    ws.add_data_validation(stage_dv)
    stage_dv.add("L4:L500")
    auto_width(ws, {get_column_letter(i): 13 for i in range(1, 14)})


def sheet_pest(wb):
    ws = wb.create_sheet("08_PEST_DISEASE")
    ws["A1"] = "PEST & DISEASE LOG"
    ws["A1"].font = TITLE_FONT
    headers = [
        "Date", "Bag #/Zone", "Type", "Pest/Disease Name", "Severity (1-5)",
        "% Plants Affected", "Identification Method", "Treatment Applied", "TDMH Date",
        "Outcome", "Loss (kg or plants)", "Sanitation Done?", "SOP Ref", "Recovery Notes"
    ]
    r = 3
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    type_dv = DataValidation(type="list", formula1='"Pest,Disease,Disorder"', allow_blank=True)
    ws.add_data_validation(type_dv)
    type_dv.add("C4:C500")
    outcome_dv = DataValidation(type="list", formula1='"Resolved,Monitoring,Plant removed,Spreading,Recovered"', allow_blank=True)
    ws.add_data_validation(outcome_dv)
    outcome_dv.add("J4:J500")
    auto_width(ws, {get_column_letter(i): 14 for i in range(1, 15)})


def sheet_harvest(wb):
    ws = wb.create_sheet("09_HARVEST_QUALITY")
    ws["A1"] = "HARVEST & QUALITY LOG"
    ws["A1"].font = TITLE_FONT
    headers = [
        "Date", "Bag #/Zone", "Pick #", "Maturity", "Grade A (kg)", "Grade B (kg)",
        "Grade C (kg)", "Total Picked (kg)", "Saleable (kg)", "Reject (kg)",
        "Reject Reason", "Storage Location", "Hours to Sale", "Notes"
    ]
    r = 3
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    mat_dv = DataValidation(type="list", formula1='"Green,Breaker,Red ripe,Overripe"', allow_blank=True)
    ws.add_data_validation(mat_dv)
    mat_dv.add("D4:D500")
    # Formula columns for total and saleable in sample rows
    for row in range(4, 14):
        ws.cell(row, 8, f"=SUM(E{row}:G{row})")
        ws.cell(row, 9, f"=E{row}+F{row}")
        ws.cell(row, 10, f"=G{row}")
    auto_width(ws, {get_column_letter(i): 13 for i in range(1, 15)})


def sheet_sales(wb):
    ws = wb.create_sheet("10_MARKET_SALES")
    ws["A1"] = "MARKET & SALES LOG"
    ws["A1"].font = TITLE_FONT
    headers = [
        "Date", "Buyer Type", "Buyer Name", "Channel", "Grade", "Qty (kg)",
        "Price (RM/kg)", "Revenue (RM)", "Quality Feedback", "Payment Status", "Notes"
    ]
    r = 3
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    for row in range(4, 54):
        ws.cell(row, 8, f"=F{row}*G{row}")
    buyer_dv = DataValidation(type="list", formula1='"Restaurant,Wholesaler,Wet market,Direct consumer,Online,Contract"', allow_blank=True)
    ws.add_data_validation(buyer_dv)
    buyer_dv.add("B4:B500")
    pay_dv = DataValidation(type="list", formula1='"Paid,Pending,COD,Partial"', allow_blank=True)
    ws.add_data_validation(pay_dv)
    pay_dv.add("J4:J500")
    auto_width(ws, {get_column_letter(i): 14 for i in range(1, 12)})


def sheet_scaling(wb):
    ws = wb.create_sheet("11_SCALING_ROADMAP")
    ws["A1"] = "SCALING ROADMAP — Start Small → Prove Profit → Expand"
    ws["A1"].font = TITLE_FONT
    phases = [
        ("Phase 0", "Start small", "10–20 bags pilot", "Learn without big loss", ""),
        ("Phase 1", "Baseline", "Record all costs & yields", "Know true cost/kg", ""),
        ("Phase 2", "Measure", "Track survival, yield, reject %", "KPIs in Dashboard", ""),
        ("Phase 3", "Improve", "Fix top 3 problems", "SOP updated", ""),
        ("Phase 4", "Repeat", "Run cycle 2 at 50 bags", "Compare to cycle 1", ""),
        ("Phase 5", "Prove profit", "Profit > 0 for 2 cycles", "RM/plant documented", ""),
        ("Phase 6", "SOP", "Write 1-page SOP per task", "Train helper", ""),
        ("Phase 7", "Expand", "100 → 200 bags", "Only if survival >90%", ""),
        ("Phase 8", "Replicate", "Second site or partner farm", "Same SOP, same results", ""),
    ]
    headers = ["Phase", "Step", "Action", "Success Criteria", "Status", "Date Done", "Notes"]
    r = 3
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)
    r = 4
    for phase, step, action, criteria, notes in phases:
        ws.cell(r, 1, phase)
        ws.cell(r, 2, step)
        ws.cell(r, 3, action)
        ws.cell(r, 4, criteria)
        ws.cell(r, 5, "Pending")
        ws.cell(r, 6, "")
        ws.cell(r, 7, notes)
        r += 1
    add_status_validation(ws, "E", 4, r - 1)
    auto_width(ws, {"A": 10, "B": 14, "C": 35, "D": 28, "E": 12, "F": 12, "G": 25})


def sheet_master_index(wb):
    ws = wb.create_sheet("12_MASTER_INDEX")
    ws["A1"] = "9-DOMAIN MASTER INDEX — Every goal mapped to sheet & action"
    ws["A1"].font = TITLE_FONT
    headers = ["Domain", "Goal / Topic", "Sheet", "Frequency", "Key Target (Kulai polybag)", "Linked KPI"]
    r = 3
    style_header_row(ws, r, len(headers))
    for i, h in enumerate(headers, 1):
        ws.cell(r, i, h)

    index = [
        ("1. Production", "Variety", "05_PRODUCTION", "Per cycle", "Kulai / hybrid — label all lots", "Germ %"),
        ("1. Production", "Plant density", "05_PRODUCTION", "Transplant", "1 plant / 7 L bag, 45–60 cm spacing", "Survival %"),
        ("1. Production", "Nursery", "04_CYCLE + 05", "Week 0–6", "4–6 true leaves before transplant", "Germ >70%"),
        ("1. Production", "Transplanting", "04_CYCLE", "Week 6", "Late PM, shade 5–7 days", "Survival >90%"),
        ("1. Production", "Growth", "02_DAILY + 05", "Daily/weekly", "Stake by week 4–5 post-transplant", "Height 70–80 cm"),
        ("1. Production", "Flowering", "05_PRODUCTION", "Week 8–10", "Log first flower date", "Flower drop <30%"),
        ("1. Production", "Fruit set", "05_PRODUCTION", "Weekly", "Monitor small fruit count", "Fruit/plant"),
        ("1. Production", "Yield", "09_HARVEST", "Per pick", "Track cumulative kg", "0.8–1.5 kg/plant"),
        ("1. Production", "Saleable yield", "09_HARVEST", "Per pick", "Total − rejects", ">90% saleable"),
        ("2. Financials", "CAPEX", "06_FINANCIALS", "Per cycle", "Equipment, infrastructure", "Total CAPEX"),
        ("2. Financials", "OPEX", "06_FINANCIALS", "Ongoing", "Seeds, media, feed, labour", "Total OPEX"),
        ("2. Financials", "Cost/plant", "01_DASHBOARD", "End cycle", "Total cost ÷ live plants", "RM/plant"),
        ("2. Financials", "Cost/kg", "01_DASHBOARD", "End cycle", "Total cost ÷ saleable kg", "<RM 8/kg target"),
        ("2. Financials", "Break-even", "01_DASHBOARD", "Monthly", "Cost ÷ price per kg", "Break-even kg"),
        ("2. Financials", "Revenue", "10_MARKET_SALES", "Per sale", "Σ qty × price", "Total revenue"),
        ("2. Financials", "Profit", "01_DASHBOARD", "End cycle", "Revenue − costs", ">0"),
        ("2. Financials", "ROI", "01_DASHBOARD", "End cycle", "Profit ÷ investment", "% ROI"),
        ("2. Financials", "Cash flow", "06 + 10", "Daily/weekly", "Money in vs out", "No negative weeks"),
        ("3. Farm Management", "SOP", "04_CYCLE + 11", "Per cycle", "Written procedures", "SOP version #"),
        ("3. Farm Management", "Daily checklist", "02_DAILY", "Daily", "15-min walk + log", "All Done"),
        ("3. Farm Management", "Irrigation", "02_DAILY + 07", "Daily", "Finger test 3 cm", "No waterlog"),
        ("3. Farm Management", "Fertilizer", "03_WEEKLY + 07", "Weekly", "Side-dress or fertigation", "EC 1.2–2.5"),
        ("3. Farm Management", "Pest inspection", "02_DAILY + 08", "Daily", "Leaf undersides", "<5% affected"),
        ("3. Farm Management", "Disease inspection", "02_DAILY + 08", "Daily", "Wilting, mosaic, spots", "Remove suspects"),
        ("3. Farm Management", "Harvest", "02_DAILY + 09", "Daily peak", "Pick every 1–2 days", "Kg logged"),
        ("3. Farm Management", "Maintenance", "02_DAILY", "Daily", "Stakes, drippers, net", "No failures"),
        ("3. Farm Management", "Records", "All logs", "Daily", "Same-day entry", "100% logged"),
        ("4. Water & Fertilizer", "Water quality", "07", "Per cycle", "Clean source", "No salinity issues"),
        ("4. Water & Fertilizer", "Irrigation", "07", "Daily", "Hand or drip", "Method logged"),
        ("4. Water & Fertilizer", "Frequency", "07", "Daily", "1–6× by stage", "Per schedule"),
        ("4. Water & Fertilizer", "Volume", "07", "Daily", "500 ml–3.5 L/bag/day", "ml logged"),
        ("4. Water & Fertilizer", "Fertilizer", "07 + 03", "Weekly", "NPK 12:12:17 + compost", "g or EC logged"),
        ("4. Water & Fertilizer", "Concentration", "07", "Daily if fertigating", "EC ramp 1.2→2.5", "EC reading"),
        ("4. Water & Fertilizer", "pH", "07", "Weekly", "5.5–6.5", "pH reading"),
        ("4. Water & Fertilizer", "EC", "07", "Daily/weekly", "Feed + leachate EC", "EC reading"),
        ("4. Water & Fertilizer", "Experiments", "05 + 07", "Per trial", "Soak test, bag size, etc.", "Tagged rows"),
        ("5. Pest & Disease", "Prevention", "03_WEEKLY", "Weekly", "Net, sanitation, traps", "Trap count"),
        ("5. Pest & Disease", "Identification", "08", "As found", "Name the pest/disease", "Named in log"),
        ("5. Pest & Disease", "Scouting", "02_DAILY", "Daily", "Systematic walk", "% affected"),
        ("5. Pest & Disease", "Detection", "02_DAILY", "Daily", "Early signs", "Logged same day"),
        ("5. Pest & Disease", "Treatment", "08", "As needed", "IPM first; label TDMH", "Outcome logged"),
        ("5. Pest & Disease", "Sanitation", "03_WEEKLY", "Weekly", "Remove debris, weeds", "Done checkbox"),
        ("5. Pest & Disease", "Monitoring", "03_WEEKLY", "Weekly", "Trend % affected", "<5%"),
        ("5. Pest & Disease", "Loss reduction", "08 + 09", "Weekly", "Kg/plants lost", "<5% loss"),
        ("5. Pest & Disease", "SOP", "08", "Per incident", "Follow treatment SOP", "SOP ref column"),
        ("5. Pest & Disease", "Recovery", "04_CYCLE", "Post-outbreak", "Solarize, remove plants", "Media reset"),
        ("6. Harvest & Quality", "Maturity", "09", "Per pick", "Green / red per buyer", "Grade logged"),
        ("6. Harvest & Quality", "Harvest", "09", "Daily peak", "Every 1–2 days", "Kg picked"),
        ("6. Harvest & Quality", "Sorting", "09", "Per pick", "Separate grades", "A/B/C kg"),
        ("6. Harvest & Quality", "Grading", "09", "Per pick", "Size, colour, damage", "Grade A >70%"),
        ("6. Harvest & Quality", "Packaging", "09 + 10", "Per sale", "Ventilated, labelled", "No moisture"),
        ("6. Harvest & Quality", "Storage", "09", "Per pick", "Shade, <48 h to sale", "Hours to sale"),
        ("6. Harvest & Quality", "Rejects", "09", "Per pick", "Separate bin", "Reject kg"),
        ("6. Harvest & Quality", "Loss reduction", "09", "Weekly", "Reject % <10%", "Reject rate KPI"),
        ("7. Market & Sales", "Buyers", "10", "Weekly", "Build 2+ relationships", "Buyer count"),
        ("7. Market & Sales", "Price", "10", "Weekly", "Track market rate", "RM/kg"),
        ("7. Market & Sales", "Quantity", "10", "Per sale", "Kg sold", "Total kg"),
        ("7. Market & Sales", "Quality", "10", "Per sale", "Buyer feedback", "Repeat orders"),
        ("7. Market & Sales", "Contracts", "10", "Monthly", "Fixed supply deals", "Contract kg"),
        ("7. Market & Sales", "Restaurants", "10", "Ongoing", "Chef relationships", "Accounts"),
        ("7. Market & Sales", "Wholesalers", "10", "Ongoing", "Volume buyers", "Accounts"),
        ("7. Market & Sales", "Direct sales", "10", "Ongoing", "Farm gate / online", "Margin %"),
        ("7. Market & Sales", "Multiple buyers", "10", "Ongoing", "No single-buyer risk", "≥2 active"),
        ("8. Data & Technology", "Farm database", "All sheets", "Ongoing", "This workbook", "Complete logs"),
        ("8. Data & Technology", "Input tracking", "06 + 07", "Per purchase", "Every RM spent", "OPEX total"),
        ("8. Data & Technology", "Yield tracking", "09", "Per pick", "Every kg picked", "Yield/plant"),
        ("8. Data & Technology", "Cost tracking", "06", "Per purchase", "Every expense", "Cost/kg"),
        ("8. Data & Technology", "Weather", "03_WEEKLY", "Weekly", "Rain, temp, humidity", "Logged"),
        ("8. Data & Technology", "Pest records", "08", "As found", "Every incident", "Pest log"),
        ("8. Data & Technology", "Dashboard", "01_DASHBOARD", "Weekly", "Review KPIs", "Health scores"),
        ("8. Data & Technology", "Analytics", "01_DASHBOARD", "Monthly", "Trends cycle vs cycle", "Improve %"),
        ("8. Data & Technology", "Experiments", "05 + 07", "Per trial", "Tagged & compared", "Winner chosen"),
        ("9. Scaling", "Start small", "11_SCALING", "Phase 0", "10–20 bags first", "Pilot done"),
        ("9. Scaling", "Baseline", "11_SCALING", "Phase 1", "Record everything", "Baseline set"),
        ("9. Scaling", "Measure", "01_DASHBOARD", "Phase 2", "KPIs tracked", "Data complete"),
        ("9. Scaling", "Improve", "11_SCALING", "Phase 3", "Fix top 3 issues", "SOP v2"),
        ("9. Scaling", "Repeat", "11_SCALING", "Phase 4", "Cycle 2 at scale", "Compared"),
        ("9. Scaling", "Prove profit", "01_DASHBOARD", "Phase 5", "2 profitable cycles", "Profit >0"),
        ("9. Scaling", "SOP", "11_SCALING", "Phase 6", "Document all tasks", "SOP written"),
        ("9. Scaling", "Expand", "11_SCALING", "Phase 7", "Double bags", "Survival >90%"),
        ("9. Scaling", "Replicate", "11_SCALING", "Phase 8", "New site/partner", "Same results"),
    ]
    r = 4
    for row_data in index:
        for c, val in enumerate(row_data, 1):
            cell = ws.cell(r, c, val)
            cell.border = BORDER
            cell.alignment = Alignment(wrap_text=True, vertical="top")
        domain = row_data[0]
        if domain in DOMAIN_FILLS:
            ws.cell(r, 1).fill = PatternFill("solid", fgColor=DOMAIN_FILLS[domain])
        r += 1
    ws.freeze_panes = "A4"
    auto_width(ws, {"A": 22, "B": 22, "C": 18, "D": 12, "E": 35, "F": 18})


def main():
    wb = Workbook()
    sheet_readme(wb)
    sheet_dashboard(wb)
    sheet_checklist(wb, "02_DAILY_CHECKLIST", "DAILY CHECKLIST (≈15 min)", DAILY_TASKS)
    sheet_checklist(wb, "03_WEEKLY_CHECKLIST", "WEEKLY CHECKLIST (≈1 hour)", WEEKLY_TASKS)
    sheet_checklist(wb, "04_CYCLE_CHECKLIST", "CROP CYCLE CHECKLIST (sow → harvest → reset)", CYCLE_TASKS)
    sheet_production(wb)
    sheet_financials(wb)
    sheet_water_fert(wb)
    sheet_pest(wb)
    sheet_harvest(wb)
    sheet_sales(wb)
    sheet_scaling(wb)
    sheet_master_index(wb)
    wb.save(OUTPUT)
    print(f"Saved: {OUTPUT}")


if __name__ == "__main__":
    main()
