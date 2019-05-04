using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class MasterLogs
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();

        #region Loginsert

        public bool loginsert(string tablename, string name, string costprice, string code, int operatorid, string comment)
        {
            //String strPathAndQuery = HttpContext.Current.Request.RawUrl;// HttpContext.Current.Request.Url.PathAndQuery;
            // String url = HttpContext.Current.Request.RawUrl;// HttpContext.Current.Request.Url.PathAndQuery;
            string strPathAndQuery = HttpContext.Current.Request.Url.AbsolutePath;
            String url = HttpContext.Current.Request.Url.AbsoluteUri.Replace(strPathAndQuery, "/");

            string sql = @" 


 if not exists(select * from sys.tables where name = 'BB_Logs_Web_Module') 
 BEGIN 
  
 	CREATE TABLE [BloodBank].[BB_Logs_Web_Module] 
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
  
insert into [BloodBank].[BB_Logs_Web_Module] 
(TableName,Name,CostPrice,Code,OperatorID,Comment)
values 
('" + tablename + @"','" + name + @"','" + costprice + @"','" + code + @"','" + operatorid + @"','" + url + @">>Details-" + comment + @"    ') ";


            string sql1 = Regex.Replace(sql, @"\t|\n|\r|%|&|http|https", "");

            db.ExecuteSQL(sql1);
            return true;
        }

        #endregion
    }
}