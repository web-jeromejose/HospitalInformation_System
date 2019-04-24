using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text;

namespace DataLayer
{

    public class CashierReceiptPrintingModel
    {
 
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public List<ReceiptDetailsVM> ReceiptDetails( string receiptno)
        {
         

            StringBuilder sql = new StringBuilder();
            sql.Append(@" 
                        if not exists(select * from sys.tables where name = 'PrintLog_Collection')
                        BEGIN

                                CREATE TABLE[CASHIER].[PrintLog_Collection](

                                    [ID][int] IDENTITY(1, 1) NOT NULL,

                                    [OR_NO] [varchar] (10) NULL,
			                        [DatePrinted] [datetime] NULL,
			                        [PrintedBy] [int] NULL,
			                        [Remarks] [varchar] (50) NULL
		                        ) ON[MasterFile]

                        END
 

            

                        select  distinct a.OR_NO 
                        from [CASHIER].[PrintLog_Collection] a                        
                        where OR_NO = '" + receiptno + @"'  

                ");

           sql.Append(" ");
      
            return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ReceiptDetailsVM>();

        }
 
        public string SAVE(string id, int OperatorId)
        {
            StringBuilder sql = new StringBuilder();
            sql.Append(@" 
                       
                            declare @operatorid int = " + OperatorId + @"
                            if exists (select * from [CASHIER].[PrintLog_Collection] a where OR_NO = '" + id + @"')
                            BEGIN
                             update [CASHIER].[PrintLog_Collection] 
                             SET 
                             OR_NO =  convert(varchar(10),OR_NO+'-IT' )
                            , Remarks =  convert(varchar(50), Remarks+'-IT-'+cast(@operatorid as varchar(max))+'-'+convert(varchar(11),getdate() , 113))
                              where OR_NO = '" + id + @"'

                            END
                ");

            sql.Append(" ");
            db.ExecuteSQLAndReturnDataTableLive(sql.ToString());
            return "Done";

        }



    }


    public class ReceiptDetailsVM
    {
 
        public string OR_NO { get; set; }
      
    }
}
