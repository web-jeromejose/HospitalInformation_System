using HIS_ITADMIN_EF.Core.Model;
using HIS_ITADMIN_EF.Core.Model.Sp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIS_ITADMIN_EF.Core.Interface
{
    public interface IDataManager
    {
        IRepository<Donor> Donor { get; }
        IRepository<DonorQuestionaire> DonorQuestionaire { get; }
        IRepository<DonorVitalSign> DonorVitalSign { get; }


        IDbHelper<Patient> Patient { get; }
        IDbHelper<Sex> Sex { get; }
    

    }
}

