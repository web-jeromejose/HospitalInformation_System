using OTEf.Core.Interface;
using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace OTEf.Impl
{
    public class MasterFileBusiness : BusinessBase, IMasterFileBusiness
    {

        public MasterFileBusiness(IDataManager manager)
            : base(manager)
        {
        }

        #region[OTItem]
        public List<OTItem> GetAllOTItems()
        {
            return dataManager.OTItem.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public OTItem GetOTItem(int id)
        {
            return dataManager.OTItem.GetById(id);
        }

        public List<OTItem> GetOTItems(int[] ids)
        {
            return dataManager.OTItem.GetAllByCriteria(i=>ids.Contains(i.Id)).ToList();
        }
        public int AddOTItem(OTItem item)
        {
            dataManager.OTItem.Add(item);
            dataManager.OTItem.Commit();

            return item.Id;
        }

        public bool UpdateOTItem(OTItem item)
        {
            var otitem = dataManager.OTItem.GetById(item.Id);
            otitem.Name = item.Name;
            otitem.ModifiedAt = item.ModifiedAt;
            otitem.ModifiedById = item.ModifiedById;
            otitem.ModifiedByName = item.ModifiedByName;

            dataManager.OTItem.Update(otitem);
            dataManager.OTItem.Commit();

            return true;

        }

        public bool DeleteOTItem(OTItem item)
        {
            var otitem = dataManager.OTItem.GetById(item.Id);

            otitem.ModifiedAt = item.ModifiedAt;
            otitem.ModifiedById = item.ModifiedById;
            otitem.ModifiedByName = item.ModifiedByName;
            otitem.Active = false;

            dataManager.OTItem.Update(otitem);
            dataManager.OTItem.Commit();

            return true;
        }

        public List<OTItem> GetPagedOTItemList(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.OTItem.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.Name.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(OTItem).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(OTItem).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }
        #endregion

        #region[OTInstrument]
        public List<OTInstrument> GetAllOTInstrument()
        {
            return dataManager.OTInstrument.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public OTInstrument GetOTInstrument(int id)
        {
            return dataManager.OTInstrument.GetById(id);
        }

        public List<OTInstrument> OTInstruments(int[] ids)
        {
            return dataManager.OTInstrument.GetAllByCriteria(i => ids.Contains(i.Id)).ToList();
        }

        public int AddOTInstrument(OTInstrument item)
        {
            dataManager.OTInstrument.Add(item);
            dataManager.OTInstrument.Commit();

            return item.Id;
        }

        public bool UpdateOTInstrument(OTInstrument item)
        {
            var otinstrument = dataManager.OTInstrument.GetById(item.Id);
            otinstrument.Name = item.Name;
            otinstrument.ModifiedAt = item.ModifiedAt;
            otinstrument.ModifiedById = item.ModifiedById;
            otinstrument.ModifiedByName = item.ModifiedByName;

            dataManager.OTInstrument.Update(otinstrument);
            dataManager.OTInstrument.Commit();
            return true;
        }

        public bool DeleteOTInstrument(OTInstrument item)
        {
            var otinstrument = dataManager.OTInstrument.GetById(item.Id);
            otinstrument.Active = false;
            otinstrument.ModifiedAt = item.ModifiedAt;
            otinstrument.ModifiedById = item.ModifiedById;
            otinstrument.ModifiedByName = item.ModifiedByName;

            dataManager.OTInstrument.Update(otinstrument);
            dataManager.OTInstrument.Commit();
            return true;
        }


        public List<OTInstrument> GetPagedOTInstrumentList(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.OTInstrument.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.Name.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(OTInstrument).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(OTInstrument).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }

      
        #endregion

        #region[OTUnitOfMeasurement]
        public List<OTUnitOfMeasurement> GetAllOTUnitOfMeasurement()
        {
            return dataManager.OTUnitOfMeasurement.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public OTUnitOfMeasurement GetOTUnitOfMeasurement(int id)
        {
            return dataManager.OTUnitOfMeasurement.GetById(id);
        }

        public int AddOTUnitOfMeasurement(OTUnitOfMeasurement unit)
        {
            dataManager.OTUnitOfMeasurement.Add(unit);
            dataManager.OTUnitOfMeasurement.Commit();

            return unit.Id;
        }

        public bool UpdateOTUnitOfMeasurement(OTUnitOfMeasurement unit)
        {
            var mUnit = dataManager.OTUnitOfMeasurement.GetById(unit.Id);
            mUnit.Name = unit.Name;
            mUnit.ModifiedAt = unit.ModifiedAt;
            mUnit.ModifiedById = unit.ModifiedById;
            mUnit.ModifiedByName = unit.ModifiedByName;

            dataManager.OTUnitOfMeasurement.Update(mUnit);
            dataManager.OTUnitOfMeasurement.Commit();
            return true;
        }

        public bool DeleteOTUnitOfMeasurement(OTUnitOfMeasurement unit)
        {
            var mUnit = dataManager.OTUnitOfMeasurement.GetById(unit.Id);
            mUnit.Active = false;
            mUnit.ModifiedAt = unit.ModifiedAt;
            mUnit.ModifiedById = unit.ModifiedById;
            mUnit.ModifiedByName = unit.ModifiedByName;

            dataManager.OTUnitOfMeasurement.Update(mUnit);
            dataManager.OTUnitOfMeasurement.Commit();
            return true;
        }

        public List<OTUnitOfMeasurement> GetPagedOTUnitOfMeasurementList(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.OTUnitOfMeasurement.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.Name.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(OTUnitOfMeasurement).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(OTUnitOfMeasurement).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }
        #endregion

        #region[PreOperativeChart]
        public List<PreOperativeChart> GetAllPreOperativeChart()
        {
            return dataManager.PreOperativeChart.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public PreOperativeChart GetPreOperativeChart(int id)
        {
            return dataManager.PreOperativeChart.GetById(id);
        }

        public int AddPreOperativeChart(PreOperativeChart chart)
        {
            dataManager.PreOperativeChart.Add(chart);
            dataManager.PreOperativeChart.Commit();

            return chart.Id;
        }

        public bool UpdatePreOperativeChart(PreOperativeChart chart)
        {
            var ochart = dataManager.PreOperativeChart.GetById(chart.Id);
            ochart.Name = chart.Name;
            ochart.ModifiedAt = chart.ModifiedAt;
            ochart.ModifiedById = chart.ModifiedById;
            ochart.ModifiedByName = chart.ModifiedByName;

            dataManager.PreOperativeChart.Update(ochart);
            dataManager.PreOperativeChart.Commit();

            return true;
        }

        public bool DeletePreOperativeChart(PreOperativeChart chart)
        {
            var ochart = dataManager.PreOperativeChart.GetById(chart.Id);

            ochart.ModifiedAt = chart.ModifiedAt;
            ochart.ModifiedById = chart.ModifiedById;
            ochart.ModifiedByName = chart.ModifiedByName;
            ochart.Active = false;

            dataManager.PreOperativeChart.Update(ochart);
            dataManager.PreOperativeChart.Commit();

            return true;
        }

        public List<PreOperativeChart> GetPagedPreOperativeChartList(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {

            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.PreOperativeChart.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.Name.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(PreOperativeChart).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(PreOperativeChart).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }

        public List<PreOperativeChart> GetPreOperativeCharts(int[] ids)
        {
            return dataManager.PreOperativeChart.GetAllByCriteria(i => ids.Contains(i.Id)).ToList();
        }
        #endregion

        #region[PreOperativeCheck]
        public List<PreOperativeCheck> GetAllPreOperativeCheck()
        {
            return dataManager.PreOperativeCheck.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public PreOperativeCheck GetPreOperativeCheck(int id)
        {
            return dataManager.PreOperativeCheck.GetById(id);
        }

        public int AddPreOperativeCheck(PreOperativeCheck item)
        {
            dataManager.PreOperativeCheck.Add(item);
            dataManager.PreOperativeCheck.Commit();

            return item.Id;
        }

        public bool UpdatePreOperativeCheck(PreOperativeCheck item)
        {
            var oitem = dataManager.PreOperativeCheck.GetById(item.Id);
            oitem.Name = item.Name;
            oitem.ModifiedAt = item.ModifiedAt;
            oitem.ModifiedById = item.ModifiedById;
            oitem.ModifiedByName = item.ModifiedByName;

            dataManager.PreOperativeCheck.Update(oitem);
            dataManager.PreOperativeCheck.Commit();

            return true;
        }

        public bool DeletePreOperativeCheck(PreOperativeCheck item)
        {
            var oitem = dataManager.PreOperativeCheck.GetById(item.Id);

            oitem.ModifiedAt = item.ModifiedAt;
            oitem.ModifiedById = item.ModifiedById;
            oitem.ModifiedByName = item.ModifiedByName;
            oitem.Active = false;

            dataManager.PreOperativeCheck.Update(oitem);
            dataManager.PreOperativeCheck.Commit();
            return true;
        }

        public List<PreOperativeCheck> GetPagedPreOperativeCheckList(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {

            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.PreOperativeCheck.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.Name.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(PreOperativeCheck).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(PreOperativeCheck).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }

        public List<PreOperativeCheck> GetPreOperativeCheck(int[] ids)
        {
            return dataManager.PreOperativeCheck.GetAllByCriteria(i => ids.Contains(i.Id)).ToList();
        }
        #endregion 

        #region[PreOperativeMedication]
        public List<PreOperativeMedication> GetAllPreOperativeMedication()
        {
            return dataManager.PreOperativeMedication.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public PreOperativeMedication GetPreOperativeMedication(int id)
        {
            return dataManager.PreOperativeMedication.GetById(id);
        }

        public int AddPreOperativeMedication(PreOperativeMedication medication)
        {
            dataManager.PreOperativeMedication.Add(medication);
            dataManager.PreOperativeMedication.Commit();

            return medication.Id;
        }

        public bool UpdatePreOperativeMedication(PreOperativeMedication medication)
        {
            var omedication = dataManager.PreOperativeMedication.GetById(medication.Id);
            omedication.Name = medication.Name;
            omedication.HasOperationalValue = medication.HasOperationalValue;
            omedication.ModifiedAt = medication.ModifiedAt;
            omedication.ModifiedById = medication.ModifiedById;
            omedication.ModifiedByName = medication.ModifiedByName;


            dataManager.PreOperativeMedication.Update(omedication);
            dataManager.PreOperativeMedication.Commit();
            return true;
        }

        public bool DeletePreOperativeMedication(PreOperativeMedication medication)
        {
            var omedication = dataManager.PreOperativeMedication.GetById(medication.Id);

            omedication.ModifiedAt = medication.ModifiedAt;
            omedication.ModifiedById = medication.ModifiedById;
            omedication.ModifiedByName = medication.ModifiedByName;
            omedication.Active = false;

            dataManager.PreOperativeMedication.Update(omedication);
            dataManager.PreOperativeMedication.Commit();
            return true;
        }

        public List<PreOperativeMedication> GetPagedPreOperativeMedicationList(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {

            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.PreOperativeMedication.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.Name.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(PreOperativeMedication).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(PreOperativeMedication).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
     
        }

        public List<PreOperativeMedication> GetPreOperativeMedications(int[] ids)
        {
            return dataManager.PreOperativeMedication.GetAllByCriteria(i => ids.Contains(i.Id)).ToList();
        }

        #endregion



    }
}
