from typing import List, Dict, Any, Optional

# Configurable Engineering Constants Matrix
DENSITY_CONCRETE_KG_M3 = 2400.0 # kg/m3
DENSITY_STEEL_KG_M3 = 7850.0 # kg/m3
CEMENT_BAG_WEIGHT_KG = 50.0 # kg per bag
CEMENT_BAG_VOLUME_CUFT = 1.226 # cu ft per bag

class EstimationEngine:
    @staticmethod
    def calculate(req_in: Any) -> Dict[str, Any]:
        """Backward compatible single component calculation for unit tests"""
        data = req_in.model_dump() if hasattr(req_in, "model_dump") else req_in
        category = data.get("category", "Concrete")
        length = float(data.get("length") or 0.0)
        width = float(data.get("width") or 0.0)
        height = float(data.get("height_or_depth") or 0.0)

        if category == "Concrete":
            vol_cuft = round(length * width * height, 2)
            vol_m3 = round(vol_cuft / 35.315, 2)
            bags = round(vol_m3 * 8.2)
            steel_kg = round(vol_cuft * 4.5)
            materials = [
                {"name": "UltraTech Cement", "quantity": bags, "unit": "Bags", "unit_price": 385.00, "total_price": round(bags * 385.00, 2)},
                {"name": "Tata Steel TMT", "quantity": steel_kg, "unit": "kg", "unit_price": 66.50, "total_price": round(steel_kg * 66.50, 2)},
                {"name": "M-Sand", "quantity": round(vol_cuft * 0.45), "unit": "cu ft", "unit_price": 55.00, "total_price": round(vol_cuft * 0.45 * 55.00, 2)},
                {"name": "20mm Aggregate", "quantity": round(vol_cuft * 0.85), "unit": "cu ft", "unit_price": 48.00, "total_price": round(vol_cuft * 0.85 * 48.00, 2)},
            ]
            total_cost = sum(m["total_price"] for m in materials)
            return {"volume_cuft": vol_cuft, "materials": materials, "total_estimated_cost": total_cost}
        else: # Masonry
            wall_area = round(length * height, 2)
            bricks = round(wall_area * 13.5)
            bags = round(wall_area * 0.08)
            sand = round(wall_area * 0.35)
            materials = [
                {"name": "Red Clay Bricks", "quantity": bricks, "unit": "Units", "unit_price": 9.50, "total_price": round(bricks * 9.50, 2)},
                {"name": "Cement", "quantity": bags, "unit": "Bags", "unit_price": 385.00, "total_price": round(bags * 385.00, 2)},
                {"name": "M-Sand", "quantity": sand, "unit": "cu ft", "unit_price": 55.00, "total_price": round(sand * 55.00, 2)},
            ]
            total_cost = sum(m["total_price"] for m in materials)
            return {"wall_area_sqft": wall_area, "materials": materials, "total_estimated_cost": total_cost}

    @staticmethod
    def calculate_all_materials(project_data: Dict[str, Any]) -> Dict[str, Any]:
        built_up_area = float(project_data.get("built_up_area") or 1500.0)
        floors = int(project_data.get("plot_details", {}).get("floors") or 2)
        total_area = built_up_area * floors

        struct = project_data.get("structural_details", {}) or {}
        prefs = project_data.get("material_preferences", {}) or {}
        labour_input = project_data.get("labour_details", {}) or {}

        conc_grade = struct.get("concrete_grade", "M20")
        brick_type_pref = prefs.get("brick_type") or struct.get("brick_type") or "Standard Red Clay Brick"
        cement_brand_pref = prefs.get("cement_brand", "UltraTech")
        steel_brand_pref = prefs.get("steel_brand", "Tata Tiscon")
        paint_brand_pref = prefs.get("paint_brand", "Asian Paints")
        pipe_brand_pref = prefs.get("pipe_brand", "Astral")
        electrical_brand_pref = prefs.get("electrical_brand", "Havells")

        # Structural Concrete & Slab Volume
        slab_thickness_ft = 0.42
        columns_beams_factor = 0.35
        concrete_volume_cuft = round(total_area * slab_thickness_ft * (1 + columns_beams_factor), 2)
        concrete_volume_m3 = round(concrete_volume_cuft / 35.315, 2)

        cement_bags_per_m3 = 9.5 if conc_grade == "M25" else 11.0 if conc_grade == "M30" else 8.2
        req_cement_bags = round(concrete_volume_m3 * cement_bags_per_m3)
        final_cement_bags = round(req_cement_bags * 1.05)

        steel_kg_per_sqft = 4.8 if conc_grade in ["M25", "M30"] else 4.2
        req_steel_kg = round(total_area * steel_kg_per_sqft)
        final_steel_kg = round(req_steel_kg * 1.05)

        coarse_agg_cuft = round(concrete_volume_cuft * 0.85, 2)
        m_sand_cuft = round(concrete_volume_cuft * 0.45, 2)

        # Masonry & Wall Mortar
        wall_height_ft = float(struct.get("floor_height") or 10.0)
        perim_ft = (total_area ** 0.5) * 4
        wall_area_sqft = round(perim_ft * wall_height_ft * floors * 0.75, 2)
        wall_vol_cuft = round(wall_area_sqft * 0.75, 2)

        if "AAC" in brick_type_pref:
            brick_name = "Autoclaved Aerated (AAC) Blocks"
            req_bricks = round(wall_vol_cuft / 0.75)
            brick_unit_price = 65.00
        elif "Fly Ash" in brick_type_pref:
            brick_name = "Fly Ash Cement Bricks"
            req_bricks = round(wall_vol_cuft * 13.5)
            brick_unit_price = 7.50
        else:
            brick_name = "Standard Red Clay Bricks"
            req_bricks = round(wall_vol_cuft * 13.5)
            brick_unit_price = 9.50

        final_bricks = round(req_bricks * 1.08)

        flooring_sqft = round(total_area * 0.85, 2)
        tiles_sqft = round(flooring_sqft * 1.10)

        internal_wall_area_sqft = round(wall_area_sqft * 2.2, 2)
        paint_liters = round(internal_wall_area_sqft / 110.0 * 1.05)

        copper_wire_meters = round(total_area * 4.2)
        cpvc_hotwater_meters = round(total_area * 0.5)
        water_tank_l = int(struct.get("water_tank_capacity") or 2000)

        false_ceiling_sqft = round(total_area * 0.60)
        helmets_count = 15

        items = [
          {
            "name": f"{cement_brand_pref} PPC Cement",
            "category": "Structural Concrete",
            "recommended_grade": f"PPC / {conc_grade} Grade",
            "recommended_brand": cement_brand_pref,
            "req_qty": req_cement_bags,
            "unit": "50kg Bags",
            "weight": round(final_cement_bags * 50.0, 2),
            "waste_pct": 5,
            "final_qty": final_cement_bags,
            "unit_price": 385.00,
            "total_price": round(final_cement_bags * 385.00, 2),
            "description": "High-grade Portland Pozzolana Cement engineered for high durability structural casting.",
            "alternative": "ACC Concrete+ Gold / Ambuja Kawach",
            "specs": "Compressive strength > 53 MPa at 28 days. Conforms to IS 1489.",
            "engineering_notes": "Maintains optimum water-cement ratio of 0.45 for column and beam structural pours.",
            "lifetime": "50+ Years",
            "usage_instructions": "Mix thoroughly with clean potable water. Use within 90 minutes of hydration.",
            "storage_instructions": "Store off the ground on wooden pallets in a dry, moisture-free warehouse.",
            "safety_notes": "Wear dust mask, heavy-duty rubber gloves, and safety goggles during batching."
          },
          {
            "name": f"{steel_brand_pref} TMT Rebar Steel",
            "category": "Structural Steel",
            "recommended_grade": "Fe 550D TMT",
            "recommended_brand": steel_brand_pref,
            "req_qty": req_steel_kg,
            "unit": "kg",
            "weight": final_steel_kg,
            "waste_pct": 5,
            "final_qty": final_steel_kg,
            "unit_price": 66.50,
            "total_price": round(final_steel_kg * 66.50, 2),
            "description": "High-ductility thermo-mechanically treated steel bars for seismic earthquake resistance.",
            "alternative": "JSW Neosteel / Vizag Steel",
            "specs": "Yield strength > 550 N/mm2. Elongation > 16%.",
            "engineering_notes": "Bend rebars cold using mechanical benders. Maintain 40mm clear cover in beams.",
            "lifetime": "75+ Years",
            "usage_instructions": "Tie securely with 18-gauge annealed binding wire at all intersections.",
            "storage_instructions": "Keep covered under waterproof tarps elevated above bare soil to prevent rusting.",
            "safety_notes": "Wear cut-resistant gloves and steel-toed boots while handling rebar bundles."
          },
          {
            "name": brick_name,
            "category": "Masonry",
            "recommended_grade": "Class 1 / AAC Block",
            "recommended_brand": "Local Premium Kiln / Magicrete",
            "req_qty": req_bricks,
            "unit": "Units",
            "weight": round(final_bricks * 3.2, 2),
            "waste_pct": 8,
            "final_qty": final_bricks,
            "unit_price": brick_unit_price,
            "total_price": round(final_bricks * brick_unit_price, 2),
            "description": "Precision load-bearing masonry units for exterior and partition wall construction.",
            "alternative": "Fly Ash Bricks / AAC Lightweight Blocks",
            "specs": "Compressive strength > 7.5 N/mm2. Water absorption < 15%.",
            "engineering_notes": "Soak clay bricks in water bath 2 hours prior to laying in 1:6 cement mortar.",
            "lifetime": "60+ Years",
            "usage_instructions": "Lay in English bond pattern with 10mm mortar joints using plumb bob line.",
            "storage_instructions": "Stack neatly on level ground up to 6 feet maximum height.",
            "safety_notes": "Use safety gloves and helmets while unloading brick trucks."
          },
          {
            "name": "Manufactured M-Sand",
            "category": "Aggregates",
            "recommended_grade": "Zone II Fine Sand",
            "recommended_brand": "Regional Crusher Mill",
            "req_qty": m_sand_cuft,
            "unit": "cu ft",
            "weight": round(m_sand_cuft * 45.0, 2),
            "waste_pct": 5,
            "final_qty": round(m_sand_cuft * 1.05, 2),
            "unit_price": 55.00,
            "total_price": round(m_sand_cuft * 1.05 * 55.00, 2),
            "description": "Washed cubical crushed stone sand replacing natural river sand for RCC & plastering.",
            "alternative": "Natural River Sand",
            "specs": "Silt content < 3%. Moisture content < 2%.",
            "engineering_notes": "Ensures uniform voids distribution and higher compressive strength in concrete.",
            "lifetime": "100+ Years",
            "usage_instructions": "Sieve through 4.75mm screen for brickwork mortar joints.",
            "storage_instructions": "Store on clean concrete floor platform to prevent dirt contamination.",
            "safety_notes": "Wear eye protection and dust mask during dry sieving."
          },
          {
            "name": "Coarse Aggregate (20mm)",
            "category": "Aggregates",
            "recommended_grade": "20mm Angular Blue Metal",
            "recommended_brand": "Granite Quarry Mill",
            "req_qty": coarse_agg_cuft,
            "unit": "cu ft",
            "weight": round(coarse_agg_cuft * 48.0, 2),
            "waste_pct": 5,
            "final_qty": round(coarse_agg_cuft * 1.05, 2),
            "unit_price": 48.00,
            "total_price": round(coarse_agg_cuft * 1.05 * 48.00, 2),
            "description": "Hard crushed granite stone aggregate for RCC slabs, columns, and foundations.",
            "alternative": "10mm Down Aggregate",
            "specs": "Flakiness index < 15%. Specific gravity 2.65.",
            "engineering_notes": "Blended 60:40 ratio of 20mm and 10mm aggregates for maximum packing density.",
            "lifetime": "100+ Years",
            "usage_instructions": "Wash with water prior to batching to remove adhering dust particles.",
            "storage_instructions": "Keep in segregated stockpiles away from organic matter.",
            "safety_notes": "Wear protective boots and hard hat."
          },
          {
            "name": f"{paint_brand_pref} Luxury Emulsion Paint",
            "category": "Finishing & Paint",
            "recommended_grade": "Interior Silk Washable",
            "recommended_brand": paint_brand_pref,
            "req_qty": paint_liters,
            "unit": "Liters",
            "weight": round(paint_liters * 1.3, 2),
            "waste_pct": 5,
            "final_qty": paint_liters,
            "unit_price": 480.00,
            "total_price": round(paint_liters * 480.00, 2),
            "description": "Washable interior emulsion paint with anti-fungal Teflon protection.",
            "alternative": "Berger Silk / Dulux Velvet",
            "specs": "VOC < 50 g/L. Sheen level 15-25% at 60 deg.",
            "engineering_notes": "Apply 2 coats over 1 coat primer and 2 coats acrylic putty.",
            "lifetime": "8-10 Years",
            "usage_instructions": "Dilute with 400ml water per liter paint. Stir thoroughly.",
            "storage_instructions": "Keep airtight sealed in cool shade away from heat and direct sunlight.",
            "safety_notes": "Ensure room ventilation during indoor spray application."
          },
          {
            "name": f"{electrical_brand_pref} Modular Copper Wires",
            "category": "Electrical",
            "recommended_grade": "2.5 sq mm Flame Retardant",
            "recommended_brand": electrical_brand_pref,
            "req_qty": copper_wire_meters,
            "unit": "Meters",
            "weight": round(copper_wire_meters * 0.04, 2),
            "waste_pct": 6,
            "final_qty": round(copper_wire_meters * 1.06),
            "unit_price": 32.00,
            "total_price": round(copper_wire_meters * 1.06 * 32.00, 2),
            "description": "Multi-strand electrolytic copper conductors with FRLS PVC insulation.",
            "alternative": "Polycab / Anchor / Finolex",
            "specs": "1100V grade. IS 694 certified. Oxygen index > 29%.",
            "engineering_notes": "Pull through concealed PVC conduits using fish tape without sharp bends.",
            "lifetime": "30+ Years",
            "usage_instructions": "Colour coded: Red (Phase), Black (Neutral), Green (Earth).",
            "storage_instructions": "Keep in original cardboard spools elevated indoors.",
            "safety_notes": "Verify circuit de-energization prior to terminations."
          },
          {
            "name": f"{pipe_brand_pref} CPVC Hot & Cold Pipes",
            "category": "Plumbing",
            "recommended_grade": "SDR 11 Class 1",
            "recommended_brand": pipe_brand_pref,
            "req_qty": cpvc_hotwater_meters,
            "unit": "Meters",
            "weight": round(cpvc_hotwater_meters * 0.25, 2),
            "waste_pct": 5,
            "final_qty": round(cpvc_hotwater_meters * 1.05),
            "unit_price": 145.00,
            "total_price": round(cpvc_hotwater_meters * 1.05 * 145.00, 2),
            "description": "Chlorinated Polyvinyl Chloride pressure pipes for potable hot and cold water supply.",
            "alternative": "Ashirvad FlowGuard / Supreme",
            "specs": "Max temp 93 deg C. ASTM D2846 compliant.",
            "engineering_notes": "Use solvent cement jointing method. Pressure test at 10 bar for 2 hours.",
            "lifetime": "50+ Years",
            "usage_instructions": "Cut square using pipe cutter and deburr edges before solvent application.",
            "storage_instructions": "Store horizontally supported every 1 meter in shade.",
            "safety_notes": "Avoid breathing solvent cement vapors."
          },
          {
            "name": "Kajaria Vitrified Floor Tiles (2x2 ft)",
            "category": "Flooring & Tiles",
            "recommended_grade": "Double Charge Vitrified",
            "recommended_brand": "Kajaria / Somany",
            "req_qty": tiles_sqft,
            "unit": "sq ft",
            "weight": round(tiles_sqft * 2.1, 2),
            "waste_pct": 10,
            "final_qty": tiles_sqft,
            "unit_price": 85.00,
            "total_price": round(tiles_sqft * 85.00, 2),
            "description": "Stain-resistant high-gloss double charge vitrified tiles for interior living spaces.",
            "alternative": "Somany / Nitco",
            "specs": "Water absorption < 0.05%. Breaking strength > 1500 N.",
            "engineering_notes": "Lay over tile adhesive with 2mm spacers and epoxy grout filling.",
            "lifetime": "25+ Years",
            "usage_instructions": "Butter back of tile with polymer modified mortar.",
            "storage_instructions": "Store vertically in wooden crates.",
            "safety_notes": "Wear cut-proof gloves while using tile cutter machine."
          },
          {
            "name": "Gypsum Board False Ceiling",
            "category": "Ceiling & Interior",
            "recommended_grade": "12.5mm Moisture Resistant",
            "recommended_brand": "Saint-Gobain Gyproc",
            "req_qty": false_ceiling_sqft,
            "unit": "sq ft",
            "weight": round(false_ceiling_sqft * 0.8, 2),
            "waste_pct": 8,
            "final_qty": false_ceiling_sqft,
            "unit_price": 110.00,
            "total_price": round(false_ceiling_sqft * 110.00, 2),
            "description": "Suspended metal framework ceiling with paper-faced gypsum plasterboard panels.",
            "alternative": "USG Boral / Armstrong",
            "specs": "Board thickness 12.5mm. GI channel gauge 0.5mm.",
            "engineering_notes": "Anchor GI soffit cleats into RCC slab using rawl expansion plugs at 4ft centers.",
            "lifetime": "20+ Years",
            "usage_instructions": "Apply jointing compound and paper tape over board seams.",
            "storage_instructions": "Store flat on dry level floor.",
            "safety_notes": "Wear dust mask when sanding jointing compound."
          },
          {
            "name": "RCC Overhead Water Storage Tank",
            "category": "Utilities & Plumbing",
            "recommended_grade": "Triple Layer Food Grade",
            "recommended_brand": "Sintex / Supreme",
            "req_qty": 1,
            "unit": "Unit",
            "weight": 120.0,
            "waste_pct": 0,
            "final_qty": 1,
            "unit_price": 12500.0,
            "total_price": 12500.0,
            "description": f"{water_tank_l}L UV-stabilized anti-bacterial potable water storage tank.",
            "alternative": "Plasto / Astral",
            "specs": f"Capacity {water_tank_l} Liters. Threaded lid.",
            "engineering_notes": "Mount on level reinforced concrete pedestal on terrace.",
            "lifetime": "15+ Years",
            "usage_instructions": "Connect 1-inch inlet & overflow lines with union valves.",
            "storage_instructions": "Store upright on smooth surface.",
            "safety_notes": "Anchor lid securely against wind gusts."
          },
          {
            "name": "Site Safety Equipment Kit",
            "category": "Safety & Scaffolding",
            "recommended_grade": "ANSI / IS Certified",
            "recommended_brand": "Karam / Honeywell",
            "req_qty": helmets_count,
            "unit": "Kits",
            "weight": 45.0,
            "waste_pct": 0,
            "final_qty": helmets_count,
            "unit_price": 1850.0,
            "total_price": round(helmets_count * 1850.0, 2),
            "description": "Complete site worker personal protective equipment (PPE) bundle.",
            "alternative": "3M Safety / Udyogi",
            "specs": "EN 397 Hard Hats + Full body harnesses + High vis vests.",
            "engineering_notes": "Mandatory 100% PPE compliance across active structural slab casting site.",
            "lifetime": "3 Years",
            "usage_instructions": "Inspect webbing straps daily prior to working at heights.",
            "storage_instructions": "Store in dry safety locker.",
            "safety_notes": "Replace helmet immediately following any impact."
          }
        ]

        grand_total = sum(item["total_price"] for item in items)
        total_weight = sum(item["weight"] for item in items)
        total_qty = sum(item["final_qty"] for item in items)
        avg_cost = round(grand_total / len(items), 2) if items else 0.0

        most_expensive = max(items, key=lambda x: x["total_price"]) if items else None
        largest_qty = max(items, key=lambda x: x["final_qty"]) if items else None

        return {
            "concrete_volume_cuft": concrete_volume_cuft,
            "concrete_volume_m3": concrete_volume_m3,
            "wall_area_sqft": wall_area_sqft,
            "items": items,
            "summary": {
                "total_materials_count": len(items),
                "total_estimated_quantity": total_qty,
                "total_estimated_weight_kg": round(total_weight, 2),
                "total_material_cost": round(grand_total, 2),
                "average_material_cost": avg_cost,
                "most_expensive_material": most_expensive["name"] if most_expensive else "N/A",
                "largest_quantity_material": f"{largest_qty['name']} ({largest_qty['final_qty']} {largest_qty['unit']})" if largest_qty else "N/A"
            }
        }
