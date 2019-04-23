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

namespace DataLayer
{
    public class DBHelper1
    {
        string connString = "";
        string connStringLMW = "";

        public SqlParameter[] param = null;

        public Boolean Successful { get; private set; }
        public string ErrorMessage { get; private set; }
        public string ErrorStackTrace { get; private set; }

        public string SqlConnectionString { get; private set; }
        string _ModuleName;

        public DBHelper1(string ModuleName = "SGH")
        {
            EncryptDecrypt enc = new EncryptDecrypt();
            connString = ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ConnectionString + ";Application Name=WebUtilities";            
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
    }
}
