using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{

    public class IntegratedCarePlan : PatientCommon
    {

        public int Id { get; set; }
        public int No { get; set; }
        public string Problem { get; set; }
        public string NameAndSign { get; set; }
        public bool ResponsibleDiscipline_Nursing { get; set; }
        public bool ResponsibleDiscipline_Dietician { get; set; }
        public bool ResponsibleDiscipline_Physiotherapy { get; set; }
        public string ResponsibleDiscipline_Others { get; set; }

        public string ExpectedOutCome { get; set; }

        public virtual List<IntegratedCarePlan_OutComeStatus> IntegratedCarePlan_OutComeStatus { get; set; }
    }

    public class IntegratedCarePlan_OutComeStatus : BaseModel
    {
        public int Id { get; set; }
        public virtual int IntegratedCarePlanId { get; set; }

        public string OutComeDateTime { get; set; }
        public string Status { get; set; }
        public string Sign { get; set; }
    }

}
