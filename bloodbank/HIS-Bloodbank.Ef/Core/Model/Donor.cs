using HisBloodbankEf.Core.Enum;
using HisBloodbankEf.Core.Extension;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.Model
{
    public class BloodDonor : BaseModel
    {
        public string RegistrationNo { set; get; }
        public string IdNo { set; get; }
        public string Name { set; get; }
        public DateTime BirthDate { set; get; }
        public int Gender { set; get; }
        public string GenderDesc { get { return ((GenderEnum)Gender).DescriptionAttr(); } }
        public int NationalityId { set; get; }
        public string Nationality { set; get; }
        //public string Nationality { set; get; }
    }



}
