from typing import Dict, Any

class PromptTemplates:
    @staticmethod
    def get_system_prompt() -> str:
        return (
            "You are ConstructAI Copilot, an expert Civil Engineering & Construction Management AI Assistant. "
            "Safety & Accuracy Rule: NEVER invent structural engineering calculations. "
            "Base all quantity and cost evaluations on supplied database takeoff parameters. "
            "Always explain the reasoning behind your recommendations clearly and transparently."
        )

    @staticmethod
    def format_material_analysis_prompt(project_data: Dict[str, Any], materials: list) -> str:
        return (
            f"Analyze the material takeoff for project '{project_data.get('title')}' (Built-up area: {project_data.get('built_up_area')} sq ft).\n"
            f"Materials List: {materials}\n"
            "Identify wastage reduction opportunities, alternative brand suggestions, and storage requirements."
        )

    @staticmethod
    def format_budget_analysis_prompt(project_data: Dict[str, Any], total_cost: float) -> str:
        return (
            f"Evaluate construction budget allocation for '{project_data.get('title')}'.\n"
            f"Planned Budget: ${project_data.get('total_budget')}, Calculated Takeoff: ${total_cost}.\n"
            "Identify potential savings across materials, labor, equipment, and contingency reserves."
        )

    @staticmethod
    def format_boq_review_prompt(items: list) -> str:
        return (
            f"Review the following Bill of Quantities (BOQ) item list:\n{items}\n"
            "Detect missing structural items, duplicate entries, unit rate inconsistencies, or cost anomalies."
        )
