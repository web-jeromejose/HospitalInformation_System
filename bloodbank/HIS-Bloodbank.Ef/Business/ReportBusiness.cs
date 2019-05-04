using HisBloodbankEf.Core.Interface;
using HisBloodbankEf.Core.Model;
using HisBloodbankEf.Core.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Business
{

    public class ReportBusiness : BusinessBase, IReportBusiness
    {

        public ReportBusiness(IDataManager data) : base(data) { }

    }
}
