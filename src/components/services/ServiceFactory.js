import LocalDataService from './LocalDataService';
import RemoteDataService from './RemoteDataService';
import MarketDataService from './MarketDataService';
import TimePeriodService from './TimePeriodService';
import FilterService from './FilterService';
import SectorCategoryService from './SectorCategoryService';
import ExportService from './ExportService';
import CacheService from './CacheService';
import UserService from './UserService';

export default class ServiceFactory {
  getDataService() {
    if (process.env.NODE_ENV === 'development') {
      return new LocalDataService()
    } else {
      return new RemoteDataService()
    }
  }

  getCacheService() {
    return new CacheService();
  }

  getTimePeriodService() {
    return new TimePeriodService()
  }

  getSectorCategoryService() {
    return new SectorCategoryService()
  }

  getFilterService() {
    return new FilterService();
  }

  getExportService() {
    return new ExportService();
  }

  getMarketService() {
    return new MarketDataService();
  }

  getUserService() {
    return new UserService();
  }
}
