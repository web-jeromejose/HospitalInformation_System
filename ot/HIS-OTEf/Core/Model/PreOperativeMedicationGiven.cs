using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PreOperativeMedicationGiven : BaseModel
    {
        public int Id { get; set; }
        public virtual int PreOperativeMedicationId { get; set; }

        //yes, no, n/a or maybe lol
        public bool? IsGiven { get; set; }

        public string OperationalValue { get; set; }

        public virtual PreOperativeMedication Medication { get; set; }

    }
}
