using HIS_ITADMIN_EF.Core.Model;
using HIS_ITADMIN_EF.Core.Model.Sp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIS_ITADMIN_EF.Core.Interface
{
    public interface IBloodBankBusiness
    {
        bool AddBloodDonor();
    }

    public interface IAdminBusiness
    {
        Patient GetPatientByRegistrationNo(int regNo);
    }
    public interface IWholeBloodDonationBusiness
    {
        Patient GetPatient(string regNo);
        Sex GetSex();
       
   }
}
