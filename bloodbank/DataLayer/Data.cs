using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

using System.Configuration;
namespace DataLayer
{
    public class DataCon
    {
        string connString = "";
        string connStringLMW = "";
        string connStringMRD = "";
        string connectionString = "";
        string connStringLog = "";
        public SqlParameter[] param = null;

        public Boolean Successful { get; private set; }
        public string ErrorMessage { get; private set; }
        public string ErrorStackTrace { get; private set; }
        EncryptDecrypt enc = new EncryptDecrypt();

        public DataCon()
        {
            //connString = enc.Decrypt(ConfigurationManager.ConnectionStrings["DBConnection"].ConnectionString, true) + ";Application Name=WebUtilities";
            //connStringLMW = enc.Decrypt("zJTu7cr3T3abXGdNAC/yHeoz6MZVY9GTWw2sSkZ/FjF8MzsPXZPQjfZ/3hVCAKBu2dMtiYUQci/aktJ0fLL/DX/5KduxhFiuzPffQRC1PnjfS/KtzMYY2yj38azObd6Autn1/8fZT3vW7o/0n+mRmvQ4gXPRVb1mM5xXdUyZoyr0UBuiKOcp9GucGDdUSTzSZdBx6bv/cVRlbhwPhLpDRrTiKuJ7sArE7sIYQR602r0=",true);
            //connStringLMW = "User Id=hospital;Password=jedhospital;Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=130.1.2.222)(PORT=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SID=SGH11D)));";
            //connString = "Data Source=130.1.2.223;Initial Catalog=MRD;Persist Security Info=True;User ID=sghit;Password=SGHIT";
            connStringMRD = "Data Source=130.1.2.90;Initial Catalog=HIS;Persist Security Info=True;User ID=WHCIT;Password=WHCIT";
            //connStringMRD = "Data Source=130.3.2.5;Initial Catalog=HIS;Persist Security Info=True;User ID=WHCIT;Password=WHCIT";

            connStringMRD = ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ConnectionString + ";Application Name=WebUtilities";  

            connectionString = "lK22IbA38JapPL4It9ASC1CbBSBm+ZpBcqRh4+Ostnv0XAeV6sgxDomKBsz9Q/UKZjhZhj/8nOEUGGSxACc2WcJtvB22LBXC4Q7AzUD3jQ4=";
            connStringLog = enc.Decrypt(connectionString, true) + ";Application Name=CMO_Report";

        }

        public DataSet ExecuteSQLDS(string sql, SqlParameter[] sql_param)
        {
            DataSet ds = new DataSet();
            using (SqlConnection CN = new SqlConnection(connStringMRD))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (sql_param != null)
                        {
                            foreach (SqlParameter p in sql_param)
                            {
                                if (p != null)
                                {
                                    // Check for derived output value with no value assigned
                                    if ((p.Direction == ParameterDirection.InputOutput ||
                                        p.Direction == ParameterDirection.Input) &&
                                        (p.Value == null))
                                    {
                                        p.Value = DBNull.Value;
                                    }
                                    cmd.Parameters.Add(p);
                                }
                            }
                        }


                        //cmd.Parameters.Add(sql_param );

                        this.Successful = true;
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(ds);
                        da.Dispose();
                    }
                    return ds;
                }
                catch (Exception ex)
                {
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + sql + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);

                }
            }
        }
        public DataSet ExecuteSQL_String(string sql)
        {
            DataSet ds = new DataSet();
            using (SqlConnection CN = new SqlConnection(connStringMRD))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandTimeout = 300;
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(ds);
                        da.Dispose();
                    }
                    return ds;
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("<b>From:</b> " + sql + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);

                }
            }
        }
    }
}
