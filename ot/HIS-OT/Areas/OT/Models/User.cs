using DataLayer;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OT.Models
{
    public class User
    {
        public string Employee { get; set; }
        public string EmployeeID { get; set; }
        public string DivisionID { get; set; }
        public string DepartmentID { get; set; }

        DBHelper DB = new DBHelper("OT");

        public Boolean IsUserValid(string userId, string password)
        {
            try
            {
                string sql = "SELECT a.id, RTRIM(FirstName) + ' ' + RTRIM(Lastname) AS Name, Password, DepartmentID, b.divisionid " +
                             "FROM HIS..Employee a " +
                             "LEFT JOIN Department b on a.departmentid = b.id " +
                             "WHERE a.employeeid = '" + userId + "'";

                var result = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToModel<UserDetails>();

                if (result != null && result.Id > 0)
                {
                    if (string.Compare(password ?? "", DecryptPassword(result.Password), false) == 0)
                    {
                        this.EmployeeID = result.Id.ToString();
                        this.Employee = result.Name;
                        this.DivisionID = result.Divisionid;
                        this.DepartmentID = result.DepartmentID;
                        return true;
                    }
                    else
                    {
                        this.Employee = "";
                        return false;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public List<ItemList> GetUsers(string id)
        {
            try
            {
                //SqlParameter[] sqlParam = new SqlParameter[1];
                //sqlParam[0] = new SqlParameter("@code", id);

                //DataSet ds = dl.ExecuteSQLDS("WARDS.LIST_EMPLOYEE", sqlParam);
                //DataTable dt = ds.Tables[0];
                //int i = 1;
                //List<ItemList> li = (
                //    from DataRow s in dt.Rows
                //    orderby s["Name"].ToString() ascending
                //    select new ItemList
                //    {
                //        ID = s["EmployeeID"].ToString(),
                //        Name = s["Name"].ToString()
                //    }).ToList();
                //return li;

                string sql = string.Empty;
                int employeeId = 0;
                if (!int.TryParse(id, out employeeId))
                {
                    sql = "SELECT EmployeeID as Id, RTRIM(FirstName) + ' ' + RTRIM(Lastname) AS Name " +
                            "FROM HIS..Employee " +
                            "WHERE RTRIM(FirstName) + ' ' + RTRIM(Lastname) LIKE '" + id + "%'";
                }
                else
                {
                    sql = "SELECT EmployeeID as Id, RTRIM(FirstName) + ' ' + RTRIM(Lastname) AS Name " +
                            "FROM HIS..Employee " +
                            "WHERE EmployeeID LIKE '" + id + "%'";
                }
                var result = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<ItemList>();
                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public string DecryptPassword(string StringToDecrypt)
        {
            double dblCountLength;
            int intLengthChar;
            string strCurrentChar;
            double dblCurrentChar;
            int intCountChar;
            int intRandomSeed;
            int intBeforeMulti;
            int intAfterMulti;
            int intSubNinetyNine;
            int intInverseAsc;
            string decrypt = "";

            for (dblCountLength = 0; dblCountLength < @StringToDecrypt.Length; dblCountLength++)
            {
                intLengthChar = int.Parse(@StringToDecrypt.Substring((int)dblCountLength, 1));
                strCurrentChar = @StringToDecrypt.Substring((int)(dblCountLength + 1), intLengthChar);
                dblCurrentChar = 0;
                for (intCountChar = 0; intCountChar < strCurrentChar.Length; intCountChar++)
                {
                    dblCurrentChar = dblCurrentChar + (Convert.ToInt32(char.Parse(strCurrentChar.Substring(intCountChar, 1))) - 33) * (Math.Pow(93, (strCurrentChar.Length - (intCountChar + 1))));
                }

                intRandomSeed = int.Parse(dblCurrentChar.ToString().Substring(2, 2));
                intBeforeMulti = int.Parse(dblCurrentChar.ToString().Substring(0, 2) + dblCurrentChar.ToString().Substring(4, 2));
                intAfterMulti = intBeforeMulti / intRandomSeed;
                intSubNinetyNine = intAfterMulti - 99;
                intInverseAsc = 256 - intSubNinetyNine;
                decrypt += Convert.ToChar(intInverseAsc);
                dblCountLength = dblCountLength + intLengthChar;
            }
            return decrypt;
        }
    }

    public class UserDetails
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string DepartmentID { get; set; }
        public string Divisionid { get; set; }
    }

    public class ItemList
    {
        public string ID { get; set; }
        public string Name { get; set; }
        //public string Type { get; set; }
    }
}