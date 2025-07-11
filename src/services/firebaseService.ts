import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  FarmerProfile, 
  CropDecision, 
  WeeklyPlan, 
  SoilTest, 
  DiseaseReport,
  PriceQuery,
  PriceHistory,
  IrrigationRecord,
  HarvestPrediction,
  Reminder,
  ExpertRequest
} from '../types';

export const firebaseService = {
  // Farmer Authentication
  async loginFarmer(name: string, place: string): Promise<FarmerProfile | null> {
    try {
      const q = query(
        collection(db, 'farmer_profiles'),
        where('name', '==', name),
        where('place', '==', place)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate(),
        updated_at: doc.data().updated_at?.toDate()
      } as FarmerProfile;
    } catch (error) {
      console.error('Error logging in farmer:', error);
      return null;
    }
  },

  // Get farmer data
  async getFarmerData(farmerId: string) {
    try {
      const [
        cropDecisions,
        weeklyPlans,
        soilTests,
        diseaseReports,
        priceQueries,
        irrigationRecords,
        harvestPredictions,
        reminders
      ] = await Promise.all([
        this.getCropDecisions(farmerId),
        this.getWeeklyPlans(farmerId),
        this.getSoilTests(farmerId),
        this.getDiseaseReports(farmerId),
        this.getPriceQueries(farmerId),
        this.getIrrigationRecords(farmerId),
        this.getHarvestPredictions(farmerId),
        this.getReminders(farmerId)
      ]);

      return {
        cropDecisions,
        weeklyPlans,
        soilTests,
        diseaseReports,
        priceQueries,
        irrigationRecords,
        harvestPredictions,
        reminders
      };
    } catch (error) {
      console.error('Error fetching farmer data:', error);
      return null;
    }
  },

  async getCropDecisions(farmerId: string): Promise<CropDecision[]> {
    const q = query(
      collection(db, 'crop_decisions'),
      where('farmer_id', '==', farmerId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    })) as CropDecision[];
    
    // Sort in memory instead of using orderBy
    return results.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  },

  async getWeeklyPlans(farmerId: string): Promise<WeeklyPlan[]> {
    const q = query(
      collection(db, 'weekly_plans'),
      where('farmer_id', '==', farmerId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      week_start: doc.data().week_start?.toDate()
    })) as WeeklyPlan[];
    
    // Sort in memory instead of using orderBy
    return results.sort((a, b) => {
      if (!a.week_start || !b.week_start) return 0;
      return b.week_start.getTime() - a.week_start.getTime();
    });
  },

  async getSoilTests(farmerId: string): Promise<SoilTest[]> {
    const q = query(
      collection(db, 'soil_tests'),
      where('farmer_id', '==', farmerId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      test_date: doc.data().test_date?.toDate()
    })) as SoilTest[];
    
    // Sort in memory instead of using orderBy
    return results.sort((a, b) => {
      if (!a.test_date || !b.test_date) return 0;
      return b.test_date.getTime() - a.test_date.getTime();
    });
  },

  async getDiseaseReports(farmerId: string): Promise<DiseaseReport[]> {
    const q = query(
      collection(db, 'disease_reports'),
      where('farmer_id', '==', farmerId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      report_date: doc.data().report_date?.toDate()
    })) as DiseaseReport[];
    
    // Sort in memory instead of using orderBy
    return results.sort((a, b) => {
      if (!a.report_date || !b.report_date) return 0;
      return b.report_date.getTime() - a.report_date.getTime();
    });
  },

  async getPriceQueries(farmerId: string): Promise<PriceQuery[]> {
    const q = query(
      collection(db, 'price_queries'),
      where('farmer_id', '==', farmerId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      query_date: doc.data().query_date?.toDate()
    })) as PriceQuery[];
    
    // Sort in memory instead of using orderBy
    return results.sort((a, b) => {
      if (!a.query_date || !b.query_date) return 0;
      return b.query_date.getTime() - a.query_date.getTime();
    });
  },

  async getIrrigationRecords(farmerId: string): Promise<IrrigationRecord[]> {
    const q = query(
      collection(db, 'irrigation_records'),
      where('farmer_id', '==', farmerId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      recorded_date: doc.data().recorded_date?.toDate()
    })) as IrrigationRecord[];
    
    // Sort in memory instead of using orderBy
    return results.sort((a, b) => {
      if (!a.recorded_date || !b.recorded_date) return 0;
      return b.recorded_date.getTime() - a.recorded_date.getTime();
    });
  },

  async getHarvestPredictions(farmerId: string): Promise<HarvestPrediction[]> {
    const q = query(
      collection(db, 'harvest_predictions'),
      where('farmer_id', '==', farmerId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      predicted_date: doc.data().predicted_date?.toDate()
    })) as HarvestPrediction[];
    
    // Sort in memory instead of using orderBy
    return results.sort((a, b) => {
      if (!a.predicted_date || !b.predicted_date) return 0;
      return b.predicted_date.getTime() - a.predicted_date.getTime();
    });
  },

  async getReminders(farmerId: string): Promise<Reminder[]> {
    const q = query(
      collection(db, 'reminders'),
      where('farmer_id', '==', farmerId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date_time: doc.data().date_time?.toDate(),
      created_at: doc.data().created_at?.toDate()
    })) as Reminder[];
    
    // Sort in memory instead of using orderBy
    return results.sort((a, b) => {
      if (!a.date_time || !b.date_time) return 0;
      return a.date_time.getTime() - b.date_time.getTime();
    });
  },

  // Admin functions
  async getAllFarmers(): Promise<FarmerProfile[]> {
    const querySnapshot = await getDocs(collection(db, 'farmer_profiles'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as FarmerProfile[];
  },

  async getPriceHistory(): Promise<PriceHistory[]> {
    const q = query(
      collection(db, 'price_history'),
      orderBy('date', 'desc'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate()
    })) as PriceHistory[];
  },

  async getAllExpertRequests(): Promise<ExpertRequest[]> {
    const querySnapshot = await getDocs(collection(db, 'expert_requests'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate()
    })) as ExpertRequest[];
  },

  async getAllDiseaseReports(): Promise<DiseaseReport[]> {
    const querySnapshot = await getDocs(collection(db, 'disease_reports'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      report_date: doc.data().report_date?.toDate()
    })) as DiseaseReport[];
  },

  async getSystemStats() {
    try {
      const [farmers, allCropDecisions, allSoilTests, allDiseaseReports, allExpertRequests] = await Promise.all([
        this.getAllFarmers(),
        getDocs(collection(db, 'crop_decisions')),
        getDocs(collection(db, 'soil_tests')),
        getDocs(collection(db, 'disease_reports')),
        this.getAllExpertRequests()
      ]);

      return {
        totalFarmers: farmers.length,
        totalCropDecisions: allCropDecisions.size,
        totalSoilTests: allSoilTests.size,
        totalDiseaseReports: allDiseaseReports.size,
        totalExpertRequests: allExpertRequests.length,
        farmers,
        expertRequests: allExpertRequests,
        diseaseReports: allDiseaseReports.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          report_date: doc.data().report_date?.toDate()
        })) as DiseaseReport[]
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      return null;
    }
  }
};