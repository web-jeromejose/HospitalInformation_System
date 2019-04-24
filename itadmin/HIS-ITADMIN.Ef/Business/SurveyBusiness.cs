using HIS_ITADMIN_EF.Core.Interface;
using HIS_ITADMIN_EF.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIS_ITADMIN_EF.Business
{

    public class BloodBankBusiness : BusinessBase, IBloodBankBusiness
    {

        public BloodBankBusiness(IDataManager data) : base(data) { }

        public bool AddBloodDonor()
        {
            throw new NotImplementedException();
        }
    }
}
