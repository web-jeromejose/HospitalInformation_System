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

    public class AdminBusiness : BusinessBase, IAdminBusiness
    {
        public AdminBusiness(IDataManager data) : base(data) { }

        public Patient GetPatientByRegistrationNo(int regNo)
        {
            var param = new { ReginstrationNo = regNo };
            var sp = "[BBEF].[Patient_GetByRegNo]";
            var patient = Data.Patient.Get(sp, param);
            return patient;
        }
    }
}
