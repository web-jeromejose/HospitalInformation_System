using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer.ITAdmin.Model
{
    public class MachineSetupDAL
    {
        DBHelper DB = new DBHelper("ITADMIN");
        public string ID { get; set; }
        public List<MachineSetupModel> GetMachineListDAL()
        {
            try
            {
                return DB.ExecuteSPAndReturnDataTable("ITADMIN.MachineList").DataTableToList<MachineSetupModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public Response GetMachineSaveDAL(MachineSetupModel s)
        {
            try
            {
                DataTable dtRet = new DataTable();
                dtRet.Columns.AddRange(new[] {
                    new DataColumn("ModalityID", typeof(int))
                });

                DataTable dtMachineDoctors = new DataTable();
                dtMachineDoctors.Columns.AddRange(new[] {
                    new DataColumn("EmployeeId", typeof(int))
                });

                string[] doctorIds = s.DoctorId != null ? s.DoctorId.Split(',') : new string[0];
                string[] modals = s.ModalityID != null ? s.ModalityID.Split(',') : new string[0];

                foreach (string ss in modals)
                {
                    DataRow newRow = dtRet.NewRow();
                    newRow["ModalityID"] = ss;
                    dtRet.Rows.Add(newRow);
                }

                foreach (string id in doctorIds)
                {
                    DataRow newRow = dtMachineDoctors.NewRow();
                    newRow["EmployeeId"] = id;
                    dtMachineDoctors.Rows.Add(newRow);
                }


                System.IO.StringWriter sw = new System.IO.StringWriter();
                dtRet.TableName = "Data";
                dtRet.WriteXml(sw);

                System.IO.StringWriter doctors = new System.IO.StringWriter();
                dtMachineDoctors.TableName = "Data";
                dtMachineDoctors.WriteXml(doctors);

                DB.param = new SqlParameter[]{
                     new SqlParameter("ID", s.ID),
                     new SqlParameter("Code", s.Code ?? ""),
                     new SqlParameter("Name", s.Name ?? ""),
                     new SqlParameter("Description", s.Description ?? ""),
                     new SqlParameter("DepartmentID", s.DepartmentID ?? "0"),
                     new SqlParameter("LocationID", s.LocationID ?? "0"),
                     new SqlParameter("Room", s.Room ??""),
                     new SqlParameter("AcquisitionDate", s.AcquisitionDate),
                     new SqlParameter("CommisionDate", s.CommisionDate),
                     new SqlParameter("XML", sw.ToString()),
                      new SqlParameter("XMLDoctors", doctors.ToString()),
                     new SqlParameter("ReturnMessage", SqlDbType.VarChar, 100),
                     new SqlParameter("ReturnFlag", SqlDbType.Int, 100),
                };
                DB.param[11].Direction = ParameterDirection.Output;
                DB.param[12].Direction = ParameterDirection.Output;
                Response res = new Response();
                DB.ExecuteSP("ITADMIN.MachineListSave");
                res.Message = DB.param[11].Value.ToString();
                res.Flag = DB.param[12].Value.ToString();
                return res;

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetDeptDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select id,name as text, deptcode as name from department where deleted =0 ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetLocationDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select id,name as text, name as name from location where deleted =0 ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetModalitiesDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select id,code as text,name from itadmin.ModalitySetup ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetAssetItemsDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select  code as id, code + ' - ' + name as text,ControlNo as name from AssetItems where deleted = 0 union select  code as id, code + ' - ' + name as text,ControlNo as name from HIS_LAB.MachineAssetItems where deleted = 0 ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetProcModalDAL()
        {
            try
            {
                return DB.ExecuteSPAndReturnDataTable("ITADMIN.MachineProcedureModalityList").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetDoctors()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select id,name as text, name from doctor where deleted =0 ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetMachineDoctors(int machineId)
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select DoctorID id,DepartmentID as text, MachineID name from ITADMIN.MachineDoctorSetup where deleted = 0 and MachineID =" + machineId.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
    }
}
