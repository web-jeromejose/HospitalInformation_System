using HIS_ITADMIN_EF.Core.Interface;
using HIS_ITADMIN_EF.Core.Model;
using HIS_ITADMIN_EF.Core.Model.Sp;
using HIS_ITADMIN_EF.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIS_ITADMIN_EF.Business
{
    public class WholeBloodDonationBusiness : BusinessBase, IWholeBloodDonationBusiness 
    {

        public WholeBloodDonationBusiness(IDataManager data) : base(data) { }


        public Patient GetPatient(string regNo)
        {
            var param = new { regNo = regNo };
            var sp = "[BBEF].[WholeBloodDonation_GetPatient]";
            var patient = Data.Patient.Get(sp, param);
            return patient;
        }


        public Sex GetSex()
        {
            var param = new {  };
            var sp = " select 'test 'as name ";
            var patient = Data.Sex.Get(sp, param);
            return patient;
        }
         

    }
}
