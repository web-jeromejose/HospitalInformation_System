using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
 
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using HIS_OT.Models;
using HIS_OT.Controllers;
using context = System.Web.HttpContext;
using SystemIO =   System.IO;

namespace HIS_OT.Areas.OT.Models
{
    public class MasterLogs
    {

       
            public string ErrorMessage { get; set; }
            DBHelper db = new DBHelper();
            ExceptionLogging elog = new ExceptionLogging();

            #region Loginsert
            public bool loginsert(string tablename, string name, string costprice, string code, int operatorid, string comment)
            {
                //String strPathAndQuery = HttpContext.Current.Request.RawUrl;// HttpContext.Current.Request.Url.PathAndQuery;
                // String url = HttpContext.Current.Request.RawUrl;// HttpContext.Current.Request.Url.PathAndQuery;
                string strPathAndQuery = HttpContext.Current.Request.Url.AbsolutePath;
                String url = HttpContext.Current.Request.Url.AbsoluteUri.Replace(strPathAndQuery, "/");

                string sql = @" 


 if not exists(select * from sys.tables where name = 'OT_Logs_Web_Module') 
 BEGIN 
  
 	CREATE TABLE [OT].[OT_Logs_Web_Module] 
 	( 
 		[ID] [int] IDENTITY(1,1) NOT NULL, 
 		[TableName] [varchar](100) NULL, 
 		[Name] [varchar](100) NULL, 
 		[CostPrice] [varchar](50) NULL, 
 		[Code] [varchar](50) NULL, 
 		[OperatorID] [varchar](100) NULL, 
 		[Comment] [text] NULL, 
 		[DateUpdated] [datetime] default CURRENT_TIMESTAMP 
 	) ON [MasterFile] 
 END 
  
insert into [OT].[OT_Logs_Web_Module] 
(TableName,Name,CostPrice,Code,OperatorID,Comment)
values 
('" + tablename + @"','" + name + @"','" + costprice + @"','" + code + @"','" + operatorid + @"','" + url + @">>Details-" +  comment + @"    ') ";


                string sql1 = Regex.Replace(sql, @"\t|\n|\r|%|&|http|https", "");

                db.ExecuteSQL(sql1);
                return true;
            }
 

        private class ExceptionLogging
        {

            private static String ErrorlineNo, Errormsg, extype, exurl, ErrorLocation;
            /*
             ** HOW TO USE JFJ Aug2017
             *
             * using DataLayer.Common;
             * ExceptionLogging eLOG = new ExceptionLogging();
               try
                {
                }
                catch (Exception ex)
                {
                    eLOG.LogError(ex);
                 }

             */
            public void LogError(Exception ex)
            {

                string opeid = context.Current.Request.Cookies["ELOG_PAR1"].Value;
                string ipaddr = context.Current.Request.Cookies["ELOG_PAR2"].Value;
                string station = context.Current.Request.Cookies["ELOG_PAR3"].Value;

                string oldtextfile = "";
                string newtextfile = "";

                var line = Environment.NewLine + Environment.NewLine;

                ErrorlineNo = ex.StackTrace.Substring(ex.StackTrace.Length - 7, 7);
                Errormsg = ex.GetType().Name.ToString();
                extype = ex.GetType().ToString();
                exurl = context.Current.Request.Url.ToString();
                ErrorLocation = ex.Message.ToString();

                try
                {
                    string filepath = context.Current.Server.MapPath("~/Logs/");  //html File Path
                    if (!SystemIO.Directory.Exists(filepath))
                    {
                        SystemIO.Directory.CreateDirectory(filepath);
                    }
                    filepath = filepath + "Log_" + DateTime.Today.ToString("dd-MMM-yyyy") + ".html";   //html File Name
                    if (!SystemIO.File.Exists(filepath))
                    {
                        SystemIO.File.Create(filepath).Dispose();
                    }

                    oldtextfile = SystemIO.File.ReadAllText(filepath);

                    newtextfile = "<div style='width:100%; background-color:#eee; color:#444; border:1px solid #333; padding:5px;box-sizing:border-box; font-family:consolas; font-size:12px; margin-bottom:5px;'>" +
                        "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left; background-color:#f1f1f1;'>" +
                            "<b>Log Date : </b>" + DateTime.Now.ToString("dddd, dd-MMM-yyyy hh:mm:ss tt") + "<br>" +
                            "<b>Station : </b>" + station + "<br>" +
                            "<b>Operator ID : </b>" + opeid + "<br>" +
                            "<b>Client I.P : </b>" + ipaddr +
                        "</p>" +
                        "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                            "<b>URL : </b>" + exurl +
                        "</p>" +

                        "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                            "<b>Error Message : </b>" + Errormsg +
                        "</p>" +

                        "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                            "<b>Exception Type : </b>" + extype +
                        "</p>" +

                        "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                            "<b>Error Location : </b>" + ErrorLocation +
                        "</p>" +

                        "</div>";

                    SystemIO.File.WriteAllText(filepath, newtextfile + oldtextfile);

                    //using (StreamWriter sw = File.AppendText(filepath))
                    //{
                    //    sw.WriteLine("<div style='width:100%; background-color:#eee; color:#444; border:1px solid #333; padding:5px;box-sizing:border-box; font-family:consolas; font-size:12px; margin-bottom:5px;'>");

                    //    //basic information
                    //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left; background-color:#f1f1f1;'>");
                    //    sw.WriteLine("<b>Log Date : </b>" + DateTime.Now.ToString("dddd, dd-MMM-yy hh:mm:ss tt") + "<br>");
                    //        sw.WriteLine("<b>Station : </b>" + station + "<br>");
                    //        sw.WriteLine("<b>Operator ID : </b>" + opeid + "<br>");
                    //        sw.WriteLine("<b>Client I.P : </b>" + ipaddr);
                    //    sw.WriteLine("</p>");

                    //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>");
                    //        sw.WriteLine("<b>URL : </b>" + exurl);
                    //    sw.WriteLine("</p>");

                    //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>");
                    //        sw.WriteLine("<b>Error Message : </b>" + Errormsg);
                    //    sw.WriteLine("</p>");

                    //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>");
                    //     sw.WriteLine("<b>Exception Type : </b>" + extype);
                    //    sw.WriteLine("</p>");

                    //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>");
                    //        sw.WriteLine("<b>Error Location : </b>" + ErrorLocation);
                    //    sw.WriteLine("</p>");

                    //    sw.WriteLine("</div>");

                    //    sw.Flush();
                    //    sw.Close();

                    //}

                }
                catch (Exception e)
                {
                    e.ToString();

                }
            }

            public void LogDetail(string details)
            {

                string opeid = context.Current.Request.Cookies["ELOG_PAR1"].Value;
                string ipaddr = context.Current.Request.Cookies["ELOG_PAR2"].Value;
                string station = context.Current.Request.Cookies["ELOG_PAR3"].Value;

                string oldtextfile = "";
                string newtextfile = "";

                var line = Environment.NewLine + Environment.NewLine;


                try
                {
                    string filepath = context.Current.Server.MapPath("~/Logs/");  //html File Path
                    if (!SystemIO.Directory.Exists(filepath))
                    {
                        SystemIO.Directory.CreateDirectory(filepath);
                    }
                    filepath = filepath + "sql-error.html";   //html File Name
                    if (!SystemIO.File.Exists(filepath))
                    {
                        SystemIO.File.Create(filepath).Dispose();
                    }

                    oldtextfile = SystemIO.File.ReadAllText(filepath);

                    newtextfile = "<div style='width:100%; background-color:#eee; color:#444; border:1px solid #333; padding:5px;box-sizing:border-box; font-family:consolas; font-size:12px; margin-bottom:5px;'>" +
                        "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left; background-color:#f1f1f1;'>" +
                            "<b>Log Date : </b>" + DateTime.Now.ToString("dddd, dd-MMM-yyyy hh:mm:ss tt") + "<br>" +
                            "<b>Station : </b>" + station + "<br>" +
                            "<b>Operator ID : </b>" + opeid + "<br>" +
                            "<b>Client I.P : </b>" + ipaddr +
                        "</p>" +

                        "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                            "<b>Details : </b>" + details +
                        "</p>" +
                        "</div>";

                    SystemIO.File.WriteAllText(filepath, newtextfile + oldtextfile);



                }
                catch (Exception e)
                {
                    e.ToString();

                }
            }
        }
        #endregion



    }
}