import re
import math
from typing import Dict, Any
from app.services.estimation_engine import EstimationEngine
from app.schemas.estimation import EstimationCalculateRequest

class AICopilotService:
    @staticmethod
    def process_prompt(prompt: str) -> Dict[str, Any]:
        """
        Parses user's natural language request (e.g. '1500 sq ft 2-story home in Texas')
        and generates a multi-category structural estimation breakdown.
        """
        area_match = re.search(r'(\d+)\s*(?:sq\s*ft|square\s*feet|sqft|m2|sq\s*m)', prompt, re.IGNORECASE)
        area = float(area_match.group(1)) if area_match else 1200.0

        floors_match = re.search(r'(\d+)\s*(?:story|stories|floor|floors)', prompt, re.IGNORECASE)
        floors = int(floors_match.group(1)) if floors_match else 1

        total_area = area * floors

        # 1. Foundation & Slab Concrete (thickness 0.5 ft average)
        slab_req = EstimationCalculateRequest(
            category="Concrete",
            length=math.sqrt(area),
            width=math.sqrt(area),
            height_or_depth=0.5,
            quantity=floors + 1, # foundation + floor slabs
            concrete_grade="M20",
            steel_percentage=1.5
        )
        slab_res = EstimationEngine.calculate(slab_req)

        # 2. Brickwork Masonry Walls (Outer & Inner wall allowance)
        wall_height = 10.0 # ft per floor
        wall_perimeter = math.sqrt(area) * 4 * 1.5 # perimeter + internal partition walls
        masonry_req = EstimationCalculateRequest(
            category="Masonry",
            length=wall_perimeter,
            height_or_depth=wall_height,
            width=0.75, # 9 inch wall
            quantity=floors,
            mortar_ratio="1:6"
        )
        masonry_res = EstimationEngine.calculate(masonry_req)

        # 3. Steel Reinforcement for Columns & Beams
        steel_req = EstimationCalculateRequest(
            category="Steel",
            length=math.sqrt(area),
            width=math.sqrt(area),
            height_or_depth=0.5,
            quantity=floors + 1,
            steel_percentage=1.8
        )
        steel_res = EstimationEngine.calculate(steel_req)

        # 4. Finishing (Flooring & Painting)
        finish_req = EstimationCalculateRequest(
            category="Finishing",
            length=total_area,
            width=1.0,
            quantity=1.0
        )
        finish_res = EstimationEngine.calculate(finish_req)

        # 5. Services (Plumbing & Electrical)
        service_req = EstimationCalculateRequest(
            category="Plumbing and Electrical",
            length=total_area,
            width=1.0,
            quantity=1.0
        )
        service_res = EstimationEngine.calculate(service_req)

        grand_total_cost = round(
            slab_res["total_estimated_cost"] +
            masonry_res["total_estimated_cost"] +
            steel_res["total_estimated_cost"] +
            finish_res["total_estimated_cost"] +
            service_res["total_estimated_cost"],
            2
        )

        all_materials = []
        for res in [slab_res, masonry_res, steel_res, finish_res, service_res]:
            all_materials.extend(res.get("materials", []))

        return {
            "prompt": prompt,
            "detected_specs": {
                "built_up_area_sqft": total_area,
                "floors": floors,
                "estimated_timeline_months": math.ceil(floors * 2.5)
            },
            "category_breakdown": {
                "Concrete & Foundation": slab_res["total_estimated_cost"],
                "Masonry & Walls": masonry_res["total_estimated_cost"],
                "Structural Steel": steel_res["total_estimated_cost"],
                "Finishing & Painting": finish_res["total_estimated_cost"],
                "Plumbing & Electrical": service_res["total_estimated_cost"]
            },
            "consolidated_materials": all_materials,
            "grand_total_cost": grand_total_cost,
            "ai_insights": [
                f"For a {total_area} sq ft ({floors} story) project, M20 grade concrete offers optimal structural integrity.",
                "Purchasing cement and steel directly in bulk from primary manufacturers can reduce total material expenditure by 8-12%.",
                "Recommend budgeting 5-7% contingency buffer for regional price fluctuations."
            ]
        }
