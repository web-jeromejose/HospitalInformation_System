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
    public class OperationBusiness : BusinessBase, IOperationBusiness 
    {
         public OperationBusiness(IDataManager manager)
            : base(manager)
        {
        }

         #region [OT Room Count Sheet]
         public List<OTRoomCountSheet> GetAllOTRoomCountSheets()
        {
            return dataManager.OTRoomCountSheet.GetAllByCriteria(i=>i.Active == true).ToList();
        }

        public OTRoomCountSheet GetOTRoomCountSheet(int id)
        {
            return dataManager.OTRoomCountSheet.GetById(id);
        }

        public int AddOTRoomCountSheet(OTRoomCountSheet countsheet)
        {
            //reattached context reference model and make it tolist to evaluate/update object bcoz of lazy loading
            if (countsheet.OTItems != null)
            {
                countsheet.OTItems.Select(i => { i.Unit = dataManager.OTUnitOfMeasurement.GetById(i.OTUnitOfMeasurementId); return i; }).ToList();
                countsheet.OTItems.Select(i => { i.Item = dataManager.OTItem.GetById(i.OTItemId); return i; }).ToList();
            }

            if(countsheet.BasicInstruments != null)
            countsheet.BasicInstruments.Select(i => { i.Instrument = dataManager.OTInstrument.GetById(i.OTInstrumentId); return i; }).ToList();

            if (countsheet.SepareteInstruments != null)
            countsheet.SepareteInstruments.Select(i => { i.Instrument = dataManager.OTInstrument.GetById(i.OTInstrumentId); return i; }).ToList();

            dataManager.OTRoomCountSheet.Add(countsheet);
            dataManager.OTRoomCountSheet.Commit();
            return countsheet.Id;
        }

        public bool UpdateOTRoomCountSheet(OTRoomCountSheet data)
        {

            //delete removed items
            dataManager.OTItemCount.DeleteByCriteria
                (i =>  (data.OTItems == null || !data.OTItems.Any(a => a.Id == i.Id)) && i.OTRoomCountSheetId == data.Id);
            dataManager.OTBasicInstrumentCount.DeleteByCriteria
                (i =>  (data.BasicInstruments == null || !data.BasicInstruments.Any(a => a.Id == i.Id))
                && i.OTRoomCountSheetId == data.Id
                );
            dataManager.OTSeparateInstrumentCount.DeleteByCriteria
                (i => (data.SepareteInstruments == null ||!data.SepareteInstruments.Any(a => a.Id == i.Id))
                   && i.OTRoomCountSheetId  == data.Id);

            dataManager.OTItemCount.Commit();
            dataManager.OTBasicInstrumentCount.Commit();
            dataManager.OTSeparateInstrumentCount.Commit();


            //updating entity object
            var otItems = dataManager.OTItem.GetAll();
            var unitofmeasurement = dataManager.OTUnitOfMeasurement.GetAll();
            var instruments = dataManager.OTInstrument.GetAll();

            var sheet = dataManager.OTRoomCountSheet.GetById(data.Id);

            sheet.EntryDateTime                 = data.EntryDateTime;

            sheet.INT_CIRC_Nurse_CTR_Date       = data.INT_CIRC_Nurse_CTR_Date;
            sheet.INT_CIRC_Nurse_CTR_Id         = data.INT_CIRC_Nurse_CTR_Id;
            sheet.INT_CIRC_Nurse_CTR_Name       = data.INT_CIRC_Nurse_CTR_Name;

            sheet.INT_ScrubNurse_CTR_Date       = data.INT_ScrubNurse_CTR_Date;
            sheet.INT_ScrubNurse_CTR_Id         = data.INT_ScrubNurse_CTR_Id;
            sheet.INT_ScrubNurse_CTR_Name       = data.INT_ScrubNurse_CTR_Name;

            sheet.FNL_CIRC_Nurse_CTR_Date       = data.FNL_CIRC_Nurse_CTR_Date;
            sheet.FNL_CIRC_Nurse_CTR_Id         = data.FNL_CIRC_Nurse_CTR_Id;
            sheet.FNL_CIRC_Nurse_CTR_Name       = data.FNL_CIRC_Nurse_CTR_Name;

            sheet.FNL_ScrubNurse_CTR_Date       = data.FNL_ScrubNurse_CTR_Date;
            sheet.FNL_ScrubNurse_CTR_Id         = data.FNL_ScrubNurse_CTR_Id;
            sheet.FNL_ScrubNurse_CTR_Name       = data.FNL_ScrubNurse_CTR_Name;

            sheet.InformedNurseDir              = data.InformedNurseDir;
            sheet.InformedOTNurseMngr           = data.InformedOTNurseMngr;
            sheet.InformedSurgeon               = data.InformedSurgeon;
            sheet.ObtainXray                    = data.ObtainXray;
            sheet.Recount                       = data.Recount;
            sheet.CompleteIncidentRpt           = data.CompleteIncidentRpt;
        
            sheet.ModifiedAt                    = data.ModifiedAt;
            sheet.ModifiedById                  = data.ModifiedById;
            sheet.ModifiedByName                = data.ModifiedByName;

            sheet.PatientName                   = data.PatientName;
            sheet.RegistrationNo                = data.RegistrationNo;
            sheet.IssueAuthorityCode            = data.IssueAuthorityCode;
            sheet.ProcedureId                   = data.ProcedureId;
            sheet.ProcedureName                 = data.ProcedureName;
            sheet.SurgeonId                     = data.SurgeonId;
            sheet.SurgeonName                   = data.SurgeonName;

            //add new and update existing
            if (data.OTItems != null)
            {
                foreach (var item in data.OTItems.Where(i => i.OTItemId > 0 && i.OTUnitOfMeasurementId > 0))
                {
                    var itemCount = new OTItemCount();

                    if (sheet.OTItems.Any(i => i.Id == item.Id))
                    {
                        itemCount = sheet.OTItems.Single(i => i.Id == item.Id);
                    }
                    else
                    {
                        sheet.OTItems.Add(itemCount);
                    }
                    itemCount.OTItemId = item.OTItemId;
                    itemCount.Item = otItems.SingleOrDefault(i => i.Id == item.OTItemId);
                    itemCount.OTUnitOfMeasurementId = item.OTUnitOfMeasurementId;
                    itemCount.Unit = dataManager.OTUnitOfMeasurement.GetById(item.OTUnitOfMeasurementId);

                    itemCount.FirstCount = item.FirstCount;
                    itemCount.SecondCount = item.SecondCount;
                    itemCount.ThirdCount = item.ThirdCount;
                    itemCount.FinalCount = item.FinalCount;

                    itemCount.FirstAddition = item.FirstAddition;
                    itemCount.SecondAddition = item.SecondAddition;
                    itemCount.ThirdAddition = item.ThirdAddition;
                }
            }

            if (data.BasicInstruments != null)
            {
                foreach (var item in data.BasicInstruments.Where(i => i.OTInstrumentId > 0))
                {
                    var itemCount = new OTBasicInstrumentCount();

                    if (sheet.BasicInstruments.Any(i => i.Id == item.Id))
                    {
                        itemCount = sheet.BasicInstruments.Single(i => i.Id == item.Id);
                    }
                    else
                    {
                        sheet.BasicInstruments.Add(itemCount);
                    }
                    itemCount.OTInstrumentId = item.OTInstrumentId;
                    itemCount.Instrument = instruments.SingleOrDefault(i => i.Id == item.OTInstrumentId);


                    itemCount.InitialCount = item.InitialCount;
                    itemCount.SecondCount = item.SecondCount;
                    itemCount.FinalCount = item.FinalCount;
                }
            }

            if (data.SepareteInstruments != null)
            {
                foreach (var item in data.SepareteInstruments.Where(i => i.OTInstrumentId > 0))
                {
                    var itemCount = new OTSeparateInstrumentCount();

                    if (sheet.SepareteInstruments.Any(i => i.Id == item.Id))
                    {
                        itemCount = sheet.SepareteInstruments.Single(i => i.Id == item.Id);
                    }
                    else
                    {
                        sheet.SepareteInstruments.Add(itemCount);
                    }
                    itemCount.OTInstrumentId = item.OTInstrumentId;
                    itemCount.Instrument = instruments.SingleOrDefault(i => i.Id == item.OTInstrumentId);

                    itemCount.InitialCount = item.InitialCount;
                    itemCount.SecondCount = item.SecondCount;
                    itemCount.FinalCount = item.FinalCount;
                    itemCount.FirstAddition = item.FirstAddition;
                    itemCount.SecondAddition = item.SecondAddition;
                }

            }


            //update references
     
            sheet.OTItems.Select(i => { i.OTRoomCountSheet = sheet; i.OTRoomCountSheetId = sheet.Id; return i; }).ToList();
            sheet.SepareteInstruments.Select(i => { i.OTRoomCountSheet = sheet; i.OTRoomCountSheetId = sheet.Id; return i; }).ToList();
            sheet.BasicInstruments.Select(i => { i.OTRoomCountSheet = sheet; i.OTRoomCountSheetId = sheet.Id; return i; }).ToList();
            

            dataManager.OTRoomCountSheet.Update(sheet);
            dataManager.OTRoomCountSheet.Commit();
            return true;
        }

        public bool DeleteOTRoomCountSheet(OTRoomCountSheet countsheet)
        {
            var sheet = dataManager.OTRoomCountSheet.GetById(countsheet.Id);
            sheet.Active = false;
            sheet.ModifiedAt = countsheet.ModifiedAt;
            sheet.ModifiedById = countsheet.ModifiedById;
            sheet.ModifiedByName = countsheet.ModifiedByName;
            dataManager.OTRoomCountSheet.Update(countsheet);
            dataManager.OTRoomCountSheet.Commit();
            return true;
        }

        public List<OTRoomCountSheet> GetPagedOTRoomCountSheetList(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.OTRoomCountSheet.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.RegistrationNo.ToString().ToLower(), ".*" + searchBy.ToLower())
                                        || Regex.IsMatch(i.PatientName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                        || Regex.IsMatch(i.SurgeonName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                        || Regex.IsMatch(i.ProcedureName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(OTRoomCountSheet).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(OTRoomCountSheet).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }
        #endregion

         #region [Pre Operative CheckList]
        public List<PreOperativeChecklist> GetAllPreOperativeChecklist()
        {
            return dataManager.PreOperativeChecklist.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public PreOperativeChecklist GetPreOperativeChecklist(int id)
        {
           return dataManager.PreOperativeChecklist.GetById(id);
        }

        public int AddPreOperativeChecklist(PreOperativeChecklist checklist)
        {
            //reattached context reference model and make it tolist to evaluate/update object bcoz of lazy loading
            if (checklist.Medications != null)
            {
                checklist.Medications.Select(i => {
                    i.Medication = dataManager.PreOperativeMedication.GetById(i.PreOperativeMedicationId);
                    i.CreatedByName = checklist.CreatedByName;
                    i.CreatedById = checklist.CreatedById;
                    i.CreatedAt = checklist.CreatedAt;
                    return i; 
                }).ToList();
            }

            if (checklist.ChartEvaluations != null)
                checklist.ChartEvaluations.Select(i => { 
                    i.Chart = dataManager.PreOperativeChart.GetById(i.PreOperativeChartId);
                    i.CreatedByName = checklist.CreatedByName;
                    i.CreatedById = checklist.CreatedById;
                    i.CreatedAt = checklist.CreatedAt;
                    return i; 
                }).ToList();

            if (checklist.CheckedItems != null)
                checklist.CheckedItems.Select(i =>  {
                    i.CheckItem = dataManager.PreOperativeCheck.GetById(i.PreOperativeCheckId);
                    i.CreatedByName = checklist.CreatedByName;
                    i.CreatedById = checklist.CreatedById;
                    i.CreatedAt = checklist.CreatedAt;
                    return i;
                }).ToList();

            dataManager.PreOperativeChecklist.Add(checklist);
            dataManager.PreOperativeChecklist.Commit();
            return checklist.Id;
        }

        public bool UpdatePreOperativeChecklist(PreOperativeChecklist checklist)
        {
            
            var checkItems = dataManager.PreOperativeCheck.GetAll();
            var charts = dataManager.PreOperativeChart.GetAll();
            var medications = dataManager.PreOperativeMedication.GetAll();

            var ochecklist = dataManager.PreOperativeChecklist.GetById(checklist.Id);

            //updating properties
            ochecklist.IssueAuthorityCode       = checklist.IssueAuthorityCode;
            ochecklist.RegistrationNo           = checklist.RegistrationNo;
            ochecklist.PatientName              = checklist.PatientName;
            ochecklist.ProcedureId              = checklist.ProcedureId;
            ochecklist.ProcedureDate            = checklist.ProcedureDate;
            ochecklist.ProcedureName            = checklist.ProcedureName;
            ochecklist.BloodPressure            = checklist.BloodPressure;
            ochecklist.Pulse                    = checklist.Pulse;
            ochecklist.Temperature              = checklist.Temperature;
            ochecklist.ResperatoryRate          = checklist.ResperatoryRate;
            ochecklist.VitalSignEvalDatetime    = checklist.VitalSignEvalDatetime;
            ochecklist.PainScore                = checklist.PainScore;
            ochecklist.NPO_StartDatetime        = checklist.NPO_StartDatetime;
            ochecklist.Voided_StartDatetime     = checklist.Voided_StartDatetime;
            ochecklist.ORTrasferDatetime        = checklist.ORTrasferDatetime;
            ochecklist.ModifiedByName           = checklist.ModifiedByName;
            ochecklist.ModifiedAt               = checklist.ModifiedAt;
            ochecklist.ModifiedById             = checklist.ModifiedById;
            ochecklist.ORStaffComment = checklist.ORStaffComment;
            ochecklist.ORNurse_AcknowledgeDateTime = checklist.ORNurse_AcknowledgeDateTime;
            ochecklist.ORWard_AcknowledgeDateTime = checklist.ORWard_AcknowledgeDateTime;

            //updating the list
            if( ochecklist.Medications != null)
            ochecklist.Medications.Select(i =>{
                var updatedobject = checklist.Medications.SingleOrDefault(m => m.Id == i.Id);
                if (updatedobject == null)
                {
                    i.Active = false;
                    i.ModifiedByName    = checklist.ModifiedByName;
                    i.ModifiedById      = checklist.ModifiedById;
                    i.ModifiedAt        = checklist.ModifiedAt;
                }
                else
                {
                    if(i.PreOperativeMedicationId != updatedobject.PreOperativeMedicationId 
                        || i.IsGiven != updatedobject.IsGiven){
                            i.ModifiedByName    = checklist.ModifiedByName;
                            i.ModifiedById      = checklist.ModifiedById;
                            i.ModifiedAt        = checklist.ModifiedAt;
                    }
                    i.IsGiven       = updatedobject.IsGiven;
                    i.Medication    = medications.SingleOrDefault(x => x.Id == i.PreOperativeMedicationId);
                }
                return i; 
            }).ToList();

            if (ochecklist.ChartEvaluations != null)
            ochecklist.ChartEvaluations.Select(i => {
                var updatedobject = checklist.ChartEvaluations.SingleOrDefault(m => m.Id == i.Id);
                if (updatedobject == null)
                {
                    i.Active = false;
                    i.ModifiedByName    = checklist.ModifiedByName;
                    i.ModifiedById      = checklist.ModifiedById;
                    i.ModifiedAt        = checklist.ModifiedAt;
                }
                else
                {
                    if (i.PreOperativeChartId != updatedobject.PreOperativeChartId
                        || i.IsCorrect != updatedobject.IsCorrect)
                    {
                        i.ModifiedByName    = checklist.ModifiedByName;
                        i.ModifiedById      = checklist.ModifiedById;
                        i.ModifiedAt        = checklist.ModifiedAt;
                    }
                    i.IsCorrect = updatedobject.IsCorrect;
                    i.Chart     = charts.SingleOrDefault(x => x.Id == i.PreOperativeChartId);
                }
                return i; 
            }).ToList();

            if (ochecklist.CheckedItems != null)
            ochecklist.CheckedItems.Select(i => {
                var updatedobject = checklist.CheckedItems.SingleOrDefault(m => m.Id == i.Id);
                if (updatedobject == null)
                {
                    i.Active = false;
                    i.ModifiedByName    = checklist.ModifiedByName;
                    i.ModifiedById      = checklist.ModifiedById;
                    i.ModifiedAt        = checklist.ModifiedAt;
                }
                else
                {
                    if (i.PreOperativeCheckId != updatedobject.PreOperativeCheckId
                        || i.isPerformed != updatedobject.isPerformed)
                    {
                        i.ModifiedByName    = checklist.ModifiedByName;
                        i.ModifiedById      = checklist.ModifiedById;
                        i.ModifiedAt        = checklist.ModifiedAt;
                    }
                    i.isPerformed   = updatedobject.isPerformed;
                    i.CheckItem     = checkItems.SingleOrDefault(x => x.Id == i.PreOperativeCheckId);
                }
                return i; 
            }).ToList();

            //adding new data to list
            if (checklist.Medications != null)
            {
                foreach(var item in checklist.Medications.Where(i=> i.Id == 0)){
                    item.Medication = medications.SingleOrDefault(i => i.Id == item.PreOperativeMedicationId);
                    item.Active = true;
                    item.CreatedAt = checklist.ModifiedAt.Value;
                    item.CreatedById = checklist.ModifiedById;
                    item.CreatedByName = checklist.ModifiedByName;
                    ochecklist.Medications.Add(item);
                }
            }

            if (checklist.ChartEvaluations != null)
            {
                foreach (var item in checklist.ChartEvaluations.Where(i => i.Id == 0))
                {
                    item.Chart = charts.SingleOrDefault(i => i.Id == item.PreOperativeChartId);
                    item.Active = true;
                    item.CreatedAt = checklist.ModifiedAt.Value;
                    item.CreatedById = checklist.ModifiedById;
                    item.CreatedByName = checklist.ModifiedByName;

                    ochecklist.ChartEvaluations.Add(item);
                }
            }

            if (checklist.CheckedItems != null)
            {
                foreach (var item in checklist.CheckedItems.Where(i => i.Id == 0))
                {
                    item.CheckItem = checkItems.SingleOrDefault(i => i.Id == item.PreOperativeCheckId);
                    item.Active = true;
                    item.CreatedAt = checklist.ModifiedAt.Value;
                    item.CreatedById = checklist.ModifiedById;
                    item.CreatedByName = checklist.ModifiedByName;

                    ochecklist.CheckedItems.Add(item);
                }
            }

            dataManager.PreOperativeChecklist.Update(ochecklist);
            dataManager.PreOperativeChecklist.Commit();

            return true;
        }

        public bool DeletePreOperativeChecklist(PreOperativeChecklist checklist)
        {
            var ochecklist = dataManager.PreOperativeChecklist.GetById(checklist.Id);

            ochecklist.ModifiedByName = checklist.ModifiedByName;
            ochecklist.ModifiedAt = checklist.ModifiedAt;
            ochecklist.ModifiedById = checklist.ModifiedById;
            ochecklist.Active = false;

            dataManager.PreOperativeChecklist.Update(ochecklist);
            dataManager.PreOperativeChecklist.Commit();

            return true; 
        }

        public List<PreOperativeChecklist> GetPagedPreOperativeChecklist(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.PreOperativeChecklist.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.RegistrationNo.ToString().ToLower(), ".*" + searchBy.ToLower())
                                        || Regex.IsMatch(i.PatientName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                        || Regex.IsMatch(i.ProcedureName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(PreOperativeChecklist).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(PreOperativeChecklist).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }
        #endregion

        #region [OT Medical Report]
        public List<OTMedicalReport> GetAllOTMedicalReport()
        {
            return dataManager.OTMedicalReport.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public OTMedicalReport GetOTMedicalReport(int id)
        {
            return dataManager.OTMedicalReport.GetById(id);
        }

        public int AddOTMedicalReport(OTMedicalReport checklist)
        {
            //reattached context reference model and make it tolist to evaluate/update object bcoz of lazy loading
            //if (checklist.Medications != null)
            //{
            //    checklist.Medications.Select(i =>
            //    {
            //        i.Medication = dataManager.PreOperativeMedication.GetById(i.PreOperativeMedicationId);
            //        i.CreatedByName = checklist.CreatedByName;
            //        i.CreatedById = checklist.CreatedById;
            //        i.CreatedAt = checklist.CreatedAt;
            //        return i;
            //    }).ToList();
            //}

            //if (checklist.ChartEvaluations != null)
            //    checklist.ChartEvaluations.Select(i =>
            //    {
            //        i.Chart = dataManager.PreOperativeChart.GetById(i.PreOperativeChartId);
            //        i.CreatedByName = checklist.CreatedByName;
            //        i.CreatedById = checklist.CreatedById;
            //        i.CreatedAt = checklist.CreatedAt;
            //        return i;
            //    }).ToList();

            //if (checklist.CheckedItems != null)
            //    checklist.CheckedItems.Select(i =>
            //    {
            //        i.CheckItem = dataManager.PreOperativeCheck.GetById(i.PreOperativeCheckId);
            //        i.CreatedByName = checklist.CreatedByName;
            //        i.CreatedById = checklist.CreatedById;
            //        i.CreatedAt = checklist.CreatedAt;
            //        return i;
            //    }).ToList();

            dataManager.OTMedicalReport.Add(checklist);
            dataManager.OTMedicalReport.Commit();
            return checklist.Id;
        }

        public bool UpdateOTMedicalReport(OTMedicalReport checklist)
        {

           
            var ochecklist = dataManager.OTMedicalReport.GetById(checklist.Id);

            //updating properties
            ochecklist.IssueAuthorityCode = checklist.IssueAuthorityCode;
            ochecklist.RegistrationNo = checklist.RegistrationNo;
            ochecklist.PatientName = checklist.PatientName;
            ochecklist.MedicalReportDate = checklist.MedicalReportDate;
            ochecklist.Age = checklist.Age;
            ochecklist.GenderId = checklist.GenderId;
            ochecklist.GenderName = checklist.GenderName;
            ochecklist.NationalityId = checklist.NationalityId;
            ochecklist.NationalityName = checklist.NationalityName;
            ochecklist.Complaints = checklist.Complaints;
            ochecklist.Examination = checklist.Examination;
            ochecklist.Investigations = checklist.Investigations;
            ochecklist.Treatment = checklist.Treatment;
            ochecklist.Prescription = checklist.Prescription;
            ochecklist.InitialFinalDiagnosis = checklist.InitialFinalDiagnosis;
            ochecklist.Icd = checklist.Icd;
            ochecklist.Recommendation = checklist.Recommendation;
            ochecklist.DoctorId = checklist.DoctorId;
            ochecklist.DoctorName = checklist.DoctorName;
            ochecklist.DoctorDateTime = checklist.DoctorDateTime;
            
            ochecklist.ModifiedByName = checklist.ModifiedByName;
            ochecklist.ModifiedAt = checklist.ModifiedAt;
            ochecklist.ModifiedById = checklist.ModifiedById;
    
            dataManager.OTMedicalReport.Update(ochecklist);
            dataManager.OTMedicalReport.Commit();

            return true;
        }

        public bool DeleteOTMedicalReport(OTMedicalReport checklist)
        {
            var ochecklist = dataManager.OTMedicalReport.GetById(checklist.Id);

            ochecklist.ModifiedByName = checklist.ModifiedByName;
            ochecklist.ModifiedAt = checklist.ModifiedAt;
            ochecklist.ModifiedById = checklist.ModifiedById;
            ochecklist.Active = false;

            dataManager.OTMedicalReport.Update(ochecklist);
            dataManager.OTMedicalReport.Commit();

            return true;
        }

        public List<OTMedicalReport> GetPagedOTMedicalReport(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.OTMedicalReport.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.RegistrationNo.ToString().ToLower(), ".*" + searchBy.ToLower())
                                        || Regex.IsMatch(i.PatientName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                       // || Regex.IsMatch(i.ProcedureName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(OTMedicalReport).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(OTMedicalReport).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }
        #endregion

        #region [Presedation / Analgesia]

        public List<ConsciousSedationRecord> GetAllConsciousSedationRecord()
        {
            return dataManager.ConsciousSedationRecord.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public ConsciousSedationRecord GetConsciousSedationRecord(int id)
        {
            var data = dataManager.ConsciousSedationRecord.GetById(id);

               data.PreSedation.ProposedProcedure = data.PreSedation.ProposedProcedure.Where(i=>i.Active == true).ToList();
            
            return data;
        }

        public int AddConsciousSedationRecord(ConsciousSedationRecord record)
        {

            dataManager.ConsciousSedationRecord.Add(record);
            dataManager.ConsciousSedationRecord.Commit();
            return record.Id;
        }

        public bool UpdateConsciousSedationRecord(ConsciousSedationRecord record)
        {
            dataManager.ConsciousSedationRecord.Update(record);
            dataManager.ConsciousSedationRecord.Commit();

            return true;
        }

        public bool DeleteConsciousSedationRecord(ConsciousSedationRecord record)
        {
            record.Active = false;
            dataManager.ConsciousSedationRecord.Update(record);
            dataManager.ConsciousSedationRecord.Commit();

            return true;
        }

        public List<ConsciousSedationRecord> GetPagedConsciousSedationRecord(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.ConsciousSedationRecord.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.RegistrationNo.ToString().ToLower(), ".*" + searchBy.ToLower())
                                        || Regex.IsMatch(i.PatientName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                    // || Regex.IsMatch(i.ProcedureName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(ConsciousSedationRecord).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(ConsciousSedationRecord).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }
        #endregion

        #region TimeOutForm
        public List<TimeoutForm> GetAllTimeoutForm()
        {
            return dataManager.TimeoutForm.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public TimeoutForm GetTimeoutForm(int id)
        {
            return dataManager.TimeoutForm.GetById(id);
        }

        public int AddTimeoutForm(TimeoutForm checklist)
        {
             
            dataManager.TimeoutForm.Add(checklist);
            dataManager.TimeoutForm.Commit();
            return checklist.Id;
        }

        public bool UpdateTimeoutForm(TimeoutForm checklist)
        {


            var ochecklist = dataManager.TimeoutForm.GetById(checklist.Id);

            //updating properties
            ochecklist.IssueAuthorityCode = checklist.IssueAuthorityCode;
            ochecklist.RegistrationNo = checklist.RegistrationNo;
            ochecklist.PatientName = checklist.PatientName;

            ochecklist.Id = checklist.Id;
            ochecklist.MRN = checklist.MRN;
            ochecklist.CheckSignIn = checklist.CheckSignIn;
            ochecklist.CheckTimeOut = checklist.CheckTimeOut;
            ochecklist.CheckSignOut = checklist.CheckSignOut;

            ochecklist.PatientConfirmISIdentify = checklist.PatientConfirmISIdentify;
            ochecklist.PatientConfirmISSite = checklist.PatientConfirmISSite;
            ochecklist.PatientConfirmISProcedure = checklist.PatientConfirmISProcedure;
            ochecklist.PatientConfirmProcedureOther = checklist.PatientConfirmProcedureOther;
            ochecklist.PatientConfirmISSurgicalConsent = checklist.PatientConfirmISSurgicalConsent;
            ochecklist.PatientConfirmISAnesthesiaConsent = checklist.PatientConfirmISAnesthesiaConsent;
            ochecklist.PatientConfirmISLocationProcedure = checklist.PatientConfirmISLocationProcedure;
            ochecklist.PatientConfirmLocationProcedureOther = checklist.PatientConfirmLocationProcedureOther;
            ochecklist.SurgicalSiteISMark = checklist.SurgicalSiteISMark;
            ochecklist.SurgicalSiteISPatientRefuse = checklist.SurgicalSiteISPatientRefuse;
            ochecklist.SurgicalSiteOther = checklist.SurgicalSiteOther;
            ochecklist.isPulseOximeter = checklist.isPulseOximeter;
            ochecklist.isAnesthesiaMachine = checklist.isAnesthesiaMachine;
            ochecklist.isPatientAllergy = checklist.isPatientAllergy;
            ochecklist.isAirway = checklist.isAirway;
            ochecklist.RiskBloodLossIS = checklist.RiskBloodLossIS;
            ochecklist.RiskBloodLossCurrentHistory = checklist.RiskBloodLossCurrentHistory;
            ochecklist.RiskBloodLossAvailability = checklist.RiskBloodLossAvailability;
            ochecklist.SigninDateTime = checklist.SigninDateTime;
            ochecklist.Location = checklist.Location;
            ochecklist.isTeamIntroduce = checklist.isTeamIntroduce;
            ochecklist.SurgeonRegisterIS = checklist.SurgeonRegisterIS;
            ochecklist.SurgeonRegisterISProcedure = checklist.SurgeonRegisterISProcedure;
            ochecklist.SurgeonRegisterProcedureOther = checklist.SurgeonRegisterProcedureOther;
            ochecklist.AnticipatedSurgeonBloodlossIS = checklist.AnticipatedSurgeonBloodlossIS;
            ochecklist.AnticipatedSurgeonBloodlossOther = checklist.AnticipatedSurgeonBloodlossOther;
            ochecklist.AnticipatedSurgeonEquipIS = checklist.AnticipatedSurgeonEquipIS;
            ochecklist.AnticipatedSurgeonEquipOther = checklist.AnticipatedSurgeonEquipOther;
            ochecklist.AnticipatedSurgeonCriticalIS = checklist.AnticipatedSurgeonCriticalIS;
            ochecklist.AnticipatedSurgeonCriticalOther = checklist.AnticipatedSurgeonCriticalOther;
            ochecklist.AnesthetistConcernIS = checklist.AnesthetistConcernIS;
            ochecklist.AnesthetistConcernOther = checklist.AnesthetistConcernOther;
            ochecklist.NurseOdpSterileIS = checklist.NurseOdpSterileIS;
            ochecklist.NurseOdpSterileISEquipment = checklist.NurseOdpSterileISEquipment;
            ochecklist.NurseOdpSterileEquipmentOther = checklist.NurseOdpSterileEquipmentOther;
            ochecklist.isProphylactic = checklist.isProphylactic;
            ochecklist.isProphylacticGiven60mins = checklist.isProphylacticGiven60mins;
            ochecklist.ProphylacticGiven60minsDateTime = checklist.ProphylacticGiven60minsDateTime;
            ochecklist.isImagingDisplay = checklist.isImagingDisplay;
            ochecklist.TimeoutDateTime = checklist.TimeoutDateTime;
            ochecklist.TeamPresent = checklist.TeamPresent;
            ochecklist.SurgeonId = checklist.SurgeonId;
            ochecklist.SurgeonName = checklist.SurgeonName;
            ochecklist.AnesthesiologistId = checklist.AnesthesiologistId;
            ochecklist.AnesthesiologistName = checklist.AnesthesiologistName;
            ochecklist.TechnicianId = checklist.TechnicianId;
            ochecklist.TechnicianName = checklist.TechnicianName;
            ochecklist.NurseTimeOutId = checklist.NurseTimeOutId;
            ochecklist.NurseTimeOutName = checklist.NurseTimeOutName;
            ochecklist.ScrubTimeOutId = checklist.ScrubTimeOutId;
            ochecklist.ScrubTimeOutName = checklist.ScrubTimeOutName;
            ochecklist.OthersTimeOut = checklist.OthersTimeOut;
            ochecklist.NurseIntroduceProcedure = checklist.NurseIntroduceProcedure;
            ochecklist.NurseIntroduceInstrument = checklist.NurseIntroduceInstrument;
            ochecklist.NurseIntroduceSpecimen = checklist.NurseIntroduceSpecimen;
            ochecklist.NurseIntroduceEquipProblems = checklist.NurseIntroduceEquipProblems;
            ochecklist.SurgeonNurseRegisterdSignOutIS = checklist.SurgeonNurseRegisterdSignOutIS;
            ochecklist.SurgeonNurseRegisterdSignOutOther = checklist.SurgeonNurseRegisterdSignOutOther;
            ochecklist.SignoutDateTime = checklist.SignoutDateTime;
            ochecklist.NurseSignoutId = checklist.NurseSignoutId;
            ochecklist.NurseSignoutName = checklist.NurseSignoutName;


 
            ochecklist.ModifiedByName = checklist.ModifiedByName;
            ochecklist.ModifiedAt = checklist.ModifiedAt;
            ochecklist.ModifiedById = checklist.ModifiedById;

            dataManager.TimeoutForm.Update(ochecklist);
            dataManager.TimeoutForm.Commit();

            return true;
        }

        public bool DeleteTimeoutForm(TimeoutForm checklist)
        {
            var ochecklist = dataManager.TimeoutForm.GetById(checklist.Id);

            ochecklist.ModifiedByName = checklist.ModifiedByName;
            ochecklist.ModifiedAt = checklist.ModifiedAt;
            ochecklist.ModifiedById = checklist.ModifiedById;
            ochecklist.Active = false;

            dataManager.TimeoutForm.Update(ochecklist);
            dataManager.TimeoutForm.Commit();

            return true;
        }

        public List<TimeoutForm> GetPagedTimeoutForm(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.TimeoutForm.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.RegistrationNo.ToString().ToLower(), ".*" + searchBy.ToLower())
                                        || Regex.IsMatch(i.PatientName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                    // || Regex.IsMatch(i.ProcedureName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(TimeoutForm).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(TimeoutForm).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }
        #endregion 

        #region IntegratedCarePlan
        public List<IntegratedCarePlan> GetAllIntegratedCarePlan()
        {
            return dataManager.IntegratedCarePlan.GetAllByCriteria(i => i.Active == true).ToList();
        }

        public IntegratedCarePlan GetIntegratedCarePlan(int id)
        {
            return dataManager.IntegratedCarePlan.GetById(id);
        }

        public int AddIntegratedCarePlan(IntegratedCarePlan checklist)
        {

            dataManager.IntegratedCarePlan.Add(checklist);
            dataManager.IntegratedCarePlan.Commit();
            return checklist.Id;
        }

        public bool UpdateIntegratedCarePlan(IntegratedCarePlan checklist)
        {


            var ochecklist = dataManager.IntegratedCarePlan.GetById(checklist.Id);

            //updating properties
            ochecklist.IssueAuthorityCode = checklist.IssueAuthorityCode;
            ochecklist.RegistrationNo = checklist.RegistrationNo;
            ochecklist.PatientName = checklist.PatientName;

            ochecklist.Id = checklist.Id;
           



            ochecklist.ModifiedByName = checklist.ModifiedByName;
            ochecklist.ModifiedAt = checklist.ModifiedAt;
            ochecklist.ModifiedById = checklist.ModifiedById;

            dataManager.IntegratedCarePlan.Update(ochecklist);
            dataManager.IntegratedCarePlan.Commit();

            return true;
        }

        public bool DeleteIntegratedCarePlan(IntegratedCarePlan checklist)
        {
            var ochecklist = dataManager.IntegratedCarePlan.GetById(checklist.Id);

            ochecklist.ModifiedByName = checklist.ModifiedByName;
            ochecklist.ModifiedAt = checklist.ModifiedAt;
            ochecklist.ModifiedById = checklist.ModifiedById;
            ochecklist.Active = false;

            dataManager.IntegratedCarePlan.Update(ochecklist);
            dataManager.IntegratedCarePlan.Commit();

            return true;
        }

        public List<IntegratedCarePlan> GetPagedIntegratedCarePlan(string searchBy, int take, int skip, string sortBy, bool sortDir, out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;

            var query = dataManager.IntegratedCarePlan.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.RegistrationNo.ToString().ToLower(), ".*" + searchBy.ToLower())
                                        || Regex.IsMatch(i.PatientName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                    // || Regex.IsMatch(i.ProcedureName.ToLower(), ".*" + searchBy.ToLower() + ".*")
                                     );
                filteredResultsCount = query.Count();
            }

            if (!sortDir)
                return query.OrderByDescending(i => typeof(IntegratedCarePlan).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
                return query.OrderBy(i => typeof(IntegratedCarePlan).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
        }
       
        #endregion 
    }
}
