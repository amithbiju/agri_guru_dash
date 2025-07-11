export interface FarmerProfile {
  id: string;
  name: string;
  age: number;
  land_size: number;
  soil_type: string;
  experience_years: number;
  crops_grown: string[];
  place: string;
  created_at: Date;
  updated_at: Date;
}

export interface CropDecision {
  id: string;
  farmer_id: string;
  event: string;
  decision: string;
  result: string;
  timestamp: Date;
}

export interface WeeklyPlan {
  id: string;
  farmer_id: string;
  week_start: Date;
  crop_stage: string;
  weather_considerations: string;
  tasks: Task[];
}

export interface Task {
  task: string;
  priority: 'high' | 'medium' | 'low';
  estimated_duration: number;
  weather_dependent: boolean;
}

export interface SoilTest {
  id: string;
  farmer_id: string;
  soil_type: string;
  pH: number;
  organic_matter: number;
  crop_type: string;
  test_date: Date;
  recommendations: {
    advice: string;
    fertilizer_needed: boolean;
  };
}

export interface DiseaseReport {
  id: string;
  farmer_id: string;
  crop_name: string;
  symptoms: string;
  diagnosis: {
    disease_name: string;
    severity: 'low' | 'medium' | 'high';
    treatment: string;
  };
  report_date: Date;
  location: string;
}

export interface PriceQuery {
  id: string;
  farmer_id: string;
  crop_name: string;
  location: string;
  queried_price: number;
  query_date: Date;
}

export interface PriceHistory {
  id: string;
  crop_name: string;
  location: string;
  date: Date;
  price: number;
}

export interface IrrigationRecord {
  id: string;
  farmer_id: string;
  crop_type: string;
  prediction: {
    water_needed: number;
    next_irrigation: Date;
    weather_factor: number;
  };
  recorded_date: Date;
}

export interface HarvestPrediction {
  id: string;
  farmer_id: string;
  prediction: {
    crop_type: string;
    expected_yield: number;
    harvest_date: Date;
    quality_score: number;
  };
  predicted_date: Date;
}

export interface Reminder {
  id: string;
  farmer_id: string;
  task: string;
  date_time: Date;
  is_completed: boolean;
  created_at: Date;
}

export interface ExpertRequest {
  id: string;
  farmer_id: string;
  question: string;
  expertise_needed: string;
  status: 'pending' | 'connected' | 'resolved';
  created_at: Date;
}