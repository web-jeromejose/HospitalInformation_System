using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using System.Web;
using System.Configuration;
using System.Diagnostics;
 //using Oracle.DataAccess.Client;
using DataLayer.Common;

namespace DataLayer
{
    public class backupcopytestDBHelperTest
    {
        ExceptionLogging eLOG = new ExceptionLogging();
        string connString = "";
        string connStringLive = "";
        string connStringCairo = "";
        string connStringTest = "";
        //string connStringsgh2 = "";
        string connStringORA = "";
        string connStringBI = "";
       // string connStringsgh2_userBI = "";
        public SqlParameter[] param = null;

        public Boolean Successful { get; private set; }
        public string ErrorMessage { get; private set; }
        public string ErrorStackTrace { get; private set; }

        public string SqlConnectionString { get; private set; }
        string _ModuleName;

        public backupcopytestDBHelperTest(string ModuleName = "SGH_HIS")
        {
            EncryptDecrypt enc = new EncryptDecrypt();
           // connString = enc.Decrypt(ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ConnectionString, true);
            connString = ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ConnectionString + ";Application Name=SGHHIS";
        connStringLive = ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ConnectionString + ";Application Name=SGHHIS";
            //connStringLive = "Data Source=130.1.2.24;Initial Catalog=HIS;Persist Security Info=True;User ID=WHCIT;Password=WHCIT";
            //connStringLive = "Data Source=130.7.1.16;Initial Catalog=HIS;Persist Security Info=True;User ID=WHCIT;Password=WHCIT";
            connStringCairo = "Data Source=130.7.1.16;Initial Catalog=HIS;Persist Security Info=True;User ID=WHCIT;Password=WHCIT";
            connStringTest = "Data Source=130.1.2.90;Initial Catalog=HIS;Persist Security Info=True;User ID=WHCIT;Password=WHCIT";
          //  connStringsgh2 = "Data Source=sgh2;Initial Catalog=HIS;Persist Security Info=True;User ID=user_outp;Password=petrebryan";
            //connStringsgh2 = "User Id=user_outp;Password=petrebryan;Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=130.1.2.222)(PORT=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SID=SGH11D)))";
            //connStringsgh2_userBI = "User Id=user_bi;Password=user_bi;Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=130.1.2.222)(PORT=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SID=SGH11D)))";
   

           //  connStringORA = ConfigurationManager.ConnectionStrings["ORAConnection"].ConnectionString ;
          // connStringBI =  ConfigurationManager.ConnectionStrings["BIConnection"].ConnectionString ;


            SqlConnectionString = connString;
            _ModuleName = ModuleName;
        }

        public string ExecuteSQLScalar(string sql = "")
        {
            using (SqlConnection CN = new SqlConnection(connString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    this.Successful = true;
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;
                        return cmd.ExecuteScalar().ToString();
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(sql);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }

        public Boolean ExecuteSQL(string sql = "")
        {
            using (SqlConnection CN = new SqlConnection(connString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        this.Successful = true;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(sql);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }

        public Boolean ExecuteSP(string spName = "")
        {
            using (SqlConnection CN = new SqlConnection(connString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(spName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(spName);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + spName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + spName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }
        public Boolean ExecuteSQLLive(string sql = "")
        {
            using (SqlConnection CN = new SqlConnection(connStringLive))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        this.Successful = true;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(sql);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }
        public DataTable ExecuteSPAndReturnDataTableLive(string SPName = "")
        {
            using (SqlConnection CN = new SqlConnection(connStringLive))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(SPName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        SqlDataReader rs = cmd.ExecuteReader();
                        dt.Load(rs);
                        rs.Close();
                        rs.Dispose();
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(SPName);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + SPName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + SPName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                }
            }
        }
        public DataTable ExecuteSQLAndReturnDataTableLive(string sql)
        {
            using (SqlConnection CN = new SqlConnection(connStringLive))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;

                        this.Successful = true;
                        SqlDataReader rs = cmd.ExecuteReader();
                        dt.Load(rs);
                        rs.Close();
                        rs.Dispose();
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(sql);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + sql + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + sql + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return null;
                }
            }
        }

        public DataTable ExecuteSPAndReturnDataTable(string SPName = "")
        {
            using (SqlConnection CN = new SqlConnection(connString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(SPName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        SqlDataReader rs = cmd.ExecuteReader();
                        dt.Load(rs);
                        rs.Close();
                        rs.Dispose();
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(SPName);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + SPName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + SPName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                }
            }
        }

        public DataTable ExecuteSQLAndReturnDataTable(string sql)
        {
            using (SqlConnection CN = new SqlConnection(connString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;

                        this.Successful = true;
                        SqlDataReader rs = cmd.ExecuteReader();
                        dt.Load(rs);
                        rs.Close();
                        rs.Dispose();
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(sql);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + sql + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + sql + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return null;
                }
            }
        }

        public DataSet ExecuteSPAndReturnDataSet(string SPName = "")
        {
            using (SqlConnection CN = new SqlConnection(connString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(SPName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 3000;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogDetail(SPName);
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + SPName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + SPName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                }
            }
        }

        public Boolean ExecuteSQLCairo(string sql = "")
        {
            using (SqlConnection CN = new SqlConnection(connStringCairo))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        this.Successful = true;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);                    
                }
            }
        }

        public Boolean ExecuteSPCairo(string spName = "")
        {
            using (SqlConnection CN = new SqlConnection(connStringCairo))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(spName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + spName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + spName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }

        public Boolean ExecuteSQLTest(string sql = "")
        {
            using (SqlConnection CN = new SqlConnection(connStringTest))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        this.Successful = true;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                }
            }
        }
        public Boolean ExecuteSPTest(string spName = "")
        {
            using (SqlConnection CN = new SqlConnection(connStringTest))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(spName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    eLOG.LogError(ex);
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + spName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + spName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }












        /* Oracle ORA */
      //  public DataTable ExecuteQueryInORA(string sql)
      //  {
      //      using (OracleConnection oraCN = new OracleConnection(connStringsgh2_userBI))
      //      {
      //          try
      //          {
      //              oraCN.Open();
      //              using (OracleCommand oraCMD = new OracleCommand(sql, oraCN))
      //              {
      //                  this.Successful = true;
      //                  OracleDataReader oraRS = oraCMD.ExecuteReader();
      //                  oraCMD.CommandType = CommandType.Text;
      //                  DataTable dt = new DataTable();
      //                  dt.Load(oraRS);
      //                  oraRS.Close();
      //                  oraRS.Dispose();
      //                  return dt;
      //              }
      //          }
      //          catch (Exception ex)
      //          {
      //              EventLog log = new EventLog();
      //              if (!EventLog.SourceExists("SGH MCRS"))
      //                  EventLog.CreateEventSource("SGH MCRS", "Application");

      //              log.Source = "SGH MCRS";
      //              log.WriteEntry("<b>From:</b> " + sql + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
      //              this.Successful = false;
      //              this.ErrorMessage = ex.Message;
      //              this.ErrorStackTrace = ex.StackTrace;
      //              throw new ApplicationException("<b>From:</b> " + sql + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
      //          }
      //      }
      //  }

      //  /* BI */
      //public DataTable ExecuteSQLAndReturnDataTableBI(string sql)
      //  {
      //      using (SqlConnection CN = new SqlConnection(connStringBI))
      //      {
      //          try
      //          {
      //              CN.Open();

      //              DataTable dt = new DataTable();
      //              using (SqlCommand cmd = new SqlCommand(sql, CN))
      //              {
      //                  cmd.CommandType = CommandType.Text;
      //                  cmd.CommandTimeout = 300;

      //                  this.Successful = true;
      //                  SqlDataReader rs = cmd.ExecuteReader();
      //                  dt.Load(rs);
      //                  rs.Close();
      //                  rs.Dispose();
      //                  return dt;
      //              }
      //          }
      //          catch (Exception ex)
      //          {
      //              EventLog log = new EventLog();
      //              log.Source = _ModuleName;
      //              log.WriteEntry("<b>From:</b> " + sql + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
      //              this.Successful = false;
      //              this.ErrorMessage = ex.Message;
      //              this.ErrorStackTrace = ex.StackTrace;
      //              throw new ApplicationException("<b>From:</b> " + sql + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
      //              //return null;
      //          }
      //      }
      //  }








    }
}
