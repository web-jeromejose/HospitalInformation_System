using HisBloodbankEf.Core.Model;
using HisBloodbankEf.Core.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.Interface
{
    public interface IReportBusiness
    {
       

    }

    public interface IDonorBusiness
    {
        List<BloodDonor> GetDonors(bool? active = null);
       
    }
}
