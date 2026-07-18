from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta

class BasePricingProvider(ABC):
    @abstractmethod
    def fetch_live_prices(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def fetch_price_history(self, timeframe: str) -> List[Dict[str, Any]]:
        pass

class MockPricingProvider(BasePricingProvider):
    def fetch_live_prices(self) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc)
        return [
            # Cement
            {"id": 1, "name": "UltraTech Super Cement", "category": "Cement", "brand": "UltraTech", "company": "UltraTech Cement Ltd", "grade": "PPC 53 Grade", "unit": "50kg Bag", "current_price": 385.00, "previous_price": 380.00, "price_diff": 5.00, "pct_change": 1.32, "trend": "up", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Mumbai Central Building Hub", "location": "Mumbai, MH", "last_updated": now},
            {"id": 2, "name": "ACC Concrete+ Gold", "category": "Cement", "brand": "ACC", "company": "ACC Limited", "grade": "OPC 53 Grade", "unit": "50kg Bag", "current_price": 375.00, "previous_price": 375.00, "price_diff": 0.00, "pct_change": 0.00, "trend": "stable", "availability": "In Stock", "stock_status": "Medium Stock", "supplier_name": "Delhi ReadyMix Supplies", "location": "Delhi NCR", "last_updated": now},
            {"id": 3, "name": "Ramco Supergrade", "category": "Cement", "brand": "Ramco", "company": "Ramco Cements", "grade": "PPC Water Shield", "unit": "50kg Bag", "current_price": 360.00, "previous_price": 365.00, "price_diff": -5.00, "pct_change": -1.37, "trend": "down", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Chennai Builders Depot", "location": "Chennai, TN", "last_updated": now},

            # Steel
            {"id": 4, "name": "Tata Tiscon 550SD TMT Rebar", "category": "Steel", "brand": "Tata Tiscon", "company": "Tata Steel Ltd", "grade": "Fe 550D TMT", "unit": "kg", "current_price": 66.50, "previous_price": 65.00, "price_diff": 1.50, "pct_change": 2.31, "trend": "up", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Bengaluru Steel & Rebar Mills", "location": "Bengaluru, KA", "last_updated": now},
            {"id": 5, "name": "JSW Neosteel TMT Bar", "category": "Steel", "brand": "JSW", "company": "JSW Steel", "grade": "Fe 500D TMT", "unit": "kg", "current_price": 63.50, "previous_price": 63.50, "price_diff": 0.00, "pct_change": 0.00, "trend": "stable", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Bengaluru Steel & Rebar Mills", "location": "Bengaluru, KA", "last_updated": now},
            {"id": 6, "name": "Vizag TMT Rebar", "category": "Steel", "brand": "Vizag", "company": "RINL Vizag", "grade": "Fe 500D TMT", "unit": "kg", "current_price": 61.00, "previous_price": 62.50, "price_diff": -1.50, "pct_change": -2.40, "trend": "down", "availability": "In Stock", "stock_status": "Medium Stock", "supplier_name": "Vizag Steel Yard", "location": "Hyderabad, TS", "last_updated": now},

            # Masonry & Sand
            {"id": 7, "name": "Standard Red Clay Bricks", "category": "Bricks", "brand": "Red Brick", "company": "Regional Kilns", "grade": "Class 1 Red Kiln", "unit": "piece", "current_price": 9.50, "previous_price": 9.50, "price_diff": 0.00, "pct_change": 0.00, "trend": "stable", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Pune Building Materials", "location": "Pune, MH", "last_updated": now},
            {"id": 8, "name": "Manufactured M-Sand", "category": "Sand", "brand": "M Sand", "company": "Granite Crusher Works", "grade": "Zone II Fine", "unit": "cu ft", "current_price": 55.00, "previous_price": 56.00, "price_diff": -1.00, "pct_change": -1.78, "trend": "down", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Pune Building Materials", "location": "Pune, MH", "last_updated": now},
            {"id": 9, "name": "Natural River Sand", "category": "Sand", "brand": "River Sand", "company": "Dredged Basin Co", "grade": "Coarse Natural", "unit": "cu ft", "current_price": 85.00, "previous_price": 82.00, "price_diff": 3.00, "pct_change": 3.66, "trend": "up", "availability": "Limited Stock", "stock_status": "Low Stock", "supplier_name": "Pune Building Materials", "location": "Pune, MH", "last_updated": now},

            # Paint
            {"id": 10, "name": "Asian Paints Royale Emulsion", "category": "Paint", "brand": "Asian Paints", "company": "Asian Paints Ltd", "grade": "Luxury Interior Silk", "unit": "Liter", "current_price": 480.00, "previous_price": 475.00, "price_diff": 5.00, "pct_change": 1.05, "trend": "up", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Metro Hardware Depot", "location": "Mumbai, MH", "last_updated": now},
            {"id": 11, "name": "Berger Silk Breathe Easy", "category": "Paint", "brand": "Berger", "company": "Berger Paints", "grade": "Silk Washable", "unit": "Liter", "current_price": 420.00, "previous_price": 420.00, "price_diff": 0.00, "pct_change": 0.00, "trend": "stable", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Metro Hardware Depot", "location": "Mumbai, MH", "last_updated": now},

            # Plumbing & Electrical
            {"id": 12, "name": "Astral CPVC Pro Pipes (1\")", "category": "Plumbing", "brand": "Astral", "company": "Astral Poly Technik", "grade": "SDR 11 CPVC", "unit": "meter", "current_price": 145.00, "previous_price": 142.00, "price_diff": 3.00, "pct_change": 2.11, "trend": "up", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Supreme Plumbing Depot", "location": "Ahmedabad, GJ", "last_updated": now},
            {"id": 13, "name": "Havells Flame Retardant Wire 2.5mm", "category": "Electrical", "brand": "Havells", "company": "Havells India", "grade": "FRLS 1100V", "unit": "meter", "current_price": 32.00, "previous_price": 31.00, "price_diff": 1.00, "pct_change": 3.23, "trend": "up", "availability": "In Stock", "stock_status": "High Stock", "supplier_name": "Apex Electrical Depot", "location": "Delhi NCR", "last_updated": now},
        ]

    def fetch_price_history(self, timeframe: str) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc)
        days = 7 if timeframe == "7D" else 30 if timeframe == "30D" else 90 if timeframe == "3M" else 180 if timeframe == "6M" else 365
        
        points = []
        base_steel = 64.00
        base_cement = 370.00

        step_days = max(1, days // 10)
        for i in range(days, -1, -step_days):
            date_str = (now - timedelta(days=i)).strftime("%b %d")
            steel_val = round(base_steel + (days - i) * 0.08 + (i % 3) * 0.5, 2)
            cement_val = round(base_cement + (days - i) * 0.40 + (i % 2) * 2.0, 2)
            points.append({
                "date": date_str,
                "Steel": steel_val,
                "Cement": cement_val,
                "Sand": round(52.00 + (days - i) * 0.10, 2)
            })

        return points

class PricingService:
    def __init__(self, provider: Optional[BasePricingProvider] = None):
        self.provider = provider or MockPricingProvider()

    def get_live_prices(self) -> List[Dict[str, Any]]:
        return self.provider.fetch_live_prices()

    def get_price_history(self, timeframe: str = "30D") -> List[Dict[str, Any]]:
        return self.provider.fetch_price_history(timeframe)

    def compare_brands(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        return [
            # Cement comparison
            {"brand_name": "UltraTech Super", "manufacturer": "UltraTech Cement", "current_price": 385.00, "grade": "PPC 53 Grade", "unit": "50kg Bag", "quality_rating": 4.9, "popularity": "Very High (42% Share)", "estimated_delivery": "Same Day (24 hrs)", "warranty": "Lifetime Guarantee against Dampness", "user_rating": 4.9, "category": "Cement"},
            {"brand_name": "ACC Concrete+ Gold", "manufacturer": "ACC Limited", "current_price": 375.00, "grade": "OPC 53 Grade", "unit": "50kg Bag", "quality_rating": 4.8, "popularity": "High (28% Share)", "estimated_delivery": "24 Hours", "warranty": "Water Shield Certificate", "user_rating": 4.8, "category": "Cement"},
            {"brand_name": "Ramco Supergrade", "manufacturer": "Ramco Cements", "current_price": 360.00, "grade": "PPC Water Shield", "unit": "50kg Bag", "quality_rating": 4.7, "popularity": "Moderate (15% Share)", "estimated_delivery": "48 Hours", "warranty": "Standard Batch Seal", "user_rating": 4.6, "category": "Cement"},
            
            # Steel comparison
            {"brand_name": "Tata Tiscon 550SD", "manufacturer": "Tata Steel", "current_price": 66.50, "grade": "Fe 550D TMT", "unit": "kg", "quality_rating": 4.9, "popularity": "Market Leader", "estimated_delivery": "Immediate Mill Delivery", "warranty": "Super Ductile Seismic Certificate", "user_rating": 4.9, "category": "Steel"},
            {"brand_name": "JSW Neosteel", "manufacturer": "JSW Steel", "current_price": 63.50, "grade": "Fe 500D TMT", "quality_rating": 4.8, "unit": "kg", "popularity": "High Value Favorite", "estimated_delivery": "24 Hours", "warranty": "Clean Steel Certificate", "user_rating": 4.8, "category": "Steel"},
            {"brand_name": "Vizag TMT Rebar", "manufacturer": "RINL Vizag", "current_price": 61.00, "grade": "Fe 500D TMT", "unit": "kg", "quality_rating": 4.6, "popularity": "Budget Choice", "estimated_delivery": "48 Hours", "warranty": "PSU Steel Quality Mark", "user_rating": 4.6, "category": "Steel"},

            # Paint comparison
            {"brand_name": "Asian Paints Royale", "manufacturer": "Asian Paints", "current_price": 480.00, "grade": "Luxury Interior Silk", "unit": "Liter", "quality_rating": 4.9, "popularity": "Market Leader", "estimated_delivery": "Same Day", "warranty": "7 Years Washable Sheen", "user_rating": 4.9, "category": "Paint"},
            {"brand_name": "Berger Silk Breathe Easy", "manufacturer": "Berger Paints", "current_price": 420.00, "grade": "Silk Washable", "unit": "Liter", "quality_rating": 4.7, "popularity": "High Demand", "estimated_delivery": "24 Hours", "warranty": "5 Years Anti-Bacterial", "user_rating": 4.7, "category": "Paint"},

            # Plumbing comparison
            {"brand_name": "Astral CPVC Pro", "manufacturer": "Astral Poly Technik", "current_price": 145.00, "grade": "SDR 11 CPVC", "unit": "meter", "quality_rating": 4.9, "popularity": "Market Leader", "estimated_delivery": "Same Day", "warranty": "50 Years Leak Proof", "user_rating": 4.9, "category": "Plumbing"},
            {"brand_name": "Supreme FlowGuard", "manufacturer": "Supreme Industries", "current_price": 130.00, "grade": "CPVC Class 1", "unit": "meter", "quality_rating": 4.7, "popularity": "High Value", "estimated_delivery": "24 Hours", "warranty": "25 Years Standard Seal", "user_rating": 4.7, "category": "Plumbing"},
        ]

    def get_market_analytics(self) -> Dict[str, Any]:
        prices = self.get_live_prices()
        cement_prices = [p["current_price"] for p in prices if p["category"] == "Cement"]
        steel_prices = [p["current_price"] for p in prices if p["category"] == "Steel"]

        avg_cement = round(sum(cement_prices) / len(cement_prices), 2) if cement_prices else 373.00
        avg_steel = round(sum(steel_prices) / len(steel_prices), 2) if steel_prices else 63.60

        return {
            "avg_cement_price": avg_cement,
            "avg_steel_price": avg_steel,
            "market_price_index": 108.4,
            "weekly_change_pct": 1.4,
            "monthly_change_pct": 3.2,
            "top_rising": [
                {"name": "Havells Copper Wire", "pct": "+3.23%", "price": "₹32.00/m"},
                {"name": "Natural River Sand", "pct": "+3.66%", "price": "₹85.00/cuft"},
                {"name": "Tata Tiscon 550SD", "pct": "+2.31%", "price": "₹66.50/kg"},
            ],
            "top_falling": [
                {"name": "Vizag TMT Rebar", "pct": "-2.40%", "price": "₹61.00/kg"},
                {"name": "Ramco Supergrade", "pct": "-1.37%", "price": "₹360.00/bag"},
                {"name": "Manufactured M-Sand", "pct": "-1.78%", "price": "₹55.00/cuft"},
            ],
            "ai_insights": [
                "Primary TMT rebar steel prices are projected to rise +3.2% next week due to domestic iron ore futures.",
                "Buying UltraTech or ACC cement today locks in zero-surge rates before end-of-month supplier revisions.",
                "JSW Neosteel currently offers the highest cost-to-ductility ratio (₹63.50/kg for Fe 500D).",
                "Substituting Manufactured M-Sand for River Sand saves ₹30.00 per cu ft (~35% masonry sand savings)."
            ]
        }
