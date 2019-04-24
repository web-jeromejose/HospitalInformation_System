using HIS_ITADMIN_EF.Core.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIS_ITADMIN_EF.Core.Model
{
    public class Donor : BaseModel
    {
        public virtual DonationType DonationType { get; set; }
        [StringLength(16)]
        public virtual string DonorNo { set; get; }
        public virtual int? RegistrationNo { get; set; }
        [StringLength(256)]
        public virtual string Name { get; set; }


        public virtual List<DonorVitalSign> VitalSign { get; set; }
        public virtual List<DonorQuestionaire> Questionaire { get; set; }
    }

    public class DonorVitalSign : BaseModel
    {
        public virtual int DonorId { get; set; }
        public virtual Donor Donor { get; set; }
        [StringLength(128)]
        public string Name { get; set; }
        [StringLength(128)]
        public string Code { set; get; }
    }

    public class DonorQuestionaire : BaseModel
    {
        public virtual int DonorId { get; set; }
        public virtual Donor Donor { get; set; }
        [StringLength(128)]
        public string Name { get; set; }
        [StringLength(128)]
        public string Code { set; get; }
    }


}
