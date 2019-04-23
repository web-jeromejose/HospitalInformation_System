using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PatientCommon :BaseModel
    {
        public int RegistrationNo { set; get; }
        
        public string IssueAuthorityCode { get; set; }

        public string PatientName { get; set; }

        public virtual string PIN
        {
            get
            {
                return this.IssueAuthorityCode + "." + this.RegistrationNo.ToString("000000000");
            }
        }
    }
}
