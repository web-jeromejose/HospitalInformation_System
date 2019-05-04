using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.ViewModel
{
    public class ReportVm
    {
    }

    public class BranchReportVm
    {
        public int Id { set; get; }
        public string Code { set; get; }
        public string Name { set; get; }
        public int Count { set; get; }
        public string BackColor { set; get; }
        public string HoverColor { set; get; }
    }

}
