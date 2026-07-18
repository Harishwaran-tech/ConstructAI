from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import os

class BaseAIProvider(ABC):
    @abstractmethod
    def generate_chat_response(self, user_prompt: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        pass

    @abstractmethod
    def analyze_boq(self, boq_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        pass

class MockAIProvider(BaseAIProvider):
    def generate_chat_response(self, user_prompt: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        prompt_lower = user_prompt.lower()
        if "reduce project cost" in prompt_lower or "reduce cost" in prompt_lower:
            return (
                "To optimize project costs without compromising structural integrity:\n"
                "1. **Substitute M-Sand for River Sand**: Reduces fine aggregate cost by ~12% ($4,200 savings).\n"
                "2. **Bulk Order Primary Rebars**: Placing Tata Tiscon or JSW orders before next week's spot price surge saves ~2.4%.\n"
                "3. **M25 Grade Concrete Column Mix**: Reduces required steel reinforcement ratio from 2.0% to 1.5%."
            )
        elif "cement brand" in prompt_lower:
            return (
                "**UltraTech PPC Super** offers high early 28-day compressive strength (>53 MPa) and anti-crack micro-fibers.\n"
                "**ACC Concrete+ Gold** is a water-repellent alternative priced $0.40/bag lower, offering excellent waterproofing for basements."
            )
        elif "reduce steel" in prompt_lower:
            return (
                "Using **Fe 550D TMT rebars** instead of Fe 500D increases tensile yield strength by 10%, allowing structural engineers to reduce rebar weight by ~8% in beam sections."
            )
        elif "increasing in price" in prompt_lower or "price" in prompt_lower:
            return (
                "According to live market feeds: **Modular Copper Wires** (+3.17%) and **Tata Tiscon Steel** (+2.15%) are experiencing price increases this week."
            )
        else:
            return (
                f"ConstructAI Copilot Recommendation for '{user_prompt}':\n"
                "Based on calculated takeoff parameters, we recommend maintaining an emergency contingency fund of 10% ($15,000) for structural site variations."
            )

    def analyze_boq(self, boq_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {
            "missing_items": ["Underground Waterproofing Compound", "Expansion Joint Fillers"],
            "duplicate_items": ["None detected"],
            "inconsistencies": ["Tile adhesive quantity ratio is 5% lower than recommended 2mm spacer coverage"],
            "cost_anomalies": ["Painting labor rate is 8% higher than regional average"],
            "overall_health_verdict": "Good (Minor MEP adjustments recommended)"
        }

class GeminiAIProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

    def generate_chat_response(self, user_prompt: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        # Fallback to Mock if API Key is not set
        if not self.api_key:
            return MockAIProvider().generate_chat_response(user_prompt, context_data)
        return f"[Gemini 1.5 Flash] Analysis for: {user_prompt}"

    def analyze_boq(self, boq_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        return MockAIProvider().analyze_boq(boq_items)

class OpenAIAIProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

    def generate_chat_response(self, user_prompt: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        if not self.api_key:
            return MockAIProvider().generate_chat_response(user_prompt, context_data)
        return f"[OpenAI GPT-4o] Analysis for: {user_prompt}"

    def analyze_boq(self, boq_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        return MockAIProvider().analyze_boq(boq_items)

class ClaudeAIProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")

    def generate_chat_response(self, user_prompt: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        if not self.api_key:
            return MockAIProvider().generate_chat_response(user_prompt, context_data)
        return f"[Claude 3.5 Sonnet] Analysis for: {user_prompt}"

    def analyze_boq(self, boq_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        return MockAIProvider().analyze_boq(boq_items)

# Dependency Injection factory
def get_ai_provider(provider_type: str = "mock") -> BaseAIProvider:
    if provider_type == "gemini":
        return GeminiAIProvider()
    elif provider_type == "openai":
        return OpenAIAIProvider()
    elif provider_type == "claude":
        return ClaudeAIProvider()
    return MockAIProvider()
