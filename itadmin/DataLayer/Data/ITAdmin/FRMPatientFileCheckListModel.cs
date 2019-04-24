using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer.Data.ITAdmin
{
    public class FRMPatientFileCheckListModel
    {
        public string ErrorMessage { get; set; }


      

    }


    public class FRMPatientFileCheckList
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Header { get; set; }
        public string NoOfPages { get; set; }
        public string InclusiveDates { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
    }

}
