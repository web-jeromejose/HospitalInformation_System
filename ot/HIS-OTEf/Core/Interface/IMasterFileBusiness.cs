using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Interface
{
    public interface IMasterFileBusiness 
    {
        List<OTItem> GetAllOTItems();
        OTItem GetOTItem(int id);
        int AddOTItem(OTItem item);
        bool UpdateOTItem(OTItem item);
        bool DeleteOTItem(OTItem item);
        List<OTItem> GetOTItems(int[] ids);
        List<OTItem> GetPagedOTItemList(string searchBy, int take, int skip, string sortBy,
                                                    bool sortDir, out int filteredResultsCount, out int totalResultsCount);

        List<OTInstrument> GetAllOTInstrument();
        OTInstrument GetOTInstrument(int id);
        int AddOTInstrument(OTInstrument item);
        bool UpdateOTInstrument(OTInstrument item);
        bool DeleteOTInstrument(OTInstrument item);
        List<OTInstrument> OTInstruments(int[] ids);
        List<OTInstrument> GetPagedOTInstrumentList(string searchBy, int take, int skip, string sortBy,
                                                  bool sortDir, out int filteredResultsCount, out int totalResultsCount);

        List<OTUnitOfMeasurement> GetAllOTUnitOfMeasurement();
        OTUnitOfMeasurement GetOTUnitOfMeasurement(int id);
        int AddOTUnitOfMeasurement(OTUnitOfMeasurement unit);
        bool UpdateOTUnitOfMeasurement(OTUnitOfMeasurement unit);
        bool DeleteOTUnitOfMeasurement(OTUnitOfMeasurement unit);
        List<OTUnitOfMeasurement> GetPagedOTUnitOfMeasurementList(string searchBy, int take, int skip, string sortBy,
                                                 bool sortDir, out int filteredResultsCount, out int totalResultsCount);


        List<PreOperativeChart> GetAllPreOperativeChart();
        PreOperativeChart GetPreOperativeChart(int id);
        int AddPreOperativeChart(PreOperativeChart chart);
        bool UpdatePreOperativeChart(PreOperativeChart chart);
        bool DeletePreOperativeChart(PreOperativeChart chart);
        List<PreOperativeChart> GetPagedPreOperativeChartList(string searchBy, int take, int skip, string sortBy,
                                                 bool sortDir, out int filteredResultsCount, out int totalResultsCount);
        List<PreOperativeChart> GetPreOperativeCharts(int[] ids);


        List<PreOperativeCheck> GetAllPreOperativeCheck();
        PreOperativeCheck GetPreOperativeCheck(int id);
        int AddPreOperativeCheck(PreOperativeCheck item);
        bool UpdatePreOperativeCheck(PreOperativeCheck item);
        bool DeletePreOperativeCheck(PreOperativeCheck item);
        List<PreOperativeCheck> GetPagedPreOperativeCheckList(string searchBy, int take, int skip, string sortBy,
                                                 bool sortDir, out int filteredResultsCount, out int totalResultsCount);
        List<PreOperativeCheck> GetPreOperativeCheck(int[] ids);

        List<PreOperativeMedication> GetAllPreOperativeMedication();
        PreOperativeMedication GetPreOperativeMedication(int id);
        int AddPreOperativeMedication(PreOperativeMedication medication);
        bool UpdatePreOperativeMedication(PreOperativeMedication medication);
        bool DeletePreOperativeMedication(PreOperativeMedication medication);
        List<PreOperativeMedication> GetPagedPreOperativeMedicationList(string searchBy, int take, int skip, string sortBy,
                                                 bool sortDir, out int filteredResultsCount, out int totalResultsCount);
        List<PreOperativeMedication> GetPreOperativeMedications(int[] ids);


    }
}
