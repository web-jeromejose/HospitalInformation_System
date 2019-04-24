using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;


namespace DataLayer.ITAdmin.Model
{
    public class SharjahModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();


        public List<ListModel> AllActiveDoctors()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select  emp.ID as id  ,a.EmpCode+'-'+a.FirstName + ' '+ a.MiddleName + ' '+a.LastName as text,a.EmpCode  as name  from dbo.doctor a  left join dbo.Employee emp on a.EmployeeID = emp.EmployeeID where a.deleted = 0 and a.ID not  in (1)  ").DataTableToList<ListModel>();
        }
        public List<getdetailsfromDocProfVM> getdetailsfromDocProf(int id)
        { 
            string sql = " ";
            sql = @" select Id,DoctorCode as doctorcode,SpecializedIn as specialization,Details as details,Picture as [image],Video as video ,NAME_AR,Position_AR,Department_AR,SpecializedIn_AR,Details_AR from vids.VIDS_Doctors where deleted= 0 and HIS_Id = " + id;


            return db.ExecuteSQLAndReturnDataTableLive(sql).DataTableToList<getdetailsfromDocProfVM>();
        }


        

        public bool DoctorProfileEntrySave(DoctorProfileEntrySaveDal entry)
        {
            string sql = " ";
            sql = @"

             update Vids.VIDS_Doctors set Deleted = 1 where HIS_Id = "+entry.Id+ @" 

             insert into  Vids.VIDS_Doctors (DoctorCode,HIS_Id,SpecializedIn,Details,Picture,Video,Deleted,Add_By,Add_DateTime,NAME_AR,Position_AR,Department_AR,SpecializedIn_AR,Details_AR)
            values ('" + entry.doctorcode + @"'," + entry.Id + @",'" + entry.specialization + @"','" + entry.details + @"','" + entry.image + @"','" + entry.video + @"',0,'" + entry.operatorid + @"',GETDATE(),'" + entry.NAME_AR + @"','" + entry.Position_AR + @"','" + entry.Department_AR + @"','" + entry.SpecializedIn_AR + @"','" + entry.Details_AR + @"')
            ";
            db.ExecuteSQL(sql);
            this.ErrorMessage = "Doctor has been added in the entry..";
            return true;
        }

        public List<DoctorProfileEntryDashboardDal> DoctorProfileEntryDashboard()
        {


            string sql1 = "";
            sql1 = @"   select a.Id,a.DoctorCode,a.HIS_Id,a.SpecializedIn,a.Details,a.Picture,a.Video,a.Deleted 
,b.Name,b.EmployeeID,c.Name as DeptName
from Vids.VIDS_Doctors A
left join dbo.employee b on b.id = a.HIS_Id
left join dbo.Department c on b.DepartmentID = c.ID
where
a.Deleted = 0    
";



            sql1 = Regex.Replace(sql1, @"\t|\n|\r", " ");

            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql1);
            List<DoctorProfileEntryDashboardDal> list = new List<DoctorProfileEntryDashboardDal>();
            if (dt.Rows.Count > 0) list = dt.ToList<DoctorProfileEntryDashboardDal>();
            return list;
        }




    }

    public class DoctorProfileEntrySaveDal
    {
        public string Id { get; set; }
        public string details { get; set; }
        public string image { get; set; }
        public string specialization { get; set; }
        public string video { get; set; }
        public string doctorcode { get; set; }
        public int operatorid { get; set; }

          public string NAME_AR { get; set; }
          public string Position_AR { get; set; }
          public string Department_AR { get; set; }
          public string SpecializedIn_AR { get; set; }
          public string Details_AR { get; set; }
           

    
    }

    public class getdetailsfromDocProfVM
    {
        public int Id { get; set; }
        public string details { get; set; }
        public string image { get; set; }
        public string specialization { get; set; }
        public string video { get; set; }
        public string doctorcode { get; set; }
      
          public string NAME_AR { get; set; }
          public string Position_AR { get; set; }
          public string Department_AR { get; set; }
          public string SpecializedIn_AR { get; set; }
          public string Details_AR { get; set; }
           

    
    }
    

public class DoctorProfileEntryDashboardDal
    {
    public int Id { get; set; }
    public string DoctorCode {get;set;}
    public string HIS_Id {get;set;}
    public string SpecializedIn {get;set;}
    public string Details {get;set;}
    public string Picture {get;set;}
    public string Video {get;set;}
    public string Deleted {get;set;}
    public string Name {get;set;}
    public string EmployeeID {get;set;}
    public string DeptName {get;set;}

 }

}
