from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

REPORT_TYPES = [
    "Project Summary Report",
    "Material Estimation Report",
    "Material Cost Report",
    "Labour Cost Report",
    "Equipment Cost Report",
    "Construction Cost Report",
    "Bill of Quantities (BOQ)",
    "Material Purchase Report",
    "Supplier Comparison Report",
    "Market Price Report",
    "AI Recommendation Report",
    "Risk Assessment Report",
    "Timeline Report",
    "Budget Optimization Report",
    "Project Completion Report"
]

class DocumentService:
    @staticmethod
    def generate_report_content(report_type: str, project_data: Dict[str, Any], estimation_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        now_str = datetime.now(timezone.utc).strftime("%B %d, %Y - %H:%M UTC")
        proj_title = project_data.get("title", "ConstructAI Commercial Facility")
        client = project_data.get("client_name", "Acme Construction Corp")
        engineer = project_data.get("owner_name", "Chief Civil Engineer")
        location = f"{project_data.get('city', 'Austin')}, {project_data.get('state', 'TX')}"
        area = project_data.get("built_up_area", 1500.0)
        budget = project_data.get("total_budget", 150000.0)

        header = {
            "company": "ConstructAI Platform",
            "branding": "Enterprise Construction Intelligence & Material Analytics Engine",
            "report_title": f"{report_type} - {proj_title}",
            "generated_date": now_str,
            "prepared_by": engineer,
            "confidential_notice": "CONFIDENTIAL - Strictly for authorized clients, architects, and project managers."
        }

        items = estimation_data.get("items", []) if estimation_data else []

        if report_type == "Bill of Quantities (BOQ)":
            boq_table = []
            for idx, item in enumerate(items, 1):
                boq_table.append({
                    "item_no": idx,
                    "material": item.get("name"),
                    "specification": item.get("specs", "Standard Specification"),
                    "brand": item.get("recommended_brand", "UltraTech / Tata"),
                    "grade": item.get("recommended_grade", "PPC / Fe 550D"),
                    "quantity": item.get("final_qty"),
                    "unit": item.get("unit"),
                    "unit_rate": item.get("unit_price"),
                    "amount": item.get("total_price"),
                    "remarks": "Verified via Estimation Engine"
                })

            grand_total = sum(i["amount"] for i in boq_table) if boq_table else budget * 0.52

            return {
                "header": header,
                "project_info": {"title": proj_title, "client": client, "location": location, "built_up_area": area, "budget": budget},
                "boq_table": boq_table,
                "grand_total": round(grand_total, 2)
            }

        elif report_type == "Material Cost Report":
            cat_map: Dict[str, float] = {}
            for item in items:
                cat = item.get("category", "General")
                cat_map[cat] = cat_map.get(cat, 0.0) + item.get("total_price", 0.0)

            categories = [{"category": k, "total_cost": round(v, 2)} for k, v in cat_map.items()]
            return {
                "header": header,
                "project_info": {"title": proj_title, "client": client, "budget": budget},
                "category_breakdown": categories,
                "items": items
            }

        else: # Default Project Summary / Material Estimation / AI Report
            return {
                "header": header,
                "project_info": {
                    "title": proj_title,
                    "client": client,
                    "engineer": engineer,
                    "location": location,
                    "built_up_area": area,
                    "budget": budget,
                    "status": project_data.get("status", "Active"),
                    "description": project_data.get("description", "High durability residential & commercial structural development.")
                },
                "summary": estimation_data.get("summary") if estimation_data else {
                    "total_materials_count": len(items),
                    "total_material_cost": budget * 0.52
                },
                "items": items
            }

    @staticmethod
    def generate_csv_bytes(content_data: Dict[str, Any]) -> bytes:
        header = content_data.get("header", {})
        info = content_data.get("project_info", {})
        
        csv_str = f"=== {header.get('report_title')} ===\n"
        csv_str += f"Generated Date: {header.get('generated_date')}\n"
        csv_str += f"Client: {info.get('client')}\n"
        csv_str += f"Project Title: {info.get('title')}\n\n"

        if "boq_table" in content_data:
            csv_str += "Item No,Material,Specification,Brand,Grade,Quantity,Unit,Unit Rate,Amount,Remarks\n"
            for row in content_data["boq_table"]:
                csv_str += f"{row['item_no']},\"{row['material']}\",\"{row['specification']}\",\"{row['brand']}\",\"{row['grade']}\",{row['quantity']},\"{row['unit']}\",{row['unit_rate']},{row['amount']},\"{row['remarks']}\"\n"
            csv_str += f"\nGrand Total,,,,,,,,{content_data.get('grand_total')},\n"
        else:
            items = content_data.get("items", [])
            csv_str += "Material Name,Category,Brand,Grade,Quantity,Unit,Unit Price,Total Cost\n"
            for item in items:
                csv_str += f"\"{item.get('name')}\",\"{item.get('category')}\",\"{item.get('recommended_brand')}\",\"{item.get('recommended_grade')}\",{item.get('final_qty')},\"{item.get('unit')}\",{item.get('unit_price')},{item.get('total_price')}\n"

        return csv_str.encode("utf-8")
