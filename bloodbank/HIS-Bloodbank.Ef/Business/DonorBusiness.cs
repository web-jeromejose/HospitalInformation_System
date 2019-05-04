using HisBloodbankEf.Core.Interface;
using HisBloodbankEf.Core.Model;
using HisBloodbankEf.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Business
{

    public class DonorBusiness : BusinessBase, IDonorBusiness
    {
        public DonorBusiness(IDataManager data) : base(data) { }

        public List<BloodDonor> GetDonors(bool? active = null)
        {
            if (active.HasValue)
                return Data.Donor.GetAll().Where(c => c.Active == active).ToList();
            else
                return Data.Donor.GetAll().OrderBy(c => c.Id).ToList();
        }

    }
}
