
using OTEf.Core.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Models
{
    public class Select2Repository
    {
  

        public static object Patient(string searchTerm)
        {
            PatientModel patientModel = new PatientModel();
            var patients = patientModel.SearchPatient(searchTerm);

            var sel2data = patients.AsEnumerable().Select(m => new 
            {
                id = m.RegistrationNo,
                text = m.PIN,
                age = m.Age,
                agetype = m.AgeType,
                sex = m.Sex,
                patientname = m.PatientName,
                issueathoritycode = m.IssueAuthorityCode
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object MedicalEmployee(string searchTerm)
        {

            EmployeeModel employee = new EmployeeModel();
            var list = employee.SearchMedicalEmployee(searchTerm);

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.EmployeeId + " - " +m.Name,
                employeeid = m.EmployeeId,
                empcode = m.EmpCode,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object MedicalSurgeon(string searchTerm)
        {

            EmployeeModel employee = new EmployeeModel();
            var list = employee.SearchMedicalSurgeon(searchTerm);

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.EmpCode + " - " + m.Name,
                employeeid = m.EmployeeId,
                empcode = m.EmpCode,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object TestProcedure(string searchTerm)
        {

            ProcedureModel procedure = new ProcedureModel();
            var list = procedure.SearchTestProcedure(searchTerm);

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Code + " - " + m.Name,
                code = m.Code,
                costprice = m.CostPrice,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object CirculatoryNurse(string searchTerm)
        {

            EmployeeModel employee = new EmployeeModel();
            var list = employee.SearchCirculatingNurse(searchTerm);

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.EmployeeId + " - " + m.Name,
                employeeid = m.EmployeeId,
                empcode = m.EmpCode,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object ScrubNurse(string searchTerm)
        {

            EmployeeModel employee = new EmployeeModel();
            var list = employee.SearchScrubNurse(searchTerm);

            var sel2data = list.AsEnumerable().Select(m => new
            {
               id = m.Id,
               text = m.EmployeeId + " - " + m.Name,
                employeeid = m.EmployeeId,
                empcode = m.EmpCode,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }


        public static object Doctor(string searchTerm)
        {

            EmployeeModel employee = new EmployeeModel();
            var list = employee.SearchDoctor(searchTerm);

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.EmployeeId + " - " + m.Name,
                employeeid = m.EmployeeId,
                empcode = m.EmpCode,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }
       
        public static object AllLocation()
        {

            LocationModel loc = new LocationModel();
            var list = loc.GetAllLocation();

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text =  m.Name,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object AllSex()
        {

            SexModel sex = new SexModel();
            var list = sex.GetAllSex();

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object AllAgeType()
        {

            AgeTypeModel type = new AgeTypeModel();
            var list = type.GetAllAgeType();

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
                name = m.Name
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object AllStation()
        {

            StationModel station = new StationModel();
            var list = station.GetAllStation();

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
                name = m.Name,
                code = m.Code
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }

        public static object StationByType(int typeid)
        {

            StationModel station = new StationModel();
            var list = station.GetStationByType(typeid);

            var sel2data = list.AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
                name = m.Name,
                code = m.Code
            }).ToList();

            return new { Total = sel2data.Count(), Results = sel2data };
        }
       
    }

    public class Select2Helper
    {

        public static object GetListData(object obj)
        {
            return obj.GetType().GetProperty("Results").GetValue(obj, null);
        }
    }
    
}